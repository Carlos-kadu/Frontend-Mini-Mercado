import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import { API_BASE_URL } from '../api';

const endpoints = {
  alimentacao: 'alimentacao',
  vestuario: 'vestuario',
  utilidades: 'utilidades-domesticas',
};

const labels = {
  alimentacao: 'Alimentação',
  vestuario: 'Vestuário',
  utilidades: 'Utilidades Domésticas',
};

export default function ProdutosList({ categoria }) {
  const [produtos, setProdutos] = useState([]);
  const [filiaisMap, setFiliaisMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filialIdFromUrl = params.get('filial');

    axios.get(`${API_BASE_URL}/filiais/`)
      .then(res => {
        const map = {};
        res.data.forEach(filial => {
          map[filial.id_filial] = filial.nome_cidade;
        });
        setFiliaisMap(map);
      })
      .catch(err => console.error('Erro ao carregar filiais para mapeamento:', err));

    let apiUrl = `${API_BASE_URL}/${endpoints[categoria]}/`;
    if (filialIdFromUrl) {
      apiUrl += `?filial=${filialIdFromUrl}`;
    }

    axios.get(apiUrl)
      .then(res => setProdutos(res.data))
      .catch(() => setProdutos([]));
  }, [categoria, location.search]);

  const handleDelete = (id) => {
    setProdutoToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`${API_BASE_URL}/${endpoints[categoria]}/${produtoToDelete}/`)
      .then(() => setProdutos(produtos.filter(p => p.indice !== produtoToDelete)))
      .catch(() => alert('Erro ao excluir'))
      .finally(() => setShowModal(false));
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder={`Buscar ${labels[categoria].toLowerCase()} por nome...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => navigate(`/produtos/${categoria}/novo`)}>
          <i className="fas fa-plus me-2"></i>Novo {labels[categoria]}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Filial</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProdutos.map(produto => (
              <tr key={produto.indice}>
                <td>{produto.indice}</td>
                <td>{produto.nome}</td>
                <td>{produto.quant}</td>
                <td>{produto.preco}</td>
                <td>{filiaisMap[produto.filial] || 'Carregando...'}</td>
                <td className="text-center action-icons">
                  <Link to={`/produtos/${categoria}/editar/${produto.indice}`} title="Editar"><i className="fas fa-pencil-alt"></i></Link>
                  <a href="#" title="Excluir" onClick={() => handleDelete(produto.indice)}><i className="fas fa-trash-alt"></i></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalConfirm
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        body={`Você tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.`}
      />
    </>
  );
} 