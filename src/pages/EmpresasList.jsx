import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ModalConfirm from '../components/ModalConfirm';
import Loader from '../components/Loader';
import { API_BASE_URL } from '../api';

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/empresas/`)
      .then(res => setEmpresas(res.data))
      .catch(() => alert('Erro ao carregar empresas'))
      .finally(() => setLoading(false));
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
      
      {loading ? (
        <Loader text="Carregando empresas..." />
      ) : (
        <>
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
                  <tr key={empresa.id_empresa} id={`empresa-row-${empresa.id_empresa}`}>
                    <td>{empresa.id_empresa}</td>
                    <td>{empresa.razao_social}</td>
                    <td>{empresa.cnpj}</td>
                    <td>{empresa.num_max_filiais}</td>
                    <td className="text-center action-icons d-flex justify-content-center align-items-center gap-2">
                      <Link to={`/empresas/editar/${empresa.id_empresa}`} title="Editar" className="bg-light rounded p-1 px-2" id={`edit-empresa-${empresa.id_empresa}`}><i className="fas fa-edit text-primary"></i></Link>
                      <a href="#" title="Excluir" onClick={() => handleDelete(empresa.id_empresa)} className="bg-light rounded p-1 px-2" id={`delete-empresa-${empresa.id_empresa}`}><i className="fa-solid fa-trash text-danger"></i></a>
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
        </>
      )}
    </div>
  );
} 