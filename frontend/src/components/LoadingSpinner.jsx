import React from 'react';

// Styling bisa ditaruh di file CSS terpisah, tapi di sini agar simpel
const spinnerStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#5a67d8',
    animation: 'spin 1s ease infinite',
    margin: '2rem auto'
};

const keyframes = `
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`;

const LoadingSpinner = () => {
    return (
        <>
            <style>{keyframes}</style>
            <div style={spinnerStyle} />
        </>
    );
};

export default LoadingSpinner;