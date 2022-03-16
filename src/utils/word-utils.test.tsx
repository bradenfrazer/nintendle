import { describe, expect, it } from 'vitest'
import {
	computeGuess,
	getRandomWord,
	isValidWord,
	LetterState,
} from './word-utils'
import { render, screen } from '../test/test-utils'

describe('getRandomWord', () => {
	it('random word', () => {
		expect(getRandomWord()).toBeTruthy()
		expect(getRandomWord().length).toEqual(5)
	})
})

describe('computeGuess', () => {
	it('works with match and present', () => {
		expect(computeGuess('mario', 'chrom')).toEqual([
			LetterState.Present,
			LetterState.Miss,
			LetterState.Match,
			LetterState.Miss,
			LetterState.Present,
		])
	})
	it('works with all matches', () => {
		expect(computeGuess('luigi', 'luigi')).toEqual([
			LetterState.Match,
			LetterState.Match,
			LetterState.Match,
			LetterState.Match,
			LetterState.Match,
		])
	})
	it('works with full miss', () => {
		expect(computeGuess('sonic', 'zelda')).toEqual([
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Miss,
		])
	})
	it('only does one match when two letters are present in answer', () => {
		expect(computeGuess('sonic', 'samus')).toEqual([
			LetterState.Match,
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Miss,
		])
	})
	it('does one match and one present when two letters are present in guess and answer', () => {
		expect(computeGuess('goron', 'onion')).toEqual([
			LetterState.Miss,
			LetterState.Present,
			LetterState.Miss,
			LetterState.Match,
			LetterState.Match,
		])
	})
	it('returns empty array when given incomplete guess', () => {
		expect(computeGuess('toad', 'mario')).toEqual([])
	})
	it('when 2 letters are present but answer has only 1 of those letters', () => {
		expect(computeGuess('samus', 'daisy')).toEqual([
			LetterState.Present,
			LetterState.Match,
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Miss,
		])
	})
	it('when 1 letter matches but guess has more of the same letter', () => {
		expect(computeGuess('luigi', 'daisy')).toEqual([
			LetterState.Miss,
			LetterState.Miss,
			LetterState.Match,
			LetterState.Miss,
			LetterState.Miss,
		])
	})
})

describe('isValidWord', () => {
	it('works with a valid word', () => {
		expect(isValidWord('mario')).toBe(true)
	})
	it('works with an invalid word', () => {
		expect(isValidWord('aaaaa')).toBe(false)
	})
})
