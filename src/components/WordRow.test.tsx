import { describe, expect, it } from 'vitest'
import WordRow from '../components/WordRow'
import { render } from '../test/test-utils'

describe('WordRow tests', () => {
	it('renders a word', () => {
		render(<WordRow letters={'mario'} />)

		//check that text in the word row displays
		expect(document.querySelector('div')?.textContent).toEqual('mario')
	})
})
