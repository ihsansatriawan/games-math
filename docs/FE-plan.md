# Frontend Technical Specification: Fase 1 (Mock & UI)

**Fokus Utama:** Membangun seluruh UI, *routing*, dan menyimulasikan logika *real-time* menggunakan *state* lokal (Context API) sebelum integrasi *backend*.

---

## 1. Kebutuhan Lingkungan & Dependensi

Pastikan menggunakan versi dependensi berikut untuk stabilitas pengembangan:

* **Environment:** Node.js v18+
* **Scaffolding:** Vite 
    ```bash
    npm create vite@latest tarik-ketupat -- --template react
    ```
* **Styling:** Tailwind CSS v3 
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
* **Routing:** React Router v6 
    ```bash
    npm install react-router-dom
    ```
* **Icons & Assets:** Lucide React 
    ```bash
    npm install lucide-react
    ```
* **QR Code Generator:** qrcode.react 
    ```bash
    npm install qrcode.react
    ```

---

## 2. Struktur Direktori Utama

Buat struktur folder di dalam `/src` secara persis seperti ini untuk menjaga pemisahan ranah (*separation of concerns*) antara komponen Host dan Player.

```text
src/
├── assets/
│   └── images/              # SVG Ketupat, ilustrasi latar belakang
├── components/
│   ├── shared/              # Komponen yang dipakai Host dan Player
│   │   └── Button.jsx       
│   ├── host/                # Komponen khusus proyektor
│   │   ├── TimerBar.jsx
│   │   └── KetupatAnim.jsx
│   └── player/              # Komponen khusus HP
│       └── AnswerPad.jsx    # Grid 4 tombol raksasa
├── context/
│   └── MockGameContext.jsx  # State management lokal untuk simulasi Fase 1
├── data/
│   └── mockSoal.json        # Data statis bank soal
├── pages/
│   ├── Home.jsx             # Landing page: Pilih Host / Player
│   ├── host/
│   │   ├── HostSetup.jsx
│   │   ├── HostLobby.jsx
│   │   ├── HostGameplay.jsx
│   │   └── HostResult.jsx
│   └── player/
│       ├── PlayerJoin.jsx
│       ├── PlayerWaiting.jsx
│       ├── PlayerGamepad.jsx
│       └── PlayerResult.jsx
├── App.jsx                  # Konfigurasi React Router
└── main.jsx

```

---

## 3. Peta Routing (React Router)

Konfigurasikan `App.jsx` menggunakan `BrowserRouter`. Pisahkan jalur utama menjadi dua cabang: `/host/*` dan `/play/*`.

| Route Path | Komponen Target | Keterangan Layar |
| --- | --- | --- |
| `/` | `Home.jsx` | Halaman awal. Tombol navigasi ke `/host` atau `/play`. |
| `/host` | `HostSetup.jsx` | Form pengaturan game (Mode, Kesulitan). |
| `/host/lobby` | `HostLobby.jsx` | Tampilan PIN raksasa, QR Code, dan daftar siswa. |
| `/host/game` | `HostGameplay.jsx` | Tampilan soal utama dan animasi tarik ketupat. |
| `/host/result` | `HostResult.jsx` | Papan skor pemenang. |
| `/play` | `PlayerJoin.jsx` | Form input PIN dan Nama Panggilan. |
| `/play/wait` | `PlayerWaiting.jsx` | Tampilan tim (Opor/Rendang) menunggu host mulai. |
| `/play/game` | `PlayerGamepad.jsx` | Kontroler 4 tombol (A, B, C, D). |
| `/play/result` | `PlayerResult.jsx` | Status menang/kalah di HP siswa. |

---

## 4. Manajemen State Lokal (MockGameContext)

Pada Fase 1, gunakan React Context (`MockGameContext.jsx`) untuk mensimulasikan database. Ini memungkinkan developer menguji alur aplikasi seolah-olah HP siswa mengirim data ke proyektor saat dibuka di dua *tab* browser yang sama.

