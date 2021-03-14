// This Login component will no longer be needed when the bot and dashboard is being integrated to the actual Project

import React, { useState } from 'react'
import { TextField, IconButton, Typography } from '@material-ui/core'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import { db } from '../../config'
import './Login.css'

function Login({ setUser }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const saveUserToStorage = (user) => {
        localStorage.setItem('userLoggedIn', user)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        db.collection('users')
            .doc(email)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if (password == doc.data().password) {
                        setUser(email)
                        saveUserToStorage(email)
                    } else {
                        alert('Incorrect username or password!!!')
                        setPassword('')
                        setUser('')
                    }
                } else {
                    db.collection('users')
                        .doc(email)
                        .set({ password })
                        .then(() => {
                            setUser(email)
                            saveUserToStorage(email)
                        })
                }
            })
            .catch((err) => alert(err.message))
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <Typography variant="h5" color="textSecondary" gutterBottom={true}>
                    Login | Sign Up
                </Typography>
                <TextField
                    required
                    type="email"
                    label="Email"
                    variant="outlined"
                    color="primary"
                    className="login__inputField"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    required
                    type="password"
                    label="Password"
                    variant="outlined"
                    color="primary"
                    className="login__inputField"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <IconButton type="submit" color="primary">
                    <PlayCircleFilledIcon />
                </IconButton>
            </form>
        </div>
    )
}

export default Login
