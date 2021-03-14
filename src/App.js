import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css'
import BurgerMenu from './components/BurgerMenu'
import Login from './components/Login'

const App = () => {
    const [user, setUser] = useState('')

    return (
        <Router>
            {user ? (
                <BurgerMenu user={user} setUser={setUser} />
            ) : (
                <Login setUser={setUser} />
            )}
        </Router>
    )
}

export default App
