import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ background: 'linear-gradient(90deg, #232526 0%, #414345 100%)' }}>
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-4" href="#" style={{ letterSpacing: 1 }}>Gestor de Estoque</a>
        <div className="d-flex">
          <button className="btn btn-outline-light rounded-pill px-4" type="button">
            <i className="fas fa-sign-out-alt me-2"></i>Deslogar
          </button>
        </div>
      </div>
    </nav>
  );
}