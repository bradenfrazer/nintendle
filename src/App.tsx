import "@fontsource/press-start-2p"
import FeatherIcon from 'feather-icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { useStore, getDate, GUESS_LENGTH, GuessRow } from './store'
import { isValidWord, LETTER_LENGTH } from './word-utils'
import Keyboard from './Keyboard'
import WordRow from './WordRow'
import About from "./About"
import Modal from "./Modal"
import Stats from "./Stats"

export default function App() {
  const state = useStore()
  const [guess, setGuess, addGuessLetter] = useGuess()
  const [showInvalidGuess, setInvalidGuess] = useState(false)
  const [showStats, setStats] = useState(true)
  const openStatsModal = () => setStats(true)
  const closeStatsModal = () => setStats(false)
  const [showAbout, setAbout] = useState(false)
  const openAboutModal = () => setAbout(true)
  const closeAboutModal = () => setAbout(false)
  const addGuess = useStore(s => s.addGuess)
  const previousGuess = usePrevious(guess)

  const isGameOver = state.gameState !== 'playing'
  const isWon = state.gameState === 'won'
  const isAboutOpen = showAbout

  useEffect(() => {
    let id: any
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500)
    }
    return () => clearTimeout(id)

  }, [showInvalidGuess])
  useEffect(() => {
    if (isGameOver || isAboutOpen) return 
    if (guess.length === 0 && previousGuess?.length === LETTER_LENGTH) {
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

  let currentRow = 0

  if (rows.length < GUESS_LENGTH) {
    currentRow = rows.push({ guess }) - 1
  }
  
  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length
  
  rows = rows.concat(Array(numberOfGuessesRemaining).fill(''))

  const date = getDate()
  
  if (state.last_played_date !== date) {
    useStore.persist.clearStorage()
    state.newGame()
    setGuess('')
  }

  return (
    <div className='h-screen relative flex flex-col justify-between'>
      <header className='flex justify-between border-b border-grey-500 px-4 py-2 mb-4'>
        <button 
          onClick={ openAboutModal }
          className="transition-all duration-300 ease-in-out
            hover:opacity-50">
              <FeatherIcon icon='info' />
        </button>
        <h1 className='inline-block text-2xl text-red-500 font-black border-8 border-red-500 rounded-3xl px-4 py-1
        sm:text-3xl'>Nintendle</h1>
        <button 
        disabled={ !isGameOver } 
        onClick={ openStatsModal }
        className={`transition-all duration-300 ease-in-out
            ${ isGameOver ? "hover:opacity-50" : "opacity-25"}`}>
          <FeatherIcon icon='bar-chart-2' />
        </button>
      </header>

      <main className='w-72 sm:w-96 mx-auto flex flex-col'>
        <div className='grid grid-rows-6 gap-4 mb-4'>
          {rows.map(({guess, result}, index) => (
            <WordRow 
            key={index} 
            letters={guess} 
            result={result}
            />
          ))}
        </div>

      </main>

      <Keyboard 
        onClick={(letter) => {
          addGuessLetter(letter)
        }}
        disabled={isGameOver}
      />

      { showInvalidGuess && (
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

      { isGameOver && (
        <Modal title={ isWon ? 'YOU WIN!' : 'Game Over!' } show={showStats} onClose={closeStatsModal}>
          <Stats rows={state.rows} isWon={isWon} answer={state.answer}/>
        </Modal>
      )}
    </div>
  )
}

function useGuess(): [string, React.Dispatch<React.SetStateAction<string>>, (letter: string) => void] {
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
          if (newGuess.length === LETTER_LENGTH) {
            return ''
          }
      }
      if (curGuess.length === LETTER_LENGTH) {
        return curGuess
      }
      return newGuess
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    console.log(gameState)
    //if (gameState !== 'playing') return 
    
    let letter = e.key
    addGuessLetter(letter)
  }

  useEffect( ()=> {
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
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}