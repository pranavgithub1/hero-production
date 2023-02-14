import { useState } from 'react'
import './App.css'
import AlgoStatus from './components/AlgoStatus'
import LiveStream from './components/LiveStream'
import MaskedStream from './components/MaskedStream'
import VideoStream from './components/VideoStream'



function App() {

  return (
    <div className='w-full h-full'>
      <h1 className='text-5xl text-center font-bold mt-5 mb-10'>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-400'>HERO</span> Dashboard
      </h1>
      <div className='grid grid-cols-3 justify-items-center px-20'>
        <LiveStream />
        <AlgoStatus />
        <MaskedStream />
      </div>
    </div>
  )
}

export default App
