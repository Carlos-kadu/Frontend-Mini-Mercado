import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function EmpresaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState({ razao_social: '', cnpj: '', num_max_filiais: 1 });

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE_URL}/empresas/${id}/`)
        .then(res => setEmpresa(res.data))
        .catch(() => alert('Erro ao carregar empresa'));
    }
  }, [id]);

  const handleChange = e => setEmpresa({ ...empresa, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const req = id
      ? axios.put(`${API_BASE_URL}/empresas/${id}/`, empresa)
      : axios.post(`${API_BASE_URL}/empresas/`, empresa);
    req.then(() => navigate('/empresas'))
      .catch(() => alert('Erro ao salvar'));
  };

  return (
    <div className="card p-4">
      <h2 className="h4 mb-3">{id ? 'Editar Empresa' : 'Nova Empresa'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Razão Social</label>
          <input type="text" className="form-control" name="razao_social" value={empresa.razao_social} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">CNPJ</label>
          <input type="text" className="form-control" name="cnpj" value={empresa.cnpj} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Número Máximo de Filiais</label>
          <input type="number" className="form-control" name="num_max_filiais" value={empresa.num_max_filiais} onChange={handleChange} min={1} required />
        </div>
        <div className="mt-3 d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/empresas')}>Cancelar</button>
          <button type="submit" className="btn btn-success">
            <i className="fas fa-check me-2"></i>Salvar
          </button>
        </div>
      </form>
    </div>
  );
} 