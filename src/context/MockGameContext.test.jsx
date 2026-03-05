import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MockGameProvider, useMockGame } from './MockGameContext'

function TestHarness({ action }) {
  const ctx = useMockGame()
  return (
    <div>
      <span data-testid="status">{ctx.gameStatus}</span>
      <span data-testid="pin">{ctx.roomPin}</span>
      <span data-testid="players">{ctx.players.length}</span>
      <span data-testid="opor">{ctx.teamScores.opor}</span>
      <span data-testid="rendang">{ctx.teamScores.rendang}</span>
      <button onClick={() => ctx.createRoom({ mode: 'penjumlahan', difficulty: 'mudah' })}>create</button>
      <button onClick={() => ctx.joinRoom(ctx.roomPin, 'Hafizh')}>join</button>
      <button onClick={() => ctx.startGame()}>start</button>
      <button onClick={() => ctx.submitAnswer('opor', true)}>correct</button>
      <button onClick={() => ctx.submitAnswer('rendang', false)}>wrong</button>
    </div>
  )
}

describe('MockGameContext', () => {
  it('starts with idle status', () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    expect(screen.getByTestId('status').textContent).toBe('idle')
  })

  it('createRoom sets status to lobby and generates PIN', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    expect(screen.getByTestId('status').textContent).toBe('lobby')
    expect(screen.getByTestId('pin').textContent).toMatch(/^\d{6}$/)
  })

  it('joinRoom adds a player', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('join').click())
    expect(Number(screen.getByTestId('players').textContent)).toBe(1)
  })

  it('startGame sets status to playing', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('start').click())
    expect(screen.getByTestId('status').textContent).toBe('playing')
  })

  it('correct answer adds 10 points to team score', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('start').click())
    await act(() => screen.getByText('correct').click())
    expect(Number(screen.getByTestId('opor').textContent)).toBe(10)
  })

  it('wrong answer does not change score', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('start').click())
    await act(() => screen.getByText('wrong').click())
    expect(Number(screen.getByTestId('rendang').textContent)).toBe(0)
  })
})
