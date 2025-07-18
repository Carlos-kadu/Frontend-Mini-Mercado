import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ProdutosList from './ProdutosList';
import ProdutoForm from './ProdutoForm';
import ProdutosEdit from './ProdutosEdit';
import ProdutoView from './ProdutoView';

const categorias = [
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'vestuario', label: 'Vestuário' },
  { value: 'utilidades', label: 'Utilidades Domésticas' },
];

export default function ProdutosPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoriaParam = params.get('categoria');
  const [tab, setTab] = useState(categoriaParam || 'alimentacao');
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
          <div className="row mb-3 g-3">
            <div className="col-12 mb-2">
              <select className="form-select w-100" value={tab} onChange={handleCategoriaChange}>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <ProdutosList categoria={tab} />
        </div>
      } />
      <Route path=":categoria/editar/:id" element={<ProdutosEdit />} />
      <Route path=":categoria/novo" element={<ProdutoForm />} />
      <Route path=":categoria/visualizar/:id" element={<ProdutoView />} />
    </Routes>
  );
} 