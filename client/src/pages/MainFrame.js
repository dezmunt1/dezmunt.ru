import React, { useEffect } from 'react';
import { NavBarMobile } from '../components/NavBarMobile'

export const MainFrame = props => {

  useEffect( () => {
    document.querySelectorAll('.navigation-list--item').forEach( item => {
      if (item.firstElementChild.href === item.baseURI) {
        item.classList.add('active');
        return
      };
      item.classList.remove('active');
    })
  }, [])

  return (
    <div className="container">
      <div className="navigation">
        {/* LOGO */}
        <div className="navigation-logo">
          <a href="/" title="На главную">
            <img src="/img/avatar.png" alt="avatar" />
          </a>
        </div> 
        {/* MOBILE_NAV */}
        <div id="nav-bar">
          <NavBarMobile />
        </div>
        {/* NAV_LIST */}
        <div className="navigation-list">
          <div className="navigation-list--item">
            <a href='/' title="На главную">
              <i className="fas fa-user-circle"></i>
              <p>главная</p>
            </a>
          </div>
          <div className="navigation-list--item">
            <a href='/projects' title="Мои проекты">
              <i className="fab fa-mendeley"></i>
              <p>мои проекты</p>
            </a>
          </div>
          <div className="navigation-list--item">
            <a href='/portfolio' title="Моё портфолио">
              <i className="fas fa-stream"></i>
              <p>портфолио</p>
            </a>
          </div>
          <div className="navigation-list--item">
            <a href='/blog' title="Мой блог">
              <i className="far fa-comment"></i>
              <p>блог</p>
            </a>
          </div>
          <div className="navigation-list--item">
            <a href='/contacts' title="Связаться со мной">
              <i className="far fa-id-badge"></i>
              <p>контакты</p>
            </a>
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