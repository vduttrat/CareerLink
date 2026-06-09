import React from 'react';
import './App.css';
import CareerlinkNavbar from './components/navbar';
import Hero from './components/hero';
import Sidebar from './components/sidebar';
import CareerlinkCarousel from './components/carousel';
import CareerlinkFormTable from './components/formtableinteraction';
import About from './components/about';
import Contact from './components/contact';

function App() {
  return (
    <div className="App">
      <CareerlinkNavbar />
      <Hero />
      
      {/* Main layout containing sidebar and main sections */}
      <div className="container-fluid py-5" style={{ position: "relative", minHeight: "100vh", zIndex: 10 }}>
        <div className="row px-2 px-md-4">
          {/* Sidebar - top/full on mobile, sticky on desktop */}
          <div className="col-12 col-md-3 mb-5 mb-md-0">
            <Sidebar />
          </div>
          
          {/* Main scrollable section contents */}
          <div className="col-12 col-md-9">
            <div id="home" className="pt-2">
              <CareerlinkCarousel />
            </div>
            <hr className="text-light opacity-25 my-5" />
            <div id="about" className="pt-2">
              <About />
            </div>
            <hr className="text-light opacity-25 my-5" />
            <div id="profiles" className="pt-2">
              <CareerlinkFormTable />
            </div>
            <hr className="text-light opacity-25 my-5" />
            <div id="contact" className="pt-2">
              <Contact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

