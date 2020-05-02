import React, { useCallback, useContext, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { AppContext } from '../context/AppContext';
import { useHttp } from '../hook/http.hook';

export const Feedback = props =>  {
  const [rate, setRate] = useState({
    like: props.rate.like,
    dislike: props.rate.dislike
  })
  const { toastMessage } = useContext( AppContext );
  const { request } = useHttp();

  const clipboardHandler = useCallback( async event => {
    if (!navigator) return null;
    try {
      await navigator.clipboard.writeText( props.link );
      toastMessage({
        show: true,
        headerText: "Уведомление",
        bodyText: "Ссылка на статью успешно скопирована в буфер обмена"
      });
    } catch (error) {
      
    }
  }, [toastMessage, props.link]);

  const rateHandler = useCallback( async event => {
    const rateType = event.currentTarget.className.split('__')[1];
    try {
      const data = await request( `/api/blogs/rate/${props.blogId}`, 'POST', {type: rateType});
      setRate({...rate, [rateType]: data.message[rateType]})
    } catch (error) {
      
    }
    

  }, [props.blogId, request, rate])

  return (
    <div className="blog__feedback">
      <div className="feedback__rate">
        <div className="rate__like" onClick={rateHandler}>
        <IconButton>
          <i className="far fa-thumbs-up"></i>
          <span className="rate__number">{rate.like}</span>
        </IconButton>
        </div>
        <div className="rate__dislike" onClick={rateHandler}>
          <IconButton>
            <i className="far fa-thumbs-down"></i>
            <span className="rate__number">{rate.dislike}</span>
          </IconButton>
        </div>
      </div>
      <div className="feedback__clipboard">
        <IconButton className="ffffff" onClick={clipboardHandler}>
          <i className="fas fa-link"></i>
        </IconButton>
      </div>
    </div>
  )
};