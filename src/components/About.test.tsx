import { describe, expect, it } from 'vitest'
import About from '../components/About'
import { render } from '../test/test-utils'

describe('About modal tests', () => {
  it('shows the about modal', () => {
    render(<About />)

    //check that copy in the about modal exists
    expect(document.getElementById('about')?.textContent).toContain('Nintendle')
  })
})