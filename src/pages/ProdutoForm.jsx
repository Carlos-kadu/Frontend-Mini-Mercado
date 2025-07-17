import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const categoriaFields = {
  alimentacao: [
    { name: 'nome', label: 'Nome', type: 'text' },
    { name: 'preco', label: 'Preço', type: 'number', step: '0.01' },
    { name: 'quant', label: 'Quantidade', type: 'number' },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'peso', label: 'Peso (kg)', type: 'number', step: '0.01' },
    { name: 'vegetariano', label: 'Vegetariano', type: 'checkbox' },
    { name: 'filial', label: 'Filial', type: 'select' },
  ],
  vestuario: [
    { name: 'nome', label: 'Nome', type: 'text' },
    { name: 'preco', label: 'Preço', type: 'number', step: '0.01' },
    { name: 'quant', label: 'Quantidade', type: 'number' },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'tamanho', label: 'Tamanho', type: 'number' },
    { name: 'genero', label: 'Gênero', type: 'text' },
    { name: 'filial', label: 'Filial', type: 'select' },
  ],
  utilidades: [
    { name: 'nome', label: 'Nome', type: 'text' },
    { name: 'preco', label: 'Preço', type: 'number', step: '0.01' },
    { name: 'quant', label: 'Quantidade', type: 'number' },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'material', label: 'Material', type: 'text' },
    { name: 'marca', label: 'Marca', type: 'text' },
    { name: 'caracteristicas', label: 'Características', type: 'text' },
    { name: 'filial', label: 'Filial', type: 'select' },
  ],
};

const endpoints = {
  alimentacao: 'alimentacao',
  vestuario: 'vestuario',
  utilidades: 'utilidades-domesticas',
};

export default function ProdutoForm() {
  const { categoria, id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState({});
  const [filiais, setFiliais] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/filiais/`)
      .then(res => setFiliais(res.data));
    if (id) {
      axios.get(`${API_BASE_URL}/${endpoints[categoria]}/${id}/`)
        .then(res => setProduto(res.data))
        .catch(() => alert('Erro ao carregar produto'));
    }
  }, [id, categoria]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setProduto({
      ...produto,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const req = id
      ? axios.put(`${API_BASE_URL}/${endpoints[categoria]}/${id}/`, produto)
      : axios.post(`${API_BASE_URL}/${endpoints[categoria]}/`, produto);
    req.then(() => navigate('/produtos'))
      .catch(() => alert('Erro ao salvar'));
  };

  const fields = categoriaFields[categoria] || [];
  const chunkSize = 2;

  return (
    <div className="card p-4">
      <h2 className="h4 mb-3">{id ? 'Editar Produto' : 'Novo Produto'}</h2>
      <form onSubmit={handleSubmit}>
        {Array.from({ length: Math.ceil(fields.length / chunkSize) }, (_, i) => (
          <div className="row" key={i}>
            {fields.slice(i * chunkSize, i * chunkSize + chunkSize).map(field => (
              <div className="col-md-6 mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select className="form-select" name={field.name} value={produto[field.name] || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {filiais.map(f => (
                      <option key={f.id_filial} value={f.id_filial}>{f.nome_cidade}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input type="checkbox" className="form-check-input ms-2" name={field.name} checked={!!produto[field.name]} onChange={handleChange} />
                ) : (
                  <input type={field.type} step={field.step} className="form-control" name={field.name} value={produto[field.name] || ''} onChange={handleChange} required={field.name !== 'descricao'} />
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="mt-3 d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/produtos')}>Cancelar</button>
          <button type="submit" className="btn btn-success">
            <i className="fas fa-check me-2"></i>Salvar
          </button>
        </div>
      </form>
    </div>
  );
} 