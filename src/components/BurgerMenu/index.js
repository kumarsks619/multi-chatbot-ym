import React from 'react'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Switch, Route, Link } from 'react-router-dom'
import AdbIcon from '@material-ui/icons/Adb'
import SettingsIcon from '@material-ui/icons/Settings'
import Button from '@material-ui/core/Button'
import LockIcon from '@material-ui/icons/Lock'

import useStyles from './styles'
import './BurgerMenu.css'
import ChatBot from '../ChatBot'
import ChatbotDashboard from '../ChatbotDashboard'

export default function BurgerMenu({ user, setUser }) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleLogout = () => {
        setUser('')
        localStorage.removeItem('userLoggedIn')
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Multi-Chatbot
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<LockIcon />}
                        onClick={handleLogout}
                        style={{ marginLeft: 'auto', backgroundColor: '#fff' }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link to="/" className="burgerMenu__link">
                        <ListItem button key="chatbot">
                            <ListItemIcon>
                                <AdbIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chatbot" />
                        </ListItem>
                    </Link>
                    <Link to="/dashboard" className="burgerMenu__link">
                        <ListItem button key="dashboard">
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route exact path="/">
                        <ChatBot />
                    </Route>
                    <Route exact path="/dashboard">
                        <ChatbotDashboard user={user} />
                    </Route>
                </Switch>
            </main>
        </div>
    )
}
