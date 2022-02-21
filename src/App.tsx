import "@fontsource/press-start-2p"
import CrossIcon from '../assets/cross.svg'
import InfoIcon from '../assets/info.svg'
import ShareIcon from '../assets/share.svg'
import StatsIcon from '../assets/stats.svg'
import React, { useEffect, useRef, useState } from 'react'
import { useStore, getDate, GUESS_LENGTH, GuessRow } from './store'
import { isValidWord, LETTER_LENGTH } from './word-utils'
import Keyboard from './Keyboard'
import WordRow from './WordRow'
import About from "./About"

export default function App() {
  const state = useStore()
  const [guess, setGuess, addGuessLetter] = useGuess()
  const [showInvalidGuess, setInvalidGuess] = useState(false)
  const [showStats, setStats] = useState(false)
  const openStatsModal = () => setStats(true)
  const closeStatsModal = () => setStats(false)
  const [showAbout, setAbout] = useState(false)
  const openAboutModal = () => setAbout(true)
  const closeAboutModal = () => setAbout(false)
  const addGuess = useStore(s => s.addGuess)
  const previousGuess = usePrevious(guess)

  useEffect(() => {
    let id: any
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 15000)
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

  const date = getDate()
  
  if (state.last_played_date !== date) {
    useStore.persist.clearStorage()
    state.newGame()
    setGuess('')
  }

  return (
    <div className='h-screen relative flex flex-col justify-between'>
      <header className='flex justify-between border-b border-grey-500 px-4 py-2 mb-4'>
        <button onClick={ openAboutModal }><img className='w-6' src={InfoIcon} /></button>
        <h1 className='inline-block text-2xl text-red-500 font-black border-8 border-red-500 rounded-3xl px-4 py-1
        sm:text-3xl'>Nintendle</h1>
        <button disabled={ !isGameOver } onClick={ openStatsModal }><img className='w-6' src={StatsIcon} /></button>
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
      />

      { showInvalidGuess && (
        <div 
          role='modal' 
          className='absolute bg-gray-800 rounded border text-center text-white 
          w-1/3 top-20 left-1/3 p-2 mx-auto'>
            <p>Not in word list</p>
        </div>
      )}

        <About show={showAbout} onClose={closeAboutModal} />
      )

      { showStats && (
        <div 
          role='modal' 
          className='h-screen w-full absolute flex items-center justify-center bg-modal'>
            <div className='bg-white border-retro text-center 
          w-full p-6 m-3/4 mx-auto
          sm:w-3/4 lg:w-1/2'>
              <div className='relative mb-8'>
              <button className='absolute right-0' onClick={ closeStatsModal }>
                <img className='w-4' src={CrossIcon} />
              </button>
                <p className='mb-2 font-retro'>{ isWon ? 'YOU WIN!' : 'Game Over!' }</p>
                <h2 className='mb-2 text-3xl font-retro tracking-widest'>{(state.answer).toUpperCase()}</h2>
                <p className='mb-2 font-retro'>guessed in { (GUESS_LENGTH - numberOfGuessesRemaining - 1) } tries</p>
              </div>

              <div className='block md:flex justify-between p-2'>  
                <div>
                  <p className='mb-2 font-retro'>next Nintendle in:</p>
                  <p className='mb-2 font-retro text-2xl'>00:00:00</p>
                </div>
                <div className='flex-1 p-2'>        
                  <button 
                    className='flex border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto text-white shadow'
                    onClick={() => { 
                      share(state.rows, isWon) 
                    }}
                  >
                  <img className='w-4' src={ShareIcon} /> Share
                  </button>
                </div>
              </div>
            </div>
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

function share(rows: GuessRow[], isWon: boolean) {

  //source https://blog.logrocket.com/implementing-copy-to-clipboard-in-react-with-clipboard-api/
  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const date = new Date()
  const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
  
  let endRow: string = ''
  if (isWon) {
    endRow = rows.length.toString()
  } else {
    endRow = 'X'
  }
  
  const gameInfo = `Nintendle ${dayOfYear} ${endRow}/6`

  copyTextToClipboard(gameInfo)
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