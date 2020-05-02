import React, { useCallback, useState, useEffect } from 'react';
import { Collapse, Spinner } from 'react-bootstrap';
import { textFormater } from '../../utils/textFormater';

export const ProjectsCollapse = props => {
  const [cardInfo, setCardInfo] = useState(<Spinner animation="border" />);
  const title = props.title;
  const incomingData = props.data;
  
  const getProject = useCallback( async () => {
    try {
      let localData = JSON.parse ( localStorage.getItem(title) );

      const data = localData ? localData : incomingData ;
      if( !localData ) localStorage.setItem( title, JSON.stringify(data));
      
      const text = textFormater( { data, type: 'projects' } );
      const projCa = <>
        <p className="body__projects__collapse-title">
          {text.title}
        </p>
        Применяемые технологии:
        <p>
          {text.technology}
        </p>
        <hr />
        Цель разработки:
        <p>
          {text.target}
        </p>
        <hr />
        Возможности на данный момент:
        <p>
          {text.capabality}
        </p>
        <hr />
        Необходимо поправить:
        <p>
          {text.fix}
        </p>
        <hr />
        Что предстоит добавить:
        <p>
          {text.next}
        </p>
      </>
      setCardInfo( projCa );
    } catch (error) {
      
    }
  }, [title, incomingData]);

  useEffect( () => {
    getProject();
  }, [getProject]);

  return (
    <>
      <Collapse in={props.open}>
        <div id="example-collapse-text">
          {cardInfo}
        </div>
      </Collapse>
    </>   // Добить логику отображения карты проекта, отработать форму данных с сервера
  )
};