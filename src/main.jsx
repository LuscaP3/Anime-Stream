import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { HashRouter, Route, Routes } from 'react-router-dom'


import Home from './pages/home/Home.jsx'
import Anime from './pages/anime/Anime.jsx'
import NavBar from './components/navBar/NavBar.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>   
    
    <HashRouter>
        <NavBar />

      <div className='app'>
        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<Anime />} />
              {/* <Route path="/search/:queue" element={<Anime />} /> */}
              
              <Route path="*" element={<p>rota não encontrada</p>} />
          </Routes>
      </div>
    </HashRouter>

  </StrictMode>,
)
