import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MainFrame } from './pages/MainFrame';
import { useRoutes } from './routes';
import { AppContext } from './context/AppContext';


import { ToastMessage } from './components/ToastMessage';

function App() {
  
  const { Component, setProp } = ToastMessage();
  const TM = Component();

  return (
    <AppContext.Provider value={ {toastMessage: setProp} }>
      {TM}
      <MainFrame>
        <Router>
          { useRoutes() }
        </Router>
      </MainFrame>
    </AppContext.Provider>
  )
}

export { App };
