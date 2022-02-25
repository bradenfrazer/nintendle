import { describe, expect, it } from 'vitest'
import Keyboard from '../components/Keyboard'
import { render, screen } from '../test/test-utils'

describe('Keyboard tests', () => {
  it('renders a set of keys', () => {
    render(<Keyboard onClick={ ()=> {} } disabled={false} />)

    //check that text in the word row displays
    expect(document.getElementById('keyboard')?.textContent).toContain('qwerty')
  })
})
