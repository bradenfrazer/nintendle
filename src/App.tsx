import React, { useEffect, useRef, useState } from 'react'
import { useStore, GUESS_LENGTH } from './store'
import { LETTER_LENGTH } from './word-utils'
import WordRow from './WordRow'

export default function App() {
  const state = useStore()
  const [guess, setGuess] = useGuess()

  let rows = [...state.rows]
  
  if (rows.length < GUESS_LENGTH) {
    rows.push({ guess })
  }
  
  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length
  
  rows = rows.concat(Array(numberOfGuessesRemaining).fill(''))
  
  const isGameOver = state.gameState !== 'playing'

  return (
    <div className='relative mx-auto w-96'>
      <header className='border-b border-grey-500 pb-2 my-2'>
        <h1 className='text-4xl text-center'>Nintendle</h1>

      </header>

      <main className='grid grid-rows-6 gap-4'>
        {rows.map(({guess, result}, index) => (
          <WordRow key={index} letters={guess} result={result} />
        ))}
      </main>

      { isGameOver && (
        <div 
          role='modal' 
          className='absolute bg-white rounded border border-grey-500 text-center 
          left-4 right-4 top-1/4 p-6 m-3/4 mx-auto'>
            Game Over!

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

function useGuess(): [string, React.Dispatch<React.SetStateAction<string>>] {
  const addGuess = useStore(s => s.addGuess)
  const [guess, setGuess] = useState('')
  const previousGuess = usePrevious(guess)

  const onKeyDown = (e: KeyboardEvent) => {
    let letter = e.key
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

  useEffect( ()=> {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])
  
  useEffect( () => {
    if (guess.length === 0 && previousGuess?.length === LETTER_LENGTH) {
      addGuess(previousGuess)
    }
  }, [guess])

  return [guess, setGuess]
}

//source https://usehooks.com/usePrevious/
function usePrevious<T>(value: T): T {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref: any = useRef<T>()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}