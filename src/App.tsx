import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Talents from './pages/Talents'
import InfinityPage from './pages/Infinity'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">BMS Companion</div>
        <nav className="nav">
          <NavLink to="/" end>Accueil</NavLink>
          <NavLink to="/talents">BMS Talents</NavLink>
          <NavLink to="/has-joel-infinity">Has Joel Streamed Today? - Infinity</NavLink>
          <a href="https://thebmscrew.com/" target="_blank" rel="noreferrer">BMS Shop</a>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/talents" element={<Talents />} />
          <Route path="/has-joel" element={<Navigate to="/has-joel-infinity" replace />} />
          <Route path="/has-joel-infinity" element={<InfinityPage />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} BMS</footer>
    </div>
  )
}
