import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { HashRouter, Route, Routes } from 'react-router-dom'


import Home from './pages/home/Home.jsx'
import Anime from './pages/anime/Anime.jsx'
import NavBar from './components/navBar/NavBar.jsx'
import Calendar from './pages/calendar/Calendar.jsx'
import Filter from './pages/filter/Filter.jsx'

import RouteChangeListener from './components/RouteChangeListener.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>   
    
    <HashRouter>
      <div className = 'app'>
        <NavBar />

        <RouteChangeListener />

        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<Anime />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/filter" element={<Filter />} />
              
              <Route path="*" element={<p>rota não encontrada</p>} />
          </Routes>
        </div>

    </HashRouter>

  </StrictMode>,
)
