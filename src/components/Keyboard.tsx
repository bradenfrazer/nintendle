import React from 'react'
import { useStore } from '../store'
import { LetterState } from '../utils/word-utils'

interface KeyboardProps {
	onClick: (letter: string) => void
	disabled: boolean
}

export default function Keyboard({
	onClick: onClickProps,
	disabled,
}: KeyboardProps) {
	const keyboardLetterState = useStore((s) => s.keyboardLetterState)

	const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { textContent, innerHTML } = e.currentTarget

		let returnProps = textContent!
		if (textContent !== innerHTML) {
			returnProps = 'Backspace'
		}

		onClickProps(returnProps)
	}
	return (
		<div id='keyboard' className='w-80 sm:w-96 lg:w-2/4 mx-auto'>
			{keyboardKeys.map((keyboardRow, rowIndex) => {
				return (
					<div key={rowIndex} className='flex justify-center my-2 space-x-1'>
						{keyboardRow.map((key, index) => {
							let styles =
								'flex justify-center rounded font-bold text-white uppercase px-1 py-2 flex-1 lg:px-2 lg:py-3'
							const letterState = keyStateStyles[keyboardLetterState[key]]

							//disable extra spacer keys
							if (key === '') {
								styles += ' pointer-events-none'
							}

							if (letterState) {
								styles += ` ${letterState}`
							} else if (key !== '') {
								styles += ` bg-gray-400 dark:bg-gray-500`
							}

							return (
								<button
									key={index}
									className={styles}
									onClick={onClick}
									disabled={disabled}>
									{key === 'Backspace' ? backspace : key}
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
	[LetterState.Miss]: 'bg-gray-500 dark:bg-gray-700',
	[LetterState.Present]: 'bg-yellow-500 dark:bg-yellow-700',
	[LetterState.Match]: 'bg-green-500 dark:bg-green-700',
}

const backspace = (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z'></path>
	</svg>
)
