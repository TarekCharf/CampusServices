import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import DashboardSprint1 from './components/DashboardSprint1';
import DashboardSprint2 from './components/DashboardSprint2';
import CreateDemande from './components/CreateDemande';
import GetDemande from './components/GetDemande';
import ApiDocs from './components/ApiDocs';
import Navbar from './components/shared/NavBar';
import { AppToaster } from './components/shared/AppToaster';
import ListeDemande from './components/ListeDemande';
import TraiterDemande from './components/TraiterDemande';

function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar />
      <AppToaster />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboardSprint1" element={<DashboardSprint1 />} />
          <Route path="/dashboardSprint2" element={<DashboardSprint2 />} />
          <Route path="/creer-demande" element={<CreateDemande />} />
          <Route path="/suivi-demande" element={<GetDemande />} />
          <Route path="/liste-demande" element={<ListeDemande />} />
          <Route path="/traiter-demande/:numDemande" element={<TraiterDemande />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
