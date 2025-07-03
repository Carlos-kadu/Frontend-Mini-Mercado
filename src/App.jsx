import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmpresasList from './pages/EmpresasList';
import EmpresaForm from './pages/EmpresaForm';
import FiliaisList from './pages/FiliaisList';
import FilialForm from './pages/FilialForm';
import ProdutosPage from './pages/ProdutosPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<EmpresasList />} />
          <Route path="/empresas/nova" element={<EmpresaForm />} />
          <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
          <Route path="/filiais" element={<FiliaisList />} />
          <Route path="/filiais/nova" element={<FilialForm />} />
          <Route path="/filiais/editar/:id" element={<FilialForm />} />
          <Route path="/produtos/*" element={<ProdutosPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
