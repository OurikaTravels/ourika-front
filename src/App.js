import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import './App.css';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          <Hero />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;