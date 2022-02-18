import { describe, expect, it } from 'vitest'
import App from './App'
import { useStore } from './store'
import { render, screen, userEvent } from './test/test-utils'

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<App />)
    expect(screen.getByText(/Nintendle/i)).toBeInTheDocument()
  })
  it('shows empty state', () => {
    useStore.getState().newGame([])
    render(<App />)
    expect(screen.queryByText('Game Over')).toBeNull()
    expect(document.querySelectorAll('main div')).toHaveLength(6)
    expect(document.querySelector('main')?.textContent).toEqual('')
  })
  it('shows one row of guesses', () => {
    useStore.getState().newGame(['mario'])
    render(<App />)

    expect(document.querySelector('main')?.textContent).toEqual('mario')
  })
  it('shows the lost game over state', () => {
    useStore.getState().newGame(Array(6).fill('mario'))
    render(<App />)

    expect(screen.getByText('Game Over!')).toBeInTheDocument()
  })
  it('shows the won game over state', () => {
    useStore.getState().newGame(Array(2).fill('mario'))
    const answer = useStore.getState().answer
    useStore.getState().addGuess(answer)
    render(<App />)

    expect(screen.getByText('Game Over!')).toBeInTheDocument()
  })
  it('can start a new game', () => {
    useStore.getState().newGame(Array(6).fill('mario'))
    render(<App />)

    expect(screen.getByText('Game Over!')).toBeInTheDocument()
    userEvent.click(screen.getByText('New Game'))
    expect(document.querySelector('main')?.textContent).toEqual('')
  })
})