**State yang Wajib Ada:**

* `roomPin` (String): PIN 6 digit saat ini.
* `gameStatus` (String): `'idle'`, `'lobby'`, `'playing'`, `'finished'`.
* `players` (Array of Objects): Daftar siswa yang bergabung (contoh: `[{ name: 'Hafizh', team: 'opor' }]`).
* `currentQuestion` (Object): Data soal yang sedang aktif.
* `teamScores` (Object): Persentase tarikan ketupat (contoh: `{ opor: 0, rendang: 0 }`).

**Fungsi Mocking (Simulasi Backend):**

* `createRoom(config)`: Menghasilkan PIN acak, set status ke `'lobby'`.
* `joinRoom(pin, name)`: Validasi PIN, masukkan nama ke array `players`, assign tim secara acak.
* `startGame()`: Ubah status ke `'playing'`, jalankan timer lokal 10 detik.
* `submitAnswer(team, isCorrect)`: Fungsi yang dipanggil oleh tombol HP siswa. Jika `isCorrect` bernilai `true`, inkremen nilai `teamScores` untuk tim tersebut.

---

## 5. Spesifikasi Data Standar (Mock Data Schema)

Buat file `src/data/mockSoal.json` dengan struktur JSON berikut. Data ini akan dirender oleh `HostGameplay.jsx` dan `PlayerGamepad.jsx`.

```json
[
  {
    "id": "q_001",
    "tipe": "penjumlahan",
    "soal": "Ibu merebus 8 ketupat. Ayah membawa 5 ketupat lagi. Totalnya?",
    "opsi": {
      "A": "11",
      "B": "12",
      "C": "13",
      "D": "14"
    },
    "jawaban_benar": "C"
  },
  {
    "id": "q_002",
    "tipe": "pengurangan",
    "soal": "Ada 15 kue nastar. Dimakan Hafizh 4. Sisa berapa?",
    "opsi": {
      "A": "10",
      "B": "11",
      "C": "12",
      "D": "13"
    },
    "jawaban_benar": "B"
  }
]

```

---

## 6. Spesifikasi Komponen Kritis

### A. Komponen Animasi Tarik Ketupat (`KetupatAnim.jsx`)

* **Lokasi Render:** Hanya muncul di halaman `HostGameplay.jsx`.
* **Props:** Menerima `scoreOpor` (Number) dan `scoreRendang` (Number).
* **Logika Visual:**
1. Hitung selisih skor: `netPosition = scoreRendang - scoreOpor`.
2. Batasi batas pergerakan dari `-50%` (kiri mentok) hingga `+50%` (kanan mentok) relatif dari titik tengah kontainer.
3. Terapkan menggunakan *inline style*: `transform: translateX(${netPosition}%)`.
4. Gunakan utilitas Tailwind `transition-transform duration-500 ease-out` agar animasi pergeseran mulus.



### B. Komponen Kontroler Siswa (`AnswerPad.jsx`)

* **Lokasi Render:** Hanya muncul di halaman `PlayerGamepad.jsx`.
* **Props:** Menerima data soal saat ini dari Context.
* **Internal State:** `selectedAnswer` (String atau null), `isSubmitted` (Boolean).
* **Interaksi UI:**
1. Render 4 tombol menggunakan CSS Grid: `className="grid grid-cols-2 gap-4 h-[70vh]"`.
2. Saat fungsi `onClick` dipicu:
* Set `isSubmitted` menjadi `true`.
* Ubah warna latar tombol (Hijau jika sesuai `jawaban_benar`, Merah jika salah).
* Eksekusi fungsi `submitAnswer()` ke Context.
* Nonaktifkan semua tombol: tambahkan kelas `opacity-50 pointer-events-none`.


3. Gunakan `useEffect` yang *listen* ke perubahan `currentQuestion`. Jika ID soal berubah, reset `selectedAnswer` ke `null` dan `isSubmitted` ke `false`.
