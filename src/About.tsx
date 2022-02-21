import CrossIcon from '../assets/cross.svg'

export default function About(props: any) {
  if (!props.show) return null

  return ( 
    <div role='modal' 
      className='h-screen w-full absolute flex items-center justify-center bg-modal'>
        <div className='bg-white border-retro text-center 
      w-full p-6 m-3/4 mx-auto
      sm:w-3/4 lg:w-1/2'>
          <div className='relative mb-8'>
            <button className='absolute right-0' onClick={ props.onClose }>
              <img className='w-4' src={CrossIcon} />
            </button>
            <h2 className='mb-2 text-2xl font-retro tracking-widest'>About</h2>
            <p className='mb-2 font-retro'>About text here</p>
          </div>
        </div>
    </div>
  )
}