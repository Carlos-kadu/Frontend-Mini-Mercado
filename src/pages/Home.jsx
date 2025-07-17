import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function Home() {
  const [totalFiliais, setTotalFiliais] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [baixoEstoque, setBaixoEstoque] = useState(0);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/filiais/`)
      .then(res => setTotalFiliais(res.data.length))
      .catch(err => console.error('Erro ao buscar filiais:', err));

    Promise.all([
      axios.get(`${API_BASE_URL}/alimentacao/`),
      axios.get(`${API_BASE_URL}/vestuario/`),
      axios.get(`${API_BASE_URL}/utilidades-domesticas/`)
    ])
    .then(responses => {
      const total = responses.reduce((sum, res) => sum + res.data.length, 0);
      setTotalItens(total);
    })
    .catch(err => console.error('Erro ao buscar produtos:', err));

    Promise.all([
      axios.get(`${API_BASE_URL}/alimentacao/?baixo_estoque=1&limite=10`),
      axios.get(`${API_BASE_URL}/vestuario/?baixo_estoque=1&limite=10`),
      axios.get(`${API_BASE_URL}/utilidades-domesticas/?baixo_estoque=1&limite=10`)
    ])
    .then(responses => {
      const totalBaixo = responses.reduce((sum, res) => sum + res.data.length, 0);
      setBaixoEstoque(totalBaixo);
    })
    .catch(err => console.error('Erro ao buscar produtos com baixo estoque:', err));
  }, []);

  return (
    <div className="dashboard-bg min-vh-100 d-flex flex-column">
      <div className="container-fluid flex-grow-1 py-4">
        <div className="row align-items-center mb-4">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <img src="https://sdmntprwestus2.oaiusercontent.com/files/00000000-a01c-61f8-8b5a-b112b1b2c0c4/raw?se=2025-07-18T04%3A22%3A50Z&sp=r&sv=2024-08-04&sr=b&scid=4a6b300c-a565-56c6-b508-c6f9b424fe80&skoid=f71d6506-3cac-498e-b62a-67f9228033a9&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-18T03%3A22%3A26Z&ske=2025-07-19T03%3A22%3A26Z&sks=b&skv=2024-08-04&sig=E4zzpgo0zO23JvYNXFH/NFi/o62572zWJT2yQzjNRgI%3D" alt="Mascote" style={{maxWidth: 180, borderRadius: 20}} />
          </div>
          <div className="col-md-8">
            <div className="row g-4">
              <div className="col-md-6">
                <Link to="/filiais/nova" className="text-decoration-none">
                  <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                    <i className="fas fa-plus-circle fa-2x mb-2 text-primary"></i>
                    <h5 className="mb-2 fw-semibold">Cadastrar Filial</h5>
                    <p className="text-muted">Adicione uma nova filial</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link to="/produtos/alimentacao/novo" className="text-decoration-none">
                  <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                    <i className="fas fa-plus-square fa-2x mb-2 text-success"></i>
                    <h5 className="mb-2 fw-semibold">Cadastrar Item</h5>
                    <p className="text-muted">Adicione um novo item ao estoque</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link to="/produtos" className="text-decoration-none">
                  <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                    <i className="fas fa-cubes fa-2x mb-2 text-info"></i>
                    <h5 className="mb-2 fw-semibold">Gestão de Itens</h5>
                    <p className="text-muted">Gerencie todos os itens</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link to="/filiais" className="text-decoration-none">
                  <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                    <i className="fas fa-sitemap fa-2x mb-2 text-secondary"></i>
                    <h5 className="mb-2 fw-semibold">Gestão de Filiais</h5>
                    <p className="text-muted">Gerencie todas as filiais</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <h2 className="fw-bold mb-4" style={{ letterSpacing: 1 }}>Dashboard</h2>
        <div className="row text-center mb-4 g-4">
          <div className="col-md-4 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <i className="fas fa-store fa-3x mb-3 text-primary"></i>
                <h1 className="display-4 fw-bold">{totalFiliais}</h1>
                <p className="mb-0 text-secondary">Total de Filiais</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <i className="fas fa-boxes fa-3x mb-3 text-success"></i>
                <h1 className="display-4 fw-bold">{totalItens}</h1>
                <p className="mb-0 text-secondary">Total de Itens</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <i className="fas fa-exclamation-triangle fa-3x mb-3 text-warning"></i>
                <h1 className="display-4 fw-bold">{baixoEstoque}</h1>
                <p className="mb-0 text-secondary">Itens com Estoque Baixo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}