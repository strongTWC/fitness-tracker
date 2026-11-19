import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import './base.css'
import './styles.css'
import './profile-activity.css'
import './combo-copy.css'
import './guide-carousel.css'
import './guide-polish.css'
import './guide-carousel.js'
import './guide-detail.css'
import './guide-detail.js'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
