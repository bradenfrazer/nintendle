import CrossIcon from '../assets/cross.svg'

export default function Modal({show, onClose, children} : {show: boolean, onClose: () => void, children: JSX.Element}) {
  if (!show) return null

  return ( 
    <div role='modal' 
      className='h-screen w-full absolute flex items-center justify-center bg-modal'>
        <div className='bg-white border-retro text-center 
      w-full p-6 m-3/4 mx-auto
      sm:w-3/4 lg:w-1/2'>
          <div className='relative'>
            <button className='absolute right-0' onClick={ onClose }>
              <img className='w-4' src={ CrossIcon } />
            </button>
          </div>
          <div>
            { children }
          </div>
        </div>
    </div>
  )
}