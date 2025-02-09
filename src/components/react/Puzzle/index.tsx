import React from 'react'

import PuzzleBoard from './PuzzleBoard'

export default function index() {
  return (
    <>
      <div
        className='w-dvw h-dvh'
        // style={{
        //   backgroundImage: `url("${bgImg.src}")`,
        //   backgroundSize: 'cover',
        // }}
      >
        <div className='mx-auto p-2 w-full lg:max-w-5xl '>
          <PuzzleBoard />
        </div>
      </div>
    </>
  )
}
