import React from 'react';

const EventPage = () => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#222222',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px',
      textAlign: 'center',
      maxWidth: '600px',
      margin: 'auto',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#d35400'
      }}>
        Join Our Exclusive Event - Limited Seats!
      </h1>
      <p style={{
        fontSize: '1.2rem',
        lineHeight: '1.6',
        marginBottom: '30px',
        color: '#555555'
      }}>
        Don't miss out on this unique opportunity. Reserve your spot now to gain exclusive insights and network with industry leaders.
      </p>
      <button
        aria-label="Reserve your spot now"
        style={{
          backgroundColor: '#e67e22',
          color: '#ffffff',
          fontSize: '1.25rem',
          fontWeight: '700',
          padding: '15px 40px',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(230,126,34,0.4)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d35400'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e67e22'}
      >
        Reserve Your Spot Now
      </button>
    </div>
  );
};

export default EventPage;