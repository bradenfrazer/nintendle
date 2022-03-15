import { describe, expect, it } from 'vitest'
import Modal from '../components/Modal'
import { render } from '../test/test-utils'

describe('Modal tests', () => {
	it('shows the modal', () => {
		render(
			<Modal title='Title' show={true} onClose={() => {}}>
				<p>Test content</p>
			</Modal>
		)

		//check that copy in the modal exists
		expect(document.getElementById('modal')?.textContent).toContain(
			'Test content'
		)
	})
})
