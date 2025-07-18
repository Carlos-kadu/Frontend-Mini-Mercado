import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import Loader from '../components/Loader';
import { API_BASE_URL } from '../api';

export default function FiliaisList() {
  const [filiais, setFiliais] = useState([]);
  const [empresasMap, setEmpresasMap] = useState({});
  const [produtosPorFilial, setProdutosPorFilial] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [filialToDelete, setFilialToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const calcularProdutosPorFilial = async (filialId) => {
    try {
      const endpoints = ['alimentacao', 'vestuario', 'utilidades-domesticas'];
      const promises = endpoints.map(endpoint => 
        axios.get(`${API_BASE_URL}/${endpoint}/?filial=${filialId}`)
          .then(res => res.data.length)
          .catch(() => 0)
      );
      
      const resultados = await Promise.all(promises);
      const total = resultados.reduce((sum, qtd) => sum + qtd, 0);
      return total;
    } catch (error) {
      console.error('Erro ao calcular produtos da filial:', error);
      return 0;
    }
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/empresas/`)
      .then(res => {
        const map = {};
        res.data.forEach(emp => {
          map[emp.id_empresa] = emp.razao_social;
        });
        setEmpresasMap(map);
      })
      .catch(err => console.error('Erro ao carregar empresas para mapeamento:', err));

    axios.get(`${API_BASE_URL}/filiais/`)
      .then(async res => {
        setFiliais(res.data);
        
        const produtosMap = {};
        for (const filial of res.data) {
          const qtd = await calcularProdutosPorFilial(filial.id_filial);
          produtosMap[filial.id_filial] = qtd;
        }
        setProdutosPorFilial(produtosMap);
        setLoading(false);
      })
      .catch(() => {
        alert('Erro ao carregar filiais');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setFilialToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`${API_BASE_URL}/filiais/${filialToDelete}/`)
      .then(() => setFiliais(filiais.filter(f => f.id_filial !== filialToDelete)))
      .catch(() => alert('Erro ao excluir'))
      .finally(() => setShowModal(false));
  };

  const filteredFiliais = filiais.filter(filial =>
    filial.nome_cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card p-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4">Gestão de Filiais</h2>
        <Link to="/filiais/nova" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Nova Filial
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar filial por cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader text="Carregando filiais..." />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Cidade</th>
                  <th>Empresa</th>
                  <th>Qtd. Produtos</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiliais.map(filial => (
                  <tr key={filial.id_filial} id={`filial-row-${filial.id_filial}`}>
                    <td>{filial.id_filial}</td>
                    <td>{filial.nome_cidade}</td>
                    <td>{empresasMap[filial.empresa] || 'Carregando...'}</td>
                    <td>{produtosPorFilial[filial.id_filial] !== undefined ? produtosPorFilial[filial.id_filial] : 'Carregando...'}</td>
                    <td className="text-center action-icons d-flex justify-content-center align-items-center gap-2">
                      <Link to={`/filiais/editar/${filial.id_filial}`} title="Editar" className="bg-light rounded p-1 px-2" id={`edit-filial-${filial.id_filial}`}><i className="fas fa-edit text-primary"></i></Link>
                      <a href="#" title="Excluir" onClick={() => handleDelete(filial.id_filial)} className="bg-light rounded p-1 px-2" id={`delete-filial-${filial.id_filial}`}><i className="fa-solid fa-trash text-danger"></i></a>
                      <Link to={`/produtos?filial=${filial.id_filial}`} title="Visualizar Produtos" className="bg-light rounded p-1 px-2" id={`view-produtos-filial-${filial.id_filial}`}><i className="fas fa-box text-warning"></i></Link>
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
            body="Você tem certeza que deseja excluir esta filial? Esta ação não pode ser desfeita."
          />
        </>
      )}
    </div>
  );
} 