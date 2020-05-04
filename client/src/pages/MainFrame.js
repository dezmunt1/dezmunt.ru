import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { NavBarMobile } from '../components/NavBarMobile'

export const MainFrame = props => {

  useEffect( () => {
    document.querySelectorAll('.navigation-list--item').forEach( item => {
      item.addEventListener( 'click', event => {
        const target = event.currentTarget;
        document.querySelectorAll('.navigation-list--item').forEach( item => item.classList.remove('active') );
        target.classList.add('active');
      });   
    });
  }, []);
  
  return (
    <div className="container">
      <div className="navigation">
        {/* LOGO */}
        <div className="navigation-logo">
          <Link to="/" title="На главную">
            <img src="/img/avatar.png" alt="avatar" />
          </Link>
        </div> 
        {/* MOBILE_NAV */}
        <div id="nav-bar">
          <NavBarMobile />
        </div>
        {/* NAV_LIST */}
        <div className="navigation-list">
          <div className="navigation-list--item">
            <Link to='/' title="На главную" >
              <i className="fas fa-user-circle"></i>
              <p>главная</p>
            </Link>
          </div>
          <div className="navigation-list--item">
            <Link to='/projects' title="Мои проекты">
              <i className="fab fa-mendeley"></i>
              <p>мои проекты</p>
            </Link>
          </div>
          <div className="navigation-list--item">
            <Link to='/portfolio' title="Моё портфолио">
              <i className="fas fa-stream"></i>
              <p>портфолио</p>
            </Link>
          </div>
          <div className="navigation-list--item">
            <Link to='/blog' title="Мой блог">
              <i className="far fa-comment"></i>
              <p>блог</p>
            </Link>
          </div>
          <div className="navigation-list--item">
            <Link to='/contacts' title="Связаться со мной">
              <i className="far fa-id-badge"></i>
              <p>контакты</p>
            </Link>
          </div>
        </div>
      </div>
      {/* CONTENT */}
      <div className="content">
        {props.children}
      </div>
    </div>
  )
};