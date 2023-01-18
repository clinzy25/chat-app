import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Button } from '@material-ui/core'
import { SidebarContainer } from './Sidebar'
import { ActiveChat } from './ActiveChat'
import { logout, fetchConversations } from '../store/utils/thunkCreators'
import { clearOnLogout } from '../store/index'

const useStyles = makeStyles(() => ({
  root: {
    height: '97vh',
  },
}))

const Home = () => {
  const classes = useStyles()
  const [user] = useSelector((state) => [state.user, state.conversations])
  const dispatch = useDispatch()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    dispatch(logout(user.id))
    dispatch(clearOnLogout())
  }

  useEffect(() => {
    setIsLoggedIn(true)
  }, [user.id])

  useEffect(() => {
    isLoggedIn && dispatch(fetchConversations({ user }))
  }, [isLoggedIn]) // eslint-disable-line

  if (!user.id) {
    return <Redirect to="/auth" />
  }
  return (
    <>
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  )
}

export default Home
