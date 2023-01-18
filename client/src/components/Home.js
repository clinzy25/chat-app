import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Button } from '@material-ui/core'
import { SidebarContainer } from './Sidebar'
import { ActiveChat } from './ActiveChat'
import { logout, fetchConversations } from '../store/utils/thunkCreators'
import { clearOnLogout } from '../store/index'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  root: {
    height: '97vh',
  },
}))

const Home = () => {
  const classes = useStyles()
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout(user.id))
    dispatch(clearOnLogout())
  }

  useEffect(() => {
    dispatch(fetchConversations({ user }))
  }, []) // eslint-disable-line

  return (
    <>
      <Redirect to="/" />
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
