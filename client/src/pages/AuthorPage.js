import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../hook/http.hook';
import {Tab, Row, Col, Nav, Image, Card, ListGroup} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import {textFormater} from '../utils/textFormater';
 
export const AuthorPage = () => {
  const [state, setState] = useState(null);
  const { request } = useHttp();
  const authorId = useParams().id;
  
  const get = useCallback( async () => {
    try {
      let keysComp = 10000; // для уникальных ключей
      const author = (await request(`/api/blogs/get-author/${authorId}`)).message;
      const contacts = [];
      const other = author.contact.other;
      for (const contact in other) {
        let socialIcon;
        switch(contact) {
          case 'telegram':
            socialIcon = <i className="fab fa-telegram"></i>;
            break;
          case 'vk':
            socialIcon = <i className="fab fa-vk"></i>;
            break;
          case 'github':
            socialIcon = <i className="fab fa-github"></i>;
              break;
          default:
            break;
        };
        const result = <a href={ other[contact] } className={ `author__social ${contact}` } target="_blank" rel="noopener noreferrer">
          {socialIcon}
          <div className="social__text">{contact}</div>
        </a>
        contacts.push( <ListGroup.Item key={keysComp--}> {result} </ListGroup.Item> );
      };
      const email = <a href={ `mailto:${author.contact.email}` } className={ `author__social email` } target="_blank" rel="noopener noreferrer" >
        <i className="fas fa-at"></i>
        <div className="social__text">email</div>
      </a>;
      contacts.push(<ListGroup.Item key={keysComp--}> {email} </ListGroup.Item> );
      const Component = (
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col>
            
              <Nav variant="pills" className="flex-column">
                <Row className="justify-content-center">
                  <Image src={author.avatar} roundedCircle fluid /> 
                </Row>  
                <Nav.Item>
                  <Nav.Link eventKey="first">О пользователе</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Контакты</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  { textFormater({type: 'blog', data: author.about}).map( (item, i) => item.type.tagName === 'P' ? <p key={i + 1}>{item.data}</p> : undefined) }
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  {/* Contacts */}
                  <Card style={{ width: '100%' }}>
                    <ListGroup variant="flush" key={"scsds"}>
                      { contacts }
                    </ListGroup>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      );
      return setState(Component)
    } catch (error) {
      console.log(error)
    }
  }, [request, authorId] )

  useEffect(() => {
    get()
    
  }, [get])
  return (
    <div className="container__author">
      {/* HEADER */}
      <div className="wraper__author header">
        <p className="header__text">Автор</p>
      </div>
      {/* BODY */}
      <div className="wraper__author body">
        {state || ""}
      </div>
      {/* INFO */}
      <div className="wraper__contacts body__info">

      </div>
    </div>
  )
}