import React, { useEffect } from 'react';
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

  useEffect( () => {
    if (document.querySelector('.overscreen')) {
      document.querySelector('.container').hidden = true;
    }
  }, [])
  
  return (
    <AppContext.Provider value={ {toastMessage: setProp} }>
      {TM}
      <Router>
        {useRoutes('overscreen')}
        <MainFrame>
          { useRoutes('content') }
        </MainFrame>
      </Router>
    </AppContext.Provider>
  )
}

export { App };
