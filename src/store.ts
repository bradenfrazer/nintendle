import create from 'zustand'
import { persist } from 'zustand/middleware'
import { computeGuess, getTodaysWord, LetterState } from './utils/word-utils'

export const NUMBER_OF_GUESSES = 6
export const WORD_LENGTH = 5

const date = new Date()
const year = 2020 //hard code year as a leap year so that puzzle & day # match every year
export const DAY_NUMBER =
	(Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 0)) /
	24 /
	60 /
	60 /
	1000

export interface GuessRow {
	guess: string
	result?: LetterState[]
}

interface StoreState {
	answer: string
	last_played_date: string
	rows: GuessRow[]
	gameState: 'playing' | 'won' | 'lost'
	keyboardLetterState: { [letter: string]: LetterState }
	addGuess: (guess: string) => void
	newGame: (initialGuess?: string[]) => void
}

export const getDate = (): string => {
	const todaysDate = new Date()
	return todaysDate.toDateString()
}

export const useStore = create<StoreState>(
	persist(
		(set, get) => {
			function addGuess(guess: string) {
				const result = computeGuess(guess, get().answer)

				const didWin = result.every((i) => i === LetterState.Match)

				const rows = [
					...get().rows,
					{
						guess,
						result,
					},
				]

				const keyboardLetterState = get().keyboardLetterState
				result.forEach((r, index) => {
					const resultGuessLetter = guess[index]

					const currentLetterState = keyboardLetterState[resultGuessLetter]

					switch (currentLetterState) {
						case LetterState.Match:
							break
						case LetterState.Present:
							if (r === LetterState.Miss) {
								break
							}
						default:
							keyboardLetterState[resultGuessLetter] = r
							break
					}
				})

				const gameState = didWin
					? 'won'
					: rows.length === NUMBER_OF_GUESSES
					? 'lost'
					: 'playing'

				set((state) => ({
					rows,
					keyboardLetterState,
					gameState,
				}))
			}
			return {
				answer: getTodaysWord(),
				last_played_date: getDate(),
				rows: [],
				keyboardLetterState: {},
				gameState: 'playing',
				addGuess,
				newGame: (initialRows = []) => {
					set({
						answer: getTodaysWord(),
						last_played_date: getDate(),
						rows: [],
						keyboardLetterState: {},
						gameState: 'playing',
					})

					initialRows.forEach(addGuess)
				},
			}
		},
		{
			name: 'nintendle',
		}
	)
)

//useStore.persist.clearStorage()
