import React from 'react';
import './App.css';
import CareerlinkNavbar from './components/navbar';
import Hero from './components/hero';
import Sidebar from './components/sidebar';
import CareerlinkCarousel from './components/carousel';
import CareerlinkFormTable from './components/formtableinteraction';
import About from './components/about';
import Following from './components/following';
import Contact from './components/contact';

function App() {
  const [authToken, setAuthToken] = React.useState(localStorage.getItem("token"));
  const [followUpdateTrigger, setFollowUpdateTrigger] = React.useState(0);

  const handleAuthChange = () => {
    setAuthToken(localStorage.getItem("token"));
  };

  const handleFollowToggle = () => {
    setFollowUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <CareerlinkNavbar />
      <Hero />
      
      
      <div className="container-fluid py-5" style={{ position: "relative", minHeight: "100vh", zIndex: 10 }}>
        <div className="row px-2 px-md-4">
          
          <div className="col-12 col-md-3 mb-5 mb-md-0">
            <Sidebar onAuthChange={handleAuthChange} />
          </div>
          
          
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
              <CareerlinkFormTable authToken={authToken} onFollowToggle={handleFollowToggle} />
            </div>
            <hr className="text-light opacity-25 my-5" />
            <div id="following" className="pt-2">
              <Following authToken={authToken} updateTrigger={followUpdateTrigger} />
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

