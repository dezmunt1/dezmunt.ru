import React from 'react';
import { FormContacts } from '../components/FormContacts';



export const ContactsPage = () => {
  return (
    <div className="container__contacts"> 

      {/* HEADER */}
      <div className="wraper__contacts header">
        <p className="header__text">контакты</p>
      </div>

      {/* BODY */}
      <div className="wraper__contacts body__contacts">
        <div className="body__text">
          <p>{"для сотрудничества вы всегда можете связаться со мной в социальных сетях по\u00A0ссылкам ниже"}</p>
        </div>

        <div className="body__social">
          <a className="body__social-item telegram" href="tg://resolve?domain=dezamat">
            <i className="fab fa-telegram"></i>
          </a>
          <a className="body__social-item vk" href="https://vk.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-vk"></i>
          </a>
          <a className="body__social-item yahoo" href="mailto:pickleloper@yahoo.com">
            <i className="fab fa-yahoo"></i>
          </a>
        </div>
        <div className="body__text">
          <p>или заполните следующую форму</p>
          <p>я свяжусь с вами сам</p>
        </div>
        <FormContacts />
      </div>
        {/* Form */}
        

      <div className="wraper__contacts body__info" hidden>
        <h2>
          INFO
        </h2>
      </div>

    </div>
  )
}