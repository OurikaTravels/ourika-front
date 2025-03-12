import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import './App.css';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Categories from './components/layout/categories';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          <Hero />
          <Categories />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;