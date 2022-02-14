import { describe, expect, it } from 'vitest'
import { computeGuess, getRandomWord, LetterState } from './word-utils'
import { render, screen } from './test/test-utils'

describe('getRandomWord', () => {
  it('random word', () => {
    expect(getRandomWord()).toBeTruthy();
    expect(getRandomWord().length).toEqual(5);
  })
})

describe('computeGuess', () => {
  it('works with match and present', () => {
    expect(computeGuess('mario','chrom')).toEqual([
      LetterState.Present,
      LetterState.Miss,
      LetterState.Match,
      LetterState.Miss,
      LetterState.Present
    ])
  })
  it('works with all matches', () => {
    expect(computeGuess('luigi','luigi')).toEqual([
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match
    ])
  })
  it('works with full miss', () => {
    expect(computeGuess('sonic','zelda')).toEqual([
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss
    ])
  })
  it('only does one match when two letters are present', () => {
    expect(computeGuess('sonic','samus')).toEqual([
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss
    ])
  })
})