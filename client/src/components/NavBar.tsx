import { ShoppingBag, ShoppingCart } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button';

const NavBar = () => {
  const user = true;
  return (
    <header className='w-full bg-pink-50 fixed z-20 border-b border-pink-200 '>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
        {/* logo */}
        <div className=''>
          <Link to={'/'} className='flex gap-3 items-center'>
          <img className='w-[30px]' src="./logooo.png" alt="imageLogo" />
          <p className=''>Hamada</p>
          </Link>
        </div>
        {/* nav */}
        <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-medium'>
            <Link to={'/'}>
              <li>
                Home
              </li>
            </Link>
            <Link to={'/products'}>
              <li>
                products
              </li>
            </Link>
            {
              user && <Link to={'/prfile'}><li>Hello User</li></Link>
            }
          </ul>
            <Link to={'/cart'} className='relative '>
            <ShoppingCart/>
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 ">0</span>
            </Link>
            {
              user ? <Button className='bg-gradient-to-tl from-blue-600 to-purple-600'>Logout</Button> : <Button className='bg-pink-600 hover:bg-pink-400'>Login</Button>  
            }
        </nav>
      </div>
    </header>
  )
}

export default NavBar