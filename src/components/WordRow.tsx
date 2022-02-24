import { WORD_LENGTH } from "../store"
import { LetterState } from "../utils/word-utils"

interface WordRowProps {
  letters: string,
  result?: LetterState[],
  className?: string
}

export default function WordRow({letters: lettersProp = '', result = [], className = ''}: WordRowProps) {
  const lettersRemaining = WORD_LENGTH - lettersProp.length
  const letters = lettersProp.split('').concat(Array(lettersRemaining).fill(''))
  
  return (
    <div className={`wordRow grid grid-cols-5 gap-4 ${className}`}>
      { letters.map((char, index) => (
          <CharacterBox key={index} value={char} state={result[index]} position={index} />
      ) ) }
    </div> 
  )
}

interface CharacterBoxProps {
    value: string
    state?: LetterState
    position: number
}

function CharacterBox({ value, state, position }: CharacterBoxProps) {
  const stateStyles = state == null ? 'text-gray-800' : characterStateStyles[state] + ' text-white'
  const animationStyles: React.CSSProperties = {
    transitionDelay: `${position * 300}ms`,
    transform: `${state == null ? "" : "rotateX(360deg)"}`
  }
  return (
    <span className={`characterBox inline-flex justify-center items-center w-12 h-12
    border-retro-rounded  
    before:inline-block before:content-['_'] 
    uppercase font-bold font-retro text-xl text-center leading-none
    sm:text-2xl sm:w-16 sm:h-16
    transition transition-all duration-700 ease-in-out
    ${stateStyles}`} style={animationStyles} >{value} 
    </span>
  )
}

const characterStateStyles = {
  [LetterState.Miss]: 'bg-gray-500 border-gray-500',
  [LetterState.Present]: 'bg-yellow-500 border-yellow-500',
  [LetterState.Match]: 'bg-green-500 border-green-500'
}