import { describe, expect, it } from 'vitest'
import App from './App'
import { useStore } from './store'
import { render, screen, userEvent } from './test/test-utils'

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<App />)
    expect(document.getElementById('logo')?.textContent).toEqual('Nintendle')
  })
  it('shows empty state', () => {
    useStore.getState().newGame([])
    render(<App />)
    expect(screen.queryByText('next Nintendle in')).toBeNull()
    expect(document.getElementById('gameBoard')?.getElementsByClassName('wordRow')).toHaveLength(6)
    expect(document.querySelector('main')?.textContent).toEqual('')
  })
  it('shows one row of guesses', () => {
    useStore.getState().newGame(['mario'])
    render(<App />)

    expect(document.querySelector('main')?.textContent).toEqual('mario')
  })
})