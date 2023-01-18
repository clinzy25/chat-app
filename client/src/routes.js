import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './store/utils/thunkCreators'
import Auth from './Auth.js'
import { Home, SnackbarError } from './components'
import { makeStyles } from '@material-ui/core'
import Loader from './components/Loader'

const useStyles = makeStyles(() => ({
  loading: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const Routes = () => {
  const classes = useStyles()
  const { user, isFetching } = useSelector((state) => state.user)
  const [errorMessage, setErrorMessage] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const dispatch = useDispatch()

  const handleUserError = () => {
    if (user.error) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof user.error === 'string') {
        setErrorMessage(user.error)
      } else {
        setErrorMessage('Internal Server Error. Please try again')
      }
      setSnackBarOpen(true)
    }
  }

  useEffect(() => {
    dispatch(fetchUser())
  }, []) // eslint-disable-line

  useEffect(() => {
    user?.error && handleUserError()
  }, [user]) // eslint-disable-line

  if (isFetching) {
    return (
      <div className={classes.loading}>
        <Loader />
      </div>
    )
  }
  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route exact path="/" component={user?.id ? Home : Auth} />
        <Route path="/auth" component={user?.id ? Home : Auth} />
      </Switch>
    </>
  )
}

export default Routes
