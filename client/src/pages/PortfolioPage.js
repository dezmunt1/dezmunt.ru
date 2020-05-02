import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { ModalWindow } from '../components/ModalWindow';
import { useHttp } from '../hook/http.hook';
import { ProjectCard } from '../components/ProjectCard';

import { Spinner } from 'react-bootstrap';

export const PortfolioPage = () => {
  const [state, setState] = useState({
    refresh: false,
    coments: false
  });
  const { Component, setModalState} = ModalWindow();
  const Modal = Component({
    title: '',
    body: '',
    footer: ''
  });
  const {request} = useHttp();

  const portfolioList = localStorage.getItem('allPortfolios')
  ? JSON.parse( localStorage.getItem('allPortfolios') )
  : false;

  const getPortfolioList = useCallback( async () => {
    try {
      if ( portfolioList ) return null;

      const allPortfolios = (await request(`/api/portfolio/get-portfolio/`)).message;
      localStorage.setItem( 'allPortfolios', JSON.stringify(allPortfolios));
      setState({refresh: !state.refresh})
      return null;
    } catch (error) {console.log(error)};
  }, [request, portfolioList, state]);

  const clickPortfolioHandler = useCallback( e => {
    const target = e.currentTarget.id.slice( e.currentTarget.id.indexOf('-') + 1 );
    const portfolio = portfolioList.find( value => {
      return target === value.name
    });
    if (!portfolio) return;
    setModalState({
      show: true,
      title: portfolio.category,
      body: <>
        <div className="modal__projectName">{portfolio.projectName}</div>
        <div className="modal__projectImage" style={{backgroundImage: "url('" + portfolio.image + "')"}}></div>
        <div className="modal__technology">{portfolio.technology}</div>
      </>,
      footer: <Button variant="outline-primary" target="_blank" href={portfolio.link}>Перейти</Button>
    });
  }, [portfolioList, setModalState]);

  const generatePortfoliosList = useCallback( () => {
    if ( !portfolioList ) return [<Spinner key={123} animation="border"/>];
    const resultList = portfolioList.map( (portfolio, i ) => (
      <ProjectCard
        key = {i + 1}
        name = {portfolio.name}
        projectName = {portfolio.projectName}
        technology = {portfolio.technology}
        clickProjectHandler={clickPortfolioHandler}
      />
    ));
    return resultList;
  }, [portfolioList, clickPortfolioHandler])

  

  useEffect( () => {
    getPortfolioList()
    const comments = document.querySelector('.body__info').children.length;
    if( comments === 0 ) addComents();
  }, [getPortfolioList])

  const listing = generatePortfoliosList();

  return (
    <div className="container__portfolio"> 
      {Modal} 
      {/* HEADER */}
      <div className="wraper__portfolio header">
        <p className="header__text">Портфолио</p>
      </div>
      {/* BODY */}
      <div className="wraper__portfolio body__projects">
        {listing}
      </div>
      {/* INFO */}    
      <div className="wraper__contacts body__info">
        
      </div>
    </div>
  )
}

function addComents() {
  const info = document.querySelector('.body__info');
  const script = document.createElement('script');
  script.src = 'https://comments.app/js/widget.js?2';
  script.dataset.commentsAppWebsite = 'XXdibPdZ';
  script.dataset.limit = '5';
  script.dataset.height = '400';
  script.async = true;
  info.append(script)
}