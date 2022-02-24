import { describe, expect, it } from 'vitest'
import Stats from '../components/Stats'
import { useStore } from '../store'
import { render, screen, userEvent } from '../test/test-utils'

describe('Simple working test', () => {
  it('shows the lost game over state', () => {
    useStore.getState().newGame(Array(6).fill('mario'))
    const rows = useStore.getState().rows
    render(<Stats rows={rows} isWon={false} answer={'luigi'}/>)

    expect(screen.getByText("Today's answer is")).toBeInTheDocument()
  })
  it('shows the won game over state', () => {
    useStore.getState().newGame(Array(2).fill('mario'))
    const answer = useStore.getState().answer
    useStore.getState().addGuess(answer)
    const rows = useStore.getState().rows
    render(<Stats rows={rows} isWon={true} answer={answer}/>)

    expect(screen.getByText(`guessed in ${ rows.length } tries`)).toBeInTheDocument()
  })
})