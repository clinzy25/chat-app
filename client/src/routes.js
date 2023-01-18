import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './store/utils/thunkCreators'
import Auth from './Auth.js'
import { Home, SnackbarError } from './components'

const Routes = () => {
  const { user } = useSelector((state) => state)
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
  }, [fetchUser])

  useEffect(() => {
    handleUserError()
  }, [user.error])

  if (user.isFetchingUser) {
    return <div>Loading...</div>
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
        <Route path="/auth" component={Auth} />
        <Route exact path="/" component={user?.id ? Home : Auth} />
        <Route path="/home" component={Home} />
      </Switch>
    </>
  )
}

export default Routes
