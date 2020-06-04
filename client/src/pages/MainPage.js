import React from 'react';
import {Link} from 'react-router-dom';

import { Avatar, Box, Typography, Divider, useMediaQuery } from '@material-ui/core';

export const MainPage = () => {
  
  const notMobile = useMediaQuery('(min-width: 480px)');

  return (
    <div className="container__main">
      {/* HEADER */}
      <div className="wraper__main header">
        <p className="header__text">Главная</p>
      </div>
      {/* BODY */}
      <div className="wraper__main body">
        <Box justifyContent="center" display="flex">
          <Avatar classes={{root: 'avatar__dezmunt'}} alt="avatar" src="/img/232.jpg" />
        </Box>
        <Box display="flex" flexDirection="column" margin={`0 ${ notMobile ? '60px': '20px'}`}>
          <Typography variant={ notMobile ? 'h4': 'h5' } align="center" style={{textTransform: "uppercase", fontWeight: 300, margin: "20px 0 10px"}}>
            Добро пожаловать!
          </Typography>
      
          <Typography variant="body1" align="center" >
            Меня зовут Владимир, я веб-разработчик!
          </Typography>
          <Divider variant="middle"/>
          <Typography variant="body1" align="center">
            Данный ресурс − это моё личное пространство для размещения своих идей, задумок, проектов.
          </Typography>
          <Divider variant="middle"/>
          <Typography variant="body1" align="center">
            В качестве языков программирования в основном использую Python и JavaScript.
          </Typography>
          <Divider variant="middle"/>
          <Typography variant="body1" align="center">
            Технологий используемых при разработке много поэтому смысла их описывать тут нет. Но если всё же интересно,
            например, на этом сайте <nobr>back-end</nobr> написан на NodeJS, клиентская часть ReactJS, база данных MongoDB. 
          </Typography>
          <Divider variant="middle"/>
          <Typography classes={{root: 'last_paragraph'}} variant="body1" align="center" >
            Если у Вас вдруг появились <nobr>вопросы/предложения</nobr> к работе ресурса, или просто Вы хотите связться со мной,
            воспользуйтесь разделом <Link to="/contacts">контакты</Link>
          </Typography>
        </Box>
        
      </div>
      {/* INFO */}
      <div className="wraper__main body__info">

      </div>
    </div>
  )
}