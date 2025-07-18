import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-4" href="/">Gestor de Estoque</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/produtos">Produtos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/empresas">Empresas</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/filiais">Filiais</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}