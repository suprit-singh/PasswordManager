import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white flex flex-col md:flex-row md:justify-around p-4 items-center w-full '>
      <div className='font-bold text-2xl'>
        <span className='text-green-800'>&lt;</span>
        <span>Pass</span>
        <span className='text-green-800'>OP</span>
        <span className='text-green-700'>/&gt;</span>
      </div>
      <ul className='flex gap-4 text-lg hover:font-bold cursor-pointer'>
        <li>Home</li>
        <li>Contact</li>
        <li>About</li>
        </ul>
    </nav>
  )
}

export default Navbar
