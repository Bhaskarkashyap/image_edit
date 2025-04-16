'use client'
import React from 'react'

const Navbar : React.FC  = () => {
  return (
    <div className='flex justify-between '>
        <div>
            Image Editor
        </div>

        <button className='bg-purple-700 hover:bg-purple-500 cursor-pointer  p-2 text-base rounded-md'>Get started</button>
    </div>
  )
}

export default Navbar