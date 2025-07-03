import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import { API_BASE_URL } from '../api';

export default function FiliaisList() {
  const [filiais, setFiliais] = useState([]);
  const [empresasMap, setEmpresasMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [filialToDelete, setFilialToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar empresas para mapear ID para Razão Social
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
      .then(res => setFiliais(res.data))
      .catch(() => alert('Erro ao carregar filiais'));
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
              <tr key={filial.id_filial}>
                <td>{filial.id_filial}</td>
                <td>{filial.nome_cidade}</td>
                <td>{empresasMap[filial.empresa] || 'Carregando...'}</td> {/* Exibe Razão Social */}
                <td>{filial.qtd_produtos}</td> {/* Supondo que o backend já retorna qtd_produtos */}
                <td className="text-center action-icons">
                  <Link to={`/filiais/editar/${filial.id_filial}`} title="Editar"><i className="fas fa-pencil-alt"></i></Link>
                  <a href="#" title="Excluir" onClick={() => handleDelete(filial.id_filial)}><i className="fas fa-trash-alt"></i></a>
                  <Link to={`/produtos?filial=${filial.id_filial}`} title="Visualizar Produtos"><i className="fas fa-box"></i></Link> {/* Link para produtos da filial */}
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
    </div>
  );
} 