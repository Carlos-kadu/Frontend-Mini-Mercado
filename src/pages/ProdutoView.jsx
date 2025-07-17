import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const endpoints = {
  alimentacao: 'alimentacao',
  vestuario: 'vestuario',
  utilidades: 'utilidades-domesticas',
};

export default function ProdutoView() {
  const { categoria, id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [filial, setFilial] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/${endpoints[categoria]}/${id}/`)
      .then(res => {
        setProduto(res.data);
        if (res.data.filial) {
          axios.get(`${API_BASE_URL}/filiais/${res.data.filial}/`).then(f => setFilial(f.data));
        }
      })
      .catch(() => alert('Erro ao carregar produto'));
  }, [categoria, id]);

  if (!produto || (produto.filial && !filial)) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '300px'}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  return (
    <div className="card p-4">
      <h2 style={{fontSize: '24px'}} className="display-4 fw-bold mb-4">{produto.nome}</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3"><b>Categoria:</b> {categoria.charAt(0).toUpperCase() + categoria.slice(1)}</div>
          <div className="mb-3"><b>Preço:</b> R$ {produto.preco}</div>
          <div className="mb-3"><b>Quantidade:</b> {produto.quant}</div>
          <div className="mb-3"><b>Filial:</b> {filial ? filial.nome_cidade : 'Carregando...'}</div>
        </div>
        <div className="col-md-6">
          <div className="mb-3"><b>Descrição:</b> {produto.descricao}</div>
          {produto.peso !== undefined && <div className="mb-3"><b>Peso:</b> {produto.peso} kg</div>}
          {produto.vegetariano !== undefined && <div className="mb-3"><b>Vegetariano:</b> {produto.vegetariano ? 'Sim' : 'Não'}</div>}
          {produto.tamanho !== undefined && <div className="mb-3"><b>Tamanho:</b> {produto.tamanho}</div>}
          {produto.genero && <div className="mb-3"><b>Gênero:</b> {produto.genero}</div>}
          {produto.material && <div className="mb-3"><b>Material:</b> {produto.material}</div>}
          {produto.marca && <div className="mb-3"><b>Marca:</b> {produto.marca}</div>}
          {produto.caracteristicas && <div className="mb-3"><b>Características:</b> {produto.caracteristicas}</div>}
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-secondary" onClick={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate(`/produtos`);
          }
        }}>Voltar</button>
        <button className="btn btn-primary" onClick={() => navigate(`/produtos/${categoria}/editar/${id}`)}>
          <i className="fas fa-edit me-1"></i>Editar
        </button>
        <button className="btn btn-danger" onClick={async () => {
          if(window.confirm('Tem certeza que deseja excluir este produto?')) {
            await axios.delete(`${API_BASE_URL}/${endpoints[categoria]}/${id}/`);
            navigate('/produtos');
          }
        }}>
          <i className="fa-solid fa-trash me-1"></i>Excluir
        </button>
      </div>
    </div>
  );
} 