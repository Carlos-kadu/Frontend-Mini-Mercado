import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function FilialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filial, setFilial] = useState({ nome_cidade: '', empresa: '' });
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/empresas/`)
      .then(res => setEmpresas(res.data))
      .catch(() => setEmpresas([]));
    if (id) {
      axios.get(`${API_BASE_URL}/filiais/${id}/`)
        .then(res => setFilial(res.data))
        .catch(() => alert('Erro ao carregar filial'));
    }
  }, [id]);

  const handleChange = e => setFilial({ ...filial, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const req = id
      ? axios.put(`${API_BASE_URL}/filiais/${id}/`, filial)
      : axios.post(`${API_BASE_URL}/filiais/`, filial);
    req.then(() => navigate('/filiais'))
      .catch(() => alert('Erro ao salvar'));
  };

  return (
    <div className="card p-4">
      <h2 className="h4 mb-3">{id ? 'Editar Filial' : 'Nova Filial'}</h2>
      {empresas.length === 0 ? (
        <div className="alert alert-warning">Cadastre uma empresa antes de criar uma filial.</div>
      ) : (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Cidade</label>
          <input type="text" className="form-control" name="nome_cidade" value={filial.nome_cidade} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Empresa</label>
          <select className="form-select" name="empresa" value={filial.empresa} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {empresas.map(e => (
              <option key={e.id_empresa} value={e.id_empresa}>{e.razao_social}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/filiais')}>Cancelar</button>
          <button type="submit" className="btn btn-success">
            <i className="fas fa-check me-2"></i>Salvar
          </button>
        </div>
      </form>
      )}
    </div>
  );
} 