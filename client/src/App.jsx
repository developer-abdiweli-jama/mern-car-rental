import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'

const App = () => {
  // intentionally ignore the state value; only the setter is passed down
  const [, setShowLogin] = useState(false)
  const isOwnerPath= useLocation().pathname.startsWith('/owner')
  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}
    </>
  )
}
export default App
