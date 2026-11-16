import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import CreateDemande from './components/CreateDemande';
import GetDemande from './components/GetDemande';
import ApiDocs from './components/ApiDocs';
import Navbar from './components/shared/NavBar';
import { AppToaster } from './components/shared/AppToaster';

function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar />
      <AppToaster />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creer-demande" element={<CreateDemande />} />
          <Route path="/suivi-demande" element={<GetDemande />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
