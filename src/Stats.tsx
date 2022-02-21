import { useEffect, useState } from 'react';
import ShareIcon from '../assets/share.svg'
import { GuessRow } from './store';

export default function Stats({rows, isWon, answer}: {rows: GuessRow[], isWon: boolean, answer: string}) {

  const getTimeUntilNextGame = () => {
    let date = new Date();
    let tomorrow = new Date();
    tomorrow.setHours(24,0,0,0);
    let diffMS = tomorrow.getTime()/1000 - date.getTime()/1000
    const diffHr = Math.floor(diffMS/3600)
    diffMS = diffMS - diffHr * 3600
    const diffMi = Math.floor(diffMS/60)
    diffMS = diffMS - diffMi * 60
    const diffS = Math.floor(diffMS)
    let timeLeft = ((diffHr<10) ? '0' + diffHr:diffHr)
    timeLeft += ':' + ((diffMi<10) ? '0' +diffMi:diffMi)
    timeLeft += ':' + ((diffS<10) ? '0' + diffS:diffS)
    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextGame())
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeUntilNextGame())
    }, 1000)
  
    return () => clearTimeout(timer)
  })


  const share = (rows: GuessRow[], isWon: boolean) => {

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

  return ( 
    <div>
      <div className='my-16'>
        { !isWon ? <p className='mb-2 font-retro'>Today's answer is</p> : '' }
        <p className='mb-2 text-3xl font-retro text-green-600 tracking-widest'>{ (answer).toUpperCase() }</p>
        { isWon ? <p className='mb-2 font-retro'>guessed in { (rows.length) } tries</p> : '' }
      </div>

      <div className='block md:flex justify-between p-2'>  
        <div>
          <p className='mb-2 font-retro'>next Nintendle in:</p>
          <p className='mb-2 font-retro text-2xl'>{ timeLeft }</p>
        </div>
        <div className='flex-1 p-2'>        
          <button 
            className='flex border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto text-white shadow'
            onClick={() => { 
              share(rows, isWon) 
            }}
          >
          <img className='w-4' src={ShareIcon} /> Share
          </button>
        </div>
      </div>
    </div>
  )
}