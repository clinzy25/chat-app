import React from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import { CssBaseline } from '@material-ui/core'
import { theme } from './themes/theme'
import Routes from './routes'

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes />
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>
)

export default App
