import React from "react"
import { useStore } from "./store"
import { LetterState } from "./word-utils"

export default function Keyboard({ onClick: onClickProps }: { onClick: (letter: string) => void }) {
  const keyboardLetterState = useStore((s) => s.keyboardLetterState)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { textContent, innerHTML } = e.currentTarget;

    let returnProps = textContent!
    if (textContent !== innerHTML) {
      returnProps = 'Backspace'
    }

    onClickProps(returnProps)
  }
  return (
    <div className='w-72 sm:w-96 mx-auto'>
      { keyboardKeys.map( (keyboardRow, rowIndex) => {
        return (
          <div key={rowIndex} className='flex justify-center my-2 space-x-1'>
            {keyboardRow.map((key, index) => {
              let styles = 'flex justify-center rounded font-bold text-white uppercase px-1 py-1 flex-1'
              const letterState = keyStateStyles[keyboardLetterState[key]]

              if (key === '') {
                styles += ' pointer-events-none'
              }

              if (letterState) {
                styles += ` ${letterState}`
              } else if (key !== '') {
                styles += ` bg-gray-400`
              }

              return(
                <button 
                  key={index} 
                  className={styles}
                  onClick={onClick}
                >{key === 'Backspace' ? backspace : key}
                </button>
              ) 
            })}
          </div> 
        )
      })}
    </div>
  )
}

const keyboardKeys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ''],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
]

const keyStateStyles = {
  [LetterState.Miss]: 'bg-gray-500',
  [LetterState.Present]: 'bg-yellow-500',
  [LetterState.Match]: 'bg-green-500',
}

const backspace = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
    ></path>
  </svg>
);