import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      position: 'relative',
      marginTop: '4rem',
      padding: '2.5rem 2rem 1.5rem',
      background: 'rgba(8, 7, 44, 0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.10)',
      boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)',
      zIndex: 10,
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        left: '10%',
        top: '-60px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(130,87,229,0.25) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        right: '10%',
        top: '-60px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(0,242,254,0.18) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="row align-items-center gy-3">

          {/* Brand */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                 className="justify-content-center justify-content-md-start d-flex">
              <img
                alt="CareerLink Logo"
                src="https://i.postimg.cc/T1tPJSTZ/Smaller-Logo-Transparent.png"
                width="24"
                height="24"
              />
              <span style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                background: 'linear-gradient(to right, #00f2fe, #8257e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.04em',
              }}>
                CareerLink
              </span>
            </div>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 0,
            }}>
              Connecting talent with opportunity.
            </p>
          </div>

          {/* Nav links */}
          <div className="col-12 col-md-4 text-center">
            <nav style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['#home', '#about', '#profiles', '#following', '#contact'].map((href, i) => {
                const labels = ['Home', 'About', 'Profiles', 'Following', 'Contact'];
                return (
                  <a
                    key={href}
                    href={href}
                    style={{
                      fontSize: '0.82rem',
                      color: 'rgba(255,255,255,0.55)',
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#00f2fe'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {labels[i]}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Copyright */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <p style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.35)',
              margin: 0,
            }}>
              © {year} CareerLink. All rights reserved.
            </p>
          </div>

        </div>

        {/* Divider */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1.5rem 0 0.75rem' }} />

        <p style={{
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.2)',
          margin: 0,
          letterSpacing: '0.05em',
        }}>
          Built with ❤️ by the CareerLink Team
        </p>
      </div>
    </footer>
  );
}
