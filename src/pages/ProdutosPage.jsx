import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProdutosList from './ProdutosList';
import ProdutoForm from './ProdutoForm';

export default function ProdutosPage() {
  const [tab, setTab] = useState('alimentacao');

  return (
    <div className="card p-4 mb-5">
      <h2 className="h4 mb-3">Produtos</h2>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'alimentacao' ? 'active' : ''}`} onClick={() => setTab('alimentacao')}>Alimentação</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'vestuario' ? 'active' : ''}`} onClick={() => setTab('vestuario')}>Vestuário</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'utilidades' ? 'active' : ''}`} onClick={() => setTab('utilidades')}>Utilidades Domésticas</button>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<ProdutosList categoria={tab} />} />
        <Route path=":categoria/novo" element={<ProdutoForm />} />
        <Route path=":categoria/editar/:id" element={<ProdutoForm />} />
      </Routes>
    </div>
  );
} 