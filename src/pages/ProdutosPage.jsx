import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProdutosList from './ProdutosList';
import ProdutoForm from './ProdutoForm';
import ProdutosEdit from './ProdutosEdit';

const categorias = [
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'vestuario', label: 'Vestuário' },
  { value: 'utilidades', label: 'Utilidades Domésticas' },
];

export default function ProdutosPage() {
  const [tab, setTab] = useState('alimentacao');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleCategoriaChange = (e) => {
    setTab(e.target.value);
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="card p-4 mb-5 painel">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h4 mb-0">Produtos</h2>
            <button className="btn btn-primary d-flex align-items-center" onClick={() => navigate(`/produtos/${tab}/novo`)}>
              <i className="fas fa-plus me-2"></i>Cadastrar
            </button>
          </div>
          <div className="row mb-3 g-3 align-items-center">
            <div className="col-md-4">
              <select className="form-select w-100" value={tab} onChange={handleCategoriaChange}>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ProdutosList categoria={tab} searchTerm={searchTerm} />
        </div>
      } />
      <Route path=":categoria/editar/:id" element={<ProdutosEdit />} />
      <Route path=":categoria/novo" element={<ProdutoForm />} />
    </Routes>
  );
} 