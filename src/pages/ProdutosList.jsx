import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import Loader from '../components/Loader';
import { API_BASE_URL } from '../api';

const endpoints = {
  alimentacao: 'alimentacao',
  vestuario: 'vestuario',
  utilidades: 'utilidades-domesticas',
};

export default function ProdutosList({ categoria }) {
  const [produtos, setProdutos] = useState([]);
  const [filiaisMap, setFiliaisMap] = useState({});
  const [filiais, setFiliais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filialFiltro, setFilialFiltro] = useState('');
  const [estoqueFiltro, setEstoqueFiltro] = useState('todos');
  const [limiteEstoque, setLimiteEstoque] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/filiais/`)
      .then(res => {
        setFiliais(res.data);
        const map = {};
        res.data.forEach(filial => {
          map[filial.id_filial] = filial.nome_cidade;
        });
        setFiliaisMap(map);
      })
      .catch(err => console.error('Erro ao carregar filiais para mapeamento:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(location.search);
    const filialIdFromUrl = params.get('filial');
    const searchParam = params.get('search');
    const baixoEstoqueParam = params.get('baixo_estoque');
    const limiteParam = params.get('limite');
    if (searchParam) setSearchTerm(searchParam);
    if (filialIdFromUrl) setFilialFiltro(filialIdFromUrl);
    else setFilialFiltro('');
    setEstoqueFiltro(baixoEstoqueParam === '1' ? 'baixo' : 'todos');
    setLimiteEstoque(limiteParam ? Number(limiteParam) : 10);

    let apiUrl = `${API_BASE_URL}/${endpoints[categoria]}/`;
    const filtros = [];
    if (filialIdFromUrl) filtros.push(`filial=${filialIdFromUrl}`);
    if (baixoEstoqueParam === '1') filtros.push('baixo_estoque=1');
    if (baixoEstoqueParam === '1' && limiteParam) filtros.push(`limite=${limiteParam}`);
    if (filtros.length) apiUrl += '?' + filtros.join('&');
    
    axios.get(apiUrl)
      .then(res => setProdutos(res.data))
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
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

  const handleFilialChange = (e) => {
    const value = e.target.value;
    setFilialFiltro(value);
    const params = new URLSearchParams(location.search);
    if (value) params.set('filial', value);
    else params.delete('filial');
    navigate({ search: params.toString() });
  };

  const handleEstoqueFiltroChange = (e) => {
    const value = e.target.value;
    setEstoqueFiltro(value);
    const params = new URLSearchParams(location.search);
    if (value === 'baixo') {
      params.set('baixo_estoque', '1');
      params.set('limite', limiteEstoque);
    } else {
      params.delete('baixo_estoque');
      params.delete('limite');
    }
    navigate({ search: params.toString() });
  };

  const handleLimiteChange = (e) => {
    const value = e.target.value;
    setLimiteEstoque(value);
    const params = new URLSearchParams(location.search);
    if (estoqueFiltro === 'baixo') params.set('limite', value);
    navigate({ search: params.toString() });
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-3">
        <div className="row g-2 align-items-center w-100 flex-wrap">
          <div className="col-md">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-auto">
            <select className="form-select" style={{ minWidth: 180 }} value={filialFiltro} onChange={handleFilialChange}>
              <option value="">Todas as filiais</option>
              {filiais.map(f => (
                <option key={f.id_filial} value={f.id_filial}>{f.nome_cidade}</option>
              ))}
            </select>
          </div>
          <div className="col-md-auto d-flex align-items-center gap-2">
            <select className="form-select" style={{ minWidth: 180 }} value={estoqueFiltro} onChange={handleEstoqueFiltroChange}>
              <option value="todos">Todos os itens</option>
              <option value="baixo">Itens em baixo estoque</option>
            </select>
            {estoqueFiltro === 'baixo' && (
              <>
                <label className="form-label mb-0 ms-2" htmlFor="limiteEstoqueInput">Limite:</label>
                <input
                  id="limiteEstoqueInput"
                  type="number"
                  min="1"
                  className="form-control ms-2"
                  style={{ width: 100 }}
                  value={limiteEstoque}
                  onChange={handleLimiteChange}
                  title="Limite para considerar baixo estoque"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Carregando produtos..." />
      ) : (
        <>
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
                  <tr key={produto.indice} id={`produto-row-${produto.indice}`}>
                    <td>{produto.indice}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.quant}</td>
                    <td>{produto.preco}</td>
                    <td>{filiaisMap[produto.filial] || 'Carregando...'}</td>
                    <td className="text-center action-icons d-flex justify-content-center align-items-center gap-2">
                      <Link to={`/produtos/${categoria}/visualizar/${produto.indice}`} title="Visualizar" className="bg-light rounded p-1 px-2" id={`view-produto-${produto.indice}`}><i className="fa-solid fa-eye text-success"></i></Link>
                      <Link to={`/produtos/${categoria}/editar/${produto.indice}`} title="Editar" className="bg-light rounded p-1 px-2" id={`edit-produto-${produto.indice}`}><i className="fas fa-edit text-primary"></i></Link>
                      <button type="button" title="Excluir" className="bg-light rounded p-1 px-2 border-0" onClick={() => handleDelete(produto.indice)} id={`delete-produto-${produto.indice}`}><i className="fa-solid fa-trash text-danger"></i></button>
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
      )}
    </>
  );
}