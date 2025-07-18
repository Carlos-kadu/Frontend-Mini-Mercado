import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { API_BASE_URL } from '../api';

export default function Home() {
  const [totalFiliais, setTotalFiliais] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [baixoEstoque, setBaixoEstoque] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE_URL}/filiais/`),
      axios.get(`${API_BASE_URL}/alimentacao/`),
      axios.get(`${API_BASE_URL}/vestuario/`),
      axios.get(`${API_BASE_URL}/utilidades-domesticas/`),
      axios.get(`${API_BASE_URL}/alimentacao/?baixo_estoque=1&limite=10`),
      axios.get(`${API_BASE_URL}/vestuario/?baixo_estoque=1&limite=10`),
      axios.get(`${API_BASE_URL}/utilidades-domesticas/?baixo_estoque=1&limite=10`)
    ])
    .then(([filiaisRes, alimentacaoRes, vestuarioRes, utilidadesRes, baixoAlimentacaoRes, baixoVestuarioRes, baixoUtilidadesRes]) => {
      setTotalFiliais(filiaisRes.data.length);
      
      const total = alimentacaoRes.data.length + vestuarioRes.data.length + utilidadesRes.data.length;
      setTotalItens(total);
      
      const totalBaixo = baixoAlimentacaoRes.data.length + baixoVestuarioRes.data.length + baixoUtilidadesRes.data.length;
      setBaixoEstoque(totalBaixo);
      
      setLoading(false);
    })
    .catch(err => {
      console.error('Erro ao carregar dados do dashboard:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader text="Carregando dashboard..." />;
  }

  return (
    <div className="dashboard-bg min-vh-100 d-flex flex-column">
      <div className="container-fluid flex-grow-1 py-4">
        <div className="row align-items-center mb-4">
          <div className="col-md-8">
            <h1 className="fw-bold mb-4" style={{ letterSpacing: 1 }}>Dashboard</h1>
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
          <div className="col-md-4 text-center mb-3 mb-md-0" style={{textAlign: 'center!important'}}>
            <img src="/assets/imgs/mascote.png" alt="Mascote" style={{maxWidth: 180, borderRadius: 20}} />
          </div>
        </div>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <Link to="/filiais/nova" className="text-decoration-none">
              <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                <i className="fas fa-plus-circle fa-2x mb-2 text-primary"></i>
                <h5 className="mb-2 fw-semibold">Cadastrar Filial</h5>
                <p className="text-muted">Adicione uma nova filial</p>
              </div>
            </Link>
          </div>
          <div className="col-12 col-md-6">
            <Link to="/produtos/alimentacao/novo" className="text-decoration-none">
              <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                <i className="fas fa-utensils fa-2x mb-2 text-success"></i>
                <h5 className="mb-2 fw-semibold">Cadastrar Alimentação</h5>
                <p className="text-muted">Adicione um novo item de alimentação</p>
              </div>
            </Link>
          </div>
          <div className="col-12 col-md-6">
            <Link to="/produtos/vestuario/novo" className="text-decoration-none">
              <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                <i className="fas fa-tshirt fa-2x mb-2 text-warning"></i>
                <h5 className="mb-2 fw-semibold">Cadastrar Vestuário</h5>
                <p className="text-muted">Adicione um novo item de vestuário</p>
              </div>
            </Link>
          </div>
          <div className="col-12 col-md-6">
            <Link to="/produtos/utilidades/novo" className="text-decoration-none">
              <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                <i className="fas fa-home fa-2x mb-2 text-info"></i>
                <h5 className="mb-2 fw-semibold">Cadastrar Utilidades</h5>
                <p className="text-muted">Adicione um novo item doméstico</p>
              </div>
            </Link>
          </div>
          <div className="col-12 col-md-6">
            <Link to="/produtos" className="text-decoration-none">
              <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                <i className="fas fa-cubes fa-2x mb-2 text-secondary"></i>
                <h5 className="mb-2 fw-semibold">Gestão de Itens</h5>
                <p className="text-muted">Gerencie todos os itens</p>
              </div>
            </Link>
          </div>
          <div className="col-12 col-md-6">
            <Link to="/filiais" className="text-decoration-none">
              <div className="card quick-action-card p-4 text-center h-100 shadow-sm">
                <i className="fas fa-sitemap fa-2x mb-2 text-dark"></i>
                <h5 className="mb-2 fw-semibold">Gestão de Filiais</h5>
                <p className="text-muted">Gerencie todas as filiais</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}