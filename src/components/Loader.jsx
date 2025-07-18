import React from 'react';

export default function Loader({ size = 'md', text = 'Carregando...' }) {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <div className={`spinner-border text-primary ${sizeClass}`} role="status">
          <span className="visually-hidden">{text}</span>
        </div>
        <div className="mt-2 text-muted">{text}</div>
      </div>
    </div>
  );
} 