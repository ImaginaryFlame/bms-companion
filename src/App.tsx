import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Talents from './pages/Talents'
import HasJoelStreamedToday from './pages/HasJoelStreamedToday'
import Notifications from './pages/Notifications'
import NotificationBell from './components/NotificationBell'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">BMS Companion</div>
        <nav className="nav">
          <NavLink to="/" end>Accueil</NavLink>
          <NavLink to="/tournaments">Tournois</NavLink>
          <NavLink to="/talents">BMS Talents</NavLink>
          <NavLink to="/has-joel">Has Joel Streamed Today</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
          <a href="https://shop.bms.example" target="_blank" rel="noreferrer">Boutique</a>
        </nav>
        <NotificationBell />
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/talents" element={<Talents />} />
          <Route path="/has-joel" element={<HasJoelStreamedToday />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} BMS</footer>
    </div>
  )
}
