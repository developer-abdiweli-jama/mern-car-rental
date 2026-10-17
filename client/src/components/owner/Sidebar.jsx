import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ownerMenuLinks } from '../../assets/assets'

const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className='hidden md:flex md:flex-col w-64 border-r border-borderColor bg-white h-[calc(100vh-72px)] flex-shrink-0'>
      <div className='p-6 border-b border-borderColor'>
        <h2 className='font-bold text-gray-800 text-lg'>Fleet</h2>
      </div>
      <nav className='flex-1 py-4 space-y-1'>
        {ownerMenuLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-6 py-3 text-sm rounded-l-full transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <img src={isActive ? link.coloredIcon : link.icon} alt={link.name} className='w-5 h-5' />
              <span className='font-medium'>{link.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
