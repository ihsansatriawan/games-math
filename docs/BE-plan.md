# Technical Specification: Fase 2 (Backend & Real-Time Sync)

**Fokus Utama:** Menghubungkan antarmuka React dengan *Backend-as-a-Service* (Supabase). Mengganti `MockGameContext` dengan koneksi *multiplayer* sungguhan menggunakan Supabase Realtime Broadcast agar sinkronisasi data antar *device* berjalan instan tanpa membebani *database*.

---

## 1. Persiapan Infrastruktur & Dependensi

* **Platform BaaS:** Supabase (Daftar dan buat proyek baru di [supabase.com](https://supabase.com)).
* **Dependensi Klien:** Instal *library* resmi Supabase di proyek React (Fase 1).
    ```bash
    npm install @supabase/supabase-js
    ```
* **Environment Variables:** Buat file `.env.local` di *root* proyek frontend dan masukkan *keys* dari *dashboard* Supabase (Settings > API).
    ```env
    VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
    VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
    ```

---

## 2. Skema Database (PostgreSQL)

Kita hanya menggunakan *database* untuk manajemen ruangan dasar. Jawaban pemain **tidak** disimpan di tabel ini untuk menghemat kuota *Read/Write*.

Jalankan perintah SQL berikut di **Supabase SQL Editor** untuk membuat tabel `rooms`:

```sql
CREATE TABLE public.rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pin varchar(6) NOT NULL UNIQUE,
  status varchar(20) DEFAULT 'lobby'::character varying NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Atur Row Level Security (RLS) agar bisa diakses secara publik (untuk MVP)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.rooms FOR UPDATE USING (true);

```

---

## 3. Autentikasi (Anonymous Sign-In)

Siswa tidak perlu membuat akun dengan email. Aktifkan fitur login anonim.

1. Masuk ke Supabase Dashboard > **Authentication** > **Providers**.
2. Cari **Anonymous** dan aktifkan (*Enable*).

Di dalam kode React (saat Siswa klik "GABUNG"), jalankan fungsi ini sebelum masuk ke *channel* ruangan:

```javascript
const { data, error } = await supabase.auth.signInAnonymously();

```

---

## 4. Arsitektur Realtime Broadcast

Gunakan fitur **Broadcast** dari Supabase. Fitur ini menggunakan WebSockets untuk mengirim pesan antar klien secara langsung (Player -> Host) tanpa menyimpan data ke PostgreSQL.

**A. Logika Host (Layar Proyektor)**
Host bertugas sebagai *server* lokal. Host membuka *channel* ruangan dan *listen* (mendengarkan) kiriman data dari Player.

```javascript
// Di komponen HostGameplay.jsx
const roomChannel = supabase.channel(`room-${pin}`);

roomChannel
  .on('broadcast', { event: 'player_answer' }, (payload) => {
    // 1. Tangkap payload dari HP siswa
    const { team, isCorrect } = payload.payload;
    
    // 2. Kalkulasi skor lokal di state React Host
    if (isCorrect) {
       setTeamScores(prev => ({
         ...prev,
         [team]: prev[team] + 1
       }));
    }
  })
  .subscribe();

```

**B. Logika Player (Layar HP Siswa)**
Player bergabung ke *channel* yang sama, namun tugasnya hanya mengirim (*send*) *payload* saat tombol jawaban ditekan.

```javascript
// Di komponen PlayerGamepad.jsx
const roomChannel = supabase.channel(`room-${pin}`);

// Dipanggil saat tombol A/B/C/D diklik
const sendAnswer = async (team, isCorrect) => {
  await roomChannel.send({
    type: 'broadcast',
    event: 'player_answer',
    payload: { team, isCorrect },
  });
};

```

---

## 5. API Contract (Struktur Payload Event)

Pastikan tipe `event` dan struktur `payload` identik antara pengirim dan penerima. Berikut adalah kontrak data (*API Contract*) yang disepakati untuk MVP ini:

### Event 1: `player_join` (Dikirim Player -> Diterima Host)

* **Kapan:** Saat siswa berhasil input PIN dan masuk Halaman Tunggu.
* **Tujuan:** Memunculkan nama siswa di Halaman Lobi Host.
* **Payload:**
```json
{
  "type": "broadcast",
  "event": "player_join",
  "payload": {
    "playerName": "Hafizh",
    "team": "opor"
  }
}

```



### Event 2: `player_answer` (Dikirim Player -> Diterima Host)

* **Kapan:** Saat siswa menekan tombol jawaban (A, B, C, D) di *Gamepad*.
* **Tujuan:** Host mengakumulasi skor dan menggeser animasi ketupat.
* **Payload:**
```json
{
  "type": "broadcast",
  "event": "player_answer",
  "payload": {
    "team": "rendang",
    "isCorrect": true
  }
}

```



### Event 3: `next_question` (Dikirim Host -> Diterima Player)

* **Kapan:** Saat *timer* 10 detik di layar Host habis dan soal baru dimuat.
* **Tujuan:** Memberi tahu HP siswa agar mereset status tombol (dari *disabled* kembali menjadi aktif).
* **Payload:**
```json
{
  "type": "broadcast",
  "event": "next_question",
  "payload": {
    "questionId": "q_002"
  }
}

```



---

## 6. Transisi dari Fase 1 ke Fase 2

Instruksi spesifik bagi developer frontend untuk mengimplementasikan *backend* ini:

1. Buat file utilitas `src/lib/supabase.js` untuk menginisialisasi *client* Supabase.
2. Buka file `MockGameContext.jsx` dari Fase 1. Ganti fungsi-fungsi statis (`createRoom`, `joinRoom`) agar melakukan operasi `INSERT` dan `SELECT` ke tabel `rooms` Supabase.
3. Ganti logika *timer* dan perubahan skor agar tersinkronisasi murni dari penerimaan *event* Broadcast Supabase, bukan lagi dari manipulasi *state* lokal secara langsung.

