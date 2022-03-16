import '@fontsource/press-start-2p'
import FeatherIcon from 'feather-icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { useStore, getDate, NUMBER_OF_GUESSES, WORD_LENGTH } from './store'
import { isValidWord } from './utils/word-utils'
import Keyboard from './components/Keyboard'
import WordRow from './components/WordRow'
import About from './components/About'
import Modal from './components/Modal'
import Stats from './components/Stats'
import Tooltip from './components/Tooltip'

export default function App() {
	const state = useStore()

	const [guess, setGuess, addGuessLetter] = useGuess()
	const [showInvalidGuess, setInvalidGuess] = useState(false)
	const addGuess = useStore((s) => s.addGuess)
	const previousGuess = usePrevious(guess)

	const [showStats, setStats] = useState(true)
	const openStatsModal = () => setStats(true)
	const closeStatsModal = () => setStats(false)

	const [showAbout, setAbout] = useState(false)
	const openAboutModal = () => setAbout(true)
	const closeAboutModal = () => setAbout(false)

	const [showGameOver, setGameOver] = useState(false)
	const isGameOver = state.gameState !== 'playing'
	const isWon = state.gameState === 'won'

	//delay game over screen until last guess finishes animating
	useEffect(() => {
		let id: any
		if (isGameOver) {
			id = setTimeout(() => {
				if (!showAbout) setGameOver(true)
			}, 2000)
		}
		return () => clearTimeout(id)
	}, [isGameOver, showAbout])

	//handle invalid guess pop up
	useEffect(() => {
		let id: any
		if (showInvalidGuess) {
			id = setTimeout(() => setInvalidGuess(false), 1500)
		}
		return () => clearTimeout(id)
	}, [showInvalidGuess])

	//handle guess submissions
	useEffect(() => {
		if (isGameOver || showAbout) return
		if (guess.length === 0 && previousGuess?.length === WORD_LENGTH) {
			if (isValidWord(previousGuess)) {
				addGuess(previousGuess)
				setInvalidGuess(false)
			} else {
				setInvalidGuess(true)
				setGuess(previousGuess)
			}
		}
	}, [guess])

	let rows = [...state.rows]
	if (rows.length < NUMBER_OF_GUESSES) {
		rows.push({ guess })
	}
	const numberOfGuessesRemaining = NUMBER_OF_GUESSES - rows.length
	rows = rows.concat(Array(numberOfGuessesRemaining).fill(''))

	const date = getDate()

	if (state.last_played_date !== date) {
		//@ts-ignore
		useStore.persist.clearStorage()
		state.newGame()
		setGuess('')
	}

	// handle native dark mode
	const colorSchemeMediaQuery = window.matchMedia(
		'(prefers-color-scheme: dark)'
	)
	let useDarkMode = colorSchemeMediaQuery.matches

	colorSchemeMediaQuery.addEventListener('change', function (evt) {
		useDarkMode = evt.matches
	})

	//main app ui
	return (
		<div className='h-screen relative flex flex-col justify-between dark:bg-gray-900'>
			<header className='flex justify-between items-center border-b border-gray-300 dark:border-gray-700 px-4 py-2 mb-4'>
				<button
					onClick={openAboutModal}
					className='transition-all duration-300 ease-in-out
            hover:opacity-50'>
					<FeatherIcon
						icon='info'
						color={useDarkMode ? '#ffffff' : '#000000'}
					/>
				</button>
				<h1
					id='logo'
					className='inline-block text-2xl text-red-500 dark:text-red-600 font-black border-8 border-red-500 dark:border-red-600 rounded-3xl px-4 py-1
        sm:text-3xl'>
					Nintendle
				</h1>
				<Tooltip text='Available at game end' disabled={!isGameOver}>
					<button
						disabled={!isGameOver}
						onClick={openStatsModal}
						className={`transition-all duration-300 ease-in-out
              ${isGameOver ? 'hover:opacity-50' : 'opacity-25'}`}>
						<FeatherIcon
							icon='bar-chart-2'
							color={useDarkMode ? '#ffffff' : '#000000'}
						/>
					</button>
				</Tooltip>
			</header>

			<main className='w-80 sm:w-96 mx-auto flex flex-col'>
				<div id='gameBoard' className='grid grid-rows-6 gap-4 mb-4'>
					{rows.map(({ guess, result }, index) => (
						<WordRow key={index} letters={guess} result={result} />
					))}
				</div>
			</main>

			<Keyboard
				onClick={(letter) => {
					addGuessLetter(letter)
				}}
				disabled={isGameOver}
			/>

			{showInvalidGuess && (
				<div
					role='modal'
					className='absolute bg-gray-800 rounded border text-center text-white 
          w-1/3 top-20 left-1/3 p-2 mx-auto'>
					<p>Not in word list</p>
				</div>
			)}

			<Modal title='About' show={showAbout} onClose={closeAboutModal}>
				<About />
			</Modal>

			{showGameOver && (
				<Modal
					title={isWon ? 'You win!' : 'Game Over!'}
					show={showStats}
					onClose={closeStatsModal}>
					<Stats rows={state.rows} isWon={isWon} answer={state.answer} />
				</Modal>
			)}
		</div>
	)
}

function useGuess(): [
	string,
	React.Dispatch<React.SetStateAction<string>>,
	(letter: string) => void
] {
	const gameState = useStore((s) => s.gameState)
	const [guess, setGuess] = useState('')

	const addGuessLetter = (letter: string) => {
		setGuess((curGuess) => {
			const newGuess = letter.length === 1 ? curGuess + letter : curGuess

			switch (letter) {
				case 'Backspace':
					return newGuess.slice(0, -1)
				case 'Enter':
					//submit guess
					if (newGuess.length === WORD_LENGTH) {
						return ''
					}
			}
			if (curGuess.length === WORD_LENGTH) {
				return curGuess
			}
			return newGuess.toLowerCase()
		})
	}

	//handle guessing from keyboard
	const onKeyDown = (e: KeyboardEvent) => {
		if (gameState !== 'playing') return

		let letter = e.key
		addGuessLetter(letter)
	}

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [])

	return [guess, setGuess, addGuessLetter]
}

//source https://usehooks.com/usePrevious/
function usePrevious<T>(value: T): T {
	const ref: any = useRef<T>()
	// Store current value in ref
	useEffect(() => {
		ref.current = value
	}, [value]) // Only re-run if value changes
	// Return previous value (happens before update in useEffect above)
	return ref.current
}
