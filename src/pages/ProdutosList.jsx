import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import { API_BASE_URL } from '../api';
import { SearchContext } from '../searchContext.jsx';

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

export default function ProdutosList({ categoria, searchTerm: searchTermProp }) {
  const [produtos, setProdutos] = useState([]);
  const [filiaisMap, setFiliaisMap] = useState({});
  const [filiais, setFiliais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchTermProp || '');
  const [filialFiltro, setFilialFiltro] = useState('');
  const [estoqueFiltro, setEstoqueFiltro] = useState('todos');
  const [limiteEstoque, setLimiteEstoque] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useContext(SearchContext);

  useEffect(() => {
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

    let apiUrls = [];
    if (categoria === 'todas') {
      apiUrls = Object.values(endpoints).map(endpoint => {
        let url = `${API_BASE_URL}/${endpoint}/`;
        const filtros = [];
        if (filialIdFromUrl) filtros.push(`filial=${filialIdFromUrl}`);
        if (baixoEstoqueParam === '1') filtros.push('baixo_estoque=1');
        if (baixoEstoqueParam === '1' && limiteParam) filtros.push(`limite=${limiteParam}`);
        if (filtros.length) url += '?' + filtros.join('&');
        return url;
      });
      Promise.all(apiUrls.map(url => axios.get(url).then(res => res.data)))
        .then(results => setProdutos([].concat(...results)))
        .catch(() => setProdutos([]));
    } else {
      let apiUrl = `${API_BASE_URL}/${endpoints[categoria]}/`;
      const filtros = [];
      if (filialIdFromUrl) filtros.push(`filial=${filialIdFromUrl}`);
      if (baixoEstoqueParam === '1') filtros.push('baixo_estoque=1');
      if (baixoEstoqueParam === '1' && limiteParam) filtros.push(`limite=${limiteParam}`);
      if (filtros.length) apiUrl += '?' + filtros.join('&');
      axios.get(apiUrl)
        .then(res => setProdutos(res.data))
        .catch(() => setProdutos([]));
    }
  }, [categoria, location.search]);

  useEffect(() => {
    if (searchTermProp !== undefined) setSearchTerm(searchTermProp);
  }, [searchTermProp]);

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
    (search ? produto.nome.toLowerCase().includes(search.toLowerCase()) : produto.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="mb-3 painel">
        <div className="d-flex align-items-center gap-3 w-100 flex-wrap">
          <select className="form-select" style={{ maxWidth: 300, minWidth: 200 }} value={filialFiltro} onChange={handleFilialChange}>
            <option value="">Todas as filiais</option>
            {filiais.map(f => (
              <option key={f.id_filial} value={f.id_filial}>{f.nome_cidade}</option>
            ))}
          </select>
          <div className="d-flex align-items-center gap-3">
            <select className="form-select" style={{ maxWidth: 300, minWidth: 200 }} value={estoqueFiltro} onChange={handleEstoqueFiltroChange}>
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
                <td className="text-center action-icons d-flex justify-content-center align-items-center gap-2">
                  <Link to={`/produtos/${categoria}/visualizar/${produto.indice}`} title="Visualizar" className="bg-light rounded p-1 px-2"><i className="fa-solid fa-eye text-success"></i></Link>
                  <Link to={`/produtos/${categoria}/editar/${produto.indice}`} title="Editar" className="bg-light rounded p-1 px-2"><i className="fas fa-edit text-primary"></i></Link>
                  <a href="#" title="Excluir" onClick={() => handleDelete(produto.indice)} className="bg-light rounded p-1 px-2"><i className="fa-solid fa-trash text-danger"></i></a>
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