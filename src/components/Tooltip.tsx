interface TooltipProps {
	text: string
	disabled: boolean
	children: JSX.Element
}

export default function Tooltip({ text, disabled, children }: TooltipProps) {
	return (
		<div className='tooltip'>
			{children}
			{disabled ? <span className='tooltiptext'>{text}</span> : ''}
		</div>
	)
}
