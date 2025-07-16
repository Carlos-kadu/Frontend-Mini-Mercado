import React, { useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { SearchContext } from '../searchContext.jsx';

export default function Navbar() {
  const [input, setInput] = useState('');
  const { setSearch } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input);
    navigate(`/produtos?search=${encodeURIComponent(input)}`);
  };

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
          {/* Centraliza os links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
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
          {/* Alinha o input de busca à direita */}
          <form className="d-flex ms-auto search-form" style={{ minWidth: "250px" }} onSubmit={handleSearch}>
            <input
              className="form-control me-2 search-input"
              type="search"
              placeholder="Pesquisar por produtos..."
              id="search-input"
              aria-label="Search"
              style={{
                border: "1px solid #fff",
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              id="search-button"
              className="btn"
              type="submit"
            >
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}