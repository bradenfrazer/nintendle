import { describe, expect, it, vi } from 'vitest'
import Stats from '../components/Stats'
import { useStore } from '../store'
import { render, screen } from '../test/test-utils'

describe('Stats modal tests', () => {
	document.execCommand = vi.fn()
	it('shows the lost game over state', () => {
		useStore.getState().newGame(Array(6).fill('mario'))
		const rows = useStore.getState().rows
		render(<Stats rows={rows} isWon={false} answer={'luigi'} />)

		//check that copy in the game over modal exists
		expect(screen.getByText("Today's answer is")).toBeInTheDocument()
	})
	it('shows the won game over state', () => {
		useStore.getState().newGame(Array(2).fill('mario'))
		const answer = useStore.getState().answer
		useStore.getState().addGuess(answer)
		const rows = useStore.getState().rows
		render(<Stats rows={rows} isWon={true} answer={answer} />)

		//check that copy in the game win modal exists
		expect(
			screen.getByText(`guessed in ${rows.length} tries`)
		).toBeInTheDocument()
	})
	it('lets the user copy their game state', async () => {
		useStore.getState().newGame(Array(2).fill('mario'))
		const answer = useStore.getState().answer
		useStore.getState().addGuess(answer)
		const rows = useStore.getState().rows
		render(<Stats rows={rows} isWon={true} answer={answer} />)

		//check that the share button is rendered
		const shareButton = document.getElementById('shareButton')
		expect(shareButton).toBeInTheDocument()

		//click the share button and check the browser's copy getting called
		shareButton?.click()
		expect(document.execCommand).toHaveBeenCalledWith(
			'copy',
			true,
			expect.stringContaining('Nintendle')
		)
	})
})
