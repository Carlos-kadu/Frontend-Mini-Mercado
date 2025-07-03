import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import { API_BASE_URL } from '../api';

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/empresas/`)
      .then(res => setEmpresas(res.data))
      .catch(() => alert('Erro ao carregar empresas'));
  }, []);

  const handleDelete = (id) => {
    setEmpresaToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios.delete(`${API_BASE_URL}/empresas/${empresaToDelete}/`)
      .then(() => setEmpresas(empresas.filter(e => e.id_empresa !== empresaToDelete)))
      .catch(() => alert('Erro ao excluir'))
      .finally(() => setShowModal(false));
  };

  return (
    <div className="card p-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4">Empresas</h2>
        <Link to="/empresas/nova" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Nova Empresa
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Máx. Filiais</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map(empresa => (
              <tr key={empresa.id_empresa}>
                <td>{empresa.id_empresa}</td>
                <td>{empresa.razao_social}</td>
                <td>{empresa.cnpj}</td>
                <td>{empresa.num_max_filiais}</td>
                <td className="text-center action-icons">
                  <Link to={`/empresas/editar/${empresa.id_empresa}`} title="Editar"><i className="fas fa-pencil-alt"></i></Link>
                  <a href="#" title="Excluir" onClick={() => handleDelete(empresa.id_empresa)}><i className="fas fa-trash-alt"></i></a>
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
        body="Você tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
      />
    </div>
  );
} 