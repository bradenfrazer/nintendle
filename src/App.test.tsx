import { describe, expect, it } from 'vitest'
import App from './App'
import { useStore } from './store'
import { render, screen, userEvent } from './test/test-utils'

describe('Simple working tests for app', () => {
  it('the title is visible', () => {
    render(<App />)

    //check that text "Nintendle" exists inside of #logo
    expect(document.getElementById('logo')?.textContent).toEqual('Nintendle')
  })
  it('shows empty state', () => {
    useStore.getState().newGame([])
    render(<App />)

    //check that stats modal is not rendered (i.e. that game is not over)
    expect(document.getElementById('stats')).toBeNull()
  
    //check for game board to contain 6 word rows
    expect(document.getElementById('gameBoard')?.getElementsByClassName('wordRow')).toHaveLength(6)

    //check that there is no text content filled in inside game board
    expect(document.getElementById('gameBoard')?.textContent).toEqual('')
  })
  it('shows one row of guesses', () => {
    useStore.getState().newGame(['mario'])
    render(<App />)

    //check that game board contains guess "mario" that was added
    expect(document.getElementById('gameBoard')?.textContent).toEqual('mario')
  })
  it('allows you to type with onscreen keyboard', () => {
    useStore.getState().newGame([])
    render(<App />)

    const keyboard = document.getElementById('keyboard')
    keyboard?.getElementsByTagName('button')[0].click()

    //check that game board contains letter that was clicked
    expect(document.getElementById('gameBoard')?.textContent).toEqual('q')
  })
})