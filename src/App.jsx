import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlertsList from './components/AlertsList';
import AlertDetails from './components/AlertDetails';
import GraphExplorer from './components/GraphExplorer';
import EvidencePacks from './components/EvidencePacks';

function App() {
  return (
    <>
      <div className="global-noise"></div>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertsList />} />
          <Route path="/alerts/:id" element={<AlertDetails />} />
          <Route path="/explorer" element={<GraphExplorer />} />
          <Route path="/evidence" element={<EvidencePacks />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
