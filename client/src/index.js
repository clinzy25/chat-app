import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootHtml = document.getElementById('root')
const root = createRoot(rootHtml)
root.render(<App />)
