import { useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'

interface ModalProps {
  title?: string, 
  show: boolean, 
  onClose: () => void, 
  children: JSX.Element
}

export default function Modal({title, show, onClose, children} : ModalProps) {
  //let user exit modal with escape key
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
      id='modal' 
      className={`modal 
      h-screen w-full absolute flex items-center justify-center bg-modal 
      transition-all duration-300 ease-in-out
      ${ show ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-64'}`}>
        <div className='bg-white border-retro text-center
      w-full max-h-full p-6 m-3/4 mx-auto overflow-y-auto
      sm:w-3/4 lg:w-1/2'>
          <div className='modal-header relative'>
            <button 
            className='absolute right-0 transition-all duration-300 ease-in-out
            hover:opacity-50' 
            onClick={ onClose }>
              <FeatherIcon icon='x' />
            </button>
            <h2 className='mb-2 text-2xl font-retro uppercase tracking-widest'>{ title }</h2>
          </div>
          <div className='modal-content'>
            { children }
          </div>
        </div>
    </div>
  )
}