import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Inventory from './pages/Inventory.jsx'
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
  );
}

export default App