import { useEffect } from 'react'
import CrossIcon from '../assets/cross.svg'

interface ModalProps {
  title?: string, 
  show: boolean, 
  onClose: () => void, 
  children: JSX.Element
}

export default function Modal({title, show, onClose, children} : ModalProps) {
  const closeOnEscapeKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
  }

  useEffect( ()=> {
    document.addEventListener('keydown', closeOnEscapeKeyDown)
    return () => {
      document.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  }, [])

  return ( 
    <div role='modal' 
      className={`modal 
      h-screen w-full absolute flex items-center justify-center bg-modal 
      transition-all duration-300 ease-in-out
      ${ show ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-64'}`}>
        <div className='bg-white border-retro text-center 
      w-full p-6 m-3/4 mx-auto
      sm:w-3/4 lg:w-1/2'>
          <div className='modal-header relative'>
            <button className='absolute right-0' onClick={ onClose }>
              <img className='w-4' src={ CrossIcon } />
            </button>
            <h2 className='mb-2 text-2xl font-retro tracking-widest'>{ title }</h2>
          </div>
          <div className='modal-content'>
            { children }
          </div>
        </div>
    </div>
  )
}