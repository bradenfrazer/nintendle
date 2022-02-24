import { useEffect, useState } from 'react';
import FeatherIcon from 'feather-icons-react'
import { GuessRow } from '../store';

interface StatsProps {
  rows: GuessRow[], 
  isWon: boolean, 
  answer: string
}

export default function Stats({rows, isWon, answer}: StatsProps) {

  //next game timer
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
  
  //share button logic
  const [showShareButton, setShareButton] = useState(true)
  useEffect(() => {
    let id: any
    if (!showShareButton) {
      id = setTimeout(() => setShareButton(true), 3000)
    }
    return () => clearTimeout(id)

  }, [showShareButton])

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
    
    //build first line
    const gameInfo = `Nintendle ${dayOfYear} ${endRow}/6`

    //build emoji board
    let emojiBoard = ''
    rows.forEach(row => {
      if (!row.result) return

      let emojiRow = `\n`
      row.result.forEach(letterState => {
        if (letterState === 'Miss') emojiRow += '⬛️'
        else if (letterState === 'Present') emojiRow += '🟨'
        else if (letterState === 'Match') emojiRow += '🟩'
        else return
      })
      emojiBoard += emojiRow
    })
  
    //copy it all to user's clipboard
    copyTextToClipboard(gameInfo + emojiBoard)
  }

  return ( 
    <div>
      <div className='my-16'>
        { !isWon ? <p className='mb-2 font-retro'>Today's answer is</p> : '' }
        <p className='mb-2 text-3xl font-retro text-green-600 tracking-widest'>{ answer.toUpperCase() }</p>
        { isWon ? <p className='mb-2 font-retro'>guessed in { rows.length } tries</p> : '' }
      </div>

      <div className='block md:flex justify-between p-2'>  
        <div>
          <p className='mb-2 font-retro'>next Nintendle in:</p>
          <p className='mb-2 font-retro text-2xl'>{ timeLeft }</p>
        </div>
        <div className='flex-1 p-2'>        
          <button 
            disabled={ !showShareButton }
            className={`flex border rounded p-2 mt-4 mx-auto text-white shadow
            transition-all duration-300 ease-in-out
            ${ showShareButton ? 'border-green-500 bg-green-500 hover:border-green-400 hover:bg-green-400' : 'border-gray-400 bg-gray-400' }`}
            onClick={() => { 
              share(rows, isWon)
              setShareButton(false)
            }}> 
            { showShareButton ? 
              <div className='flex align-center'>
                <div style={{marginTop: '2px'}} className='mr-1'><FeatherIcon icon='share-2' size='20' /></div>
                <span>Share</span>
              </div>
              :
              <span>Copied</span>
           }
          </button>
        </div>
      </div>
    </div>
  )
}