import React, { useEffect, useRef, useState } from 'react'
import { useStore, GUESS_LENGTH } from './store'
import { isValidWord, LETTER_LENGTH } from './word-utils'
import Keyboard from './Keyboard'
import WordRow from './WordRow'

export default function App() {
  const state = useStore()
  const [guess, setGuess, addGuessLetter] = useGuess()
  const [showInvalidGuess, setInvalidGuess] = useState(false)
  const addGuess = useStore(s => s.addGuess)
  const previousGuess = usePrevious(guess)

  useEffect(() => {
    let id: any
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500)
    }
    return () => clearTimeout(id)

  }, [showInvalidGuess])
  useEffect(() => {
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
  
  const isGameOver = state.gameState !== 'playing'
  const isWon = state.gameState === 'won'

  return (
    <div className='h-screen relative flex flex-col justify-between'>
      <header className='border-b border-grey-500 py-2 mb-4'>
        <h1 className='text-4xl text-center'>Nintendle</h1>

      </header>

      <main className='w-96 mx-auto flex flex-col '>
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
      />

      {showInvalidGuess && (
        <div 
          role='modal' 
          className='absolute bg-gray-800 rounded border border-grey-500 text-center text-white 
          inset-x-96 top-1/4 p-6 m-3/4 mx-auto'>
            <p className='mb-4'>Not in word list</p>
        </div>
      )}

      { isGameOver && (
        <div 
          role='modal' 
          className='absolute bg-white rounded border border-grey-500 text-center 
          inset-x-96 top-1/4 p-6 m-3/4 mx-auto'>
            <p className='mb-4'>{ isWon ? 'You won!' : 'Game Over!' }</p>

            <WordRow 
              letters={state.answer} 
              className='items-center justify-items-center'
            />
          <button 
            className='block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto text-white shadow'
            onClick={() => { state.newGame(); setGuess(''); }}
          >
          New Game
          </button>
        </div>
      )}
    </div>
  )
}

function useGuess(): [string, React.Dispatch<React.SetStateAction<string>>, (letter: string) => void] {
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