import React, { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHttp } from '../../hook/http.hook';
import { textFormater } from '../../utils/textFormater';
import { Feedback } from '../../components/Feedback';
import {Dialog} from '@material-ui/core';

function ModalWindow( props ) {
  const [ open, setOpen ] = useState(false);

  const Component = props.content;

  const handleOpen = ( {target} ) => {
    setOpen( true );
  }

  const handleClose = ( {target} ) => {
    setOpen( false );
  }

  const noop = () => {};

  return (
    <React.Fragment>
      <Component handle={handleOpen} />
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={ open } maxWidth="lg">
        <Component handle={noop} />
      </Dialog>
    </React.Fragment>
  )
}


export const BlogOpenPage = () => {
  const [ state, setState ] = useState(null);
  const { request } = useHttp();
  const blogId = useParams().id;
  
  const get = useCallback( async () => {
    try {
      if ( state ) {
        return undefined;
      }
      const blog = (await request(`/api/blogs/${blogId}`)).message;
      const text = textFormater({ type: 'blog', data: blog.blogPost.full.text });
      const textBlock = text.map( (val, i) => {
        if (val.type.tagName === 'P') return <p key={i + 1}>{val.data}</p>;
        if (val.type.tagName === 'IMG') {
          const linkToImage = val.data.length === 0 ? "" : `url('${blog.blogPost.full.images[val.data]}')`;
          const Content = props => {
            return (
              <div key={i+1} className="text__body_image" style={{backgroundImage: linkToImage}} onClick={props.handle}>
                <img width="100%" src={ blog.blogPost.full.images[val.data] } alt={val.data} />
              </div>
            )
          };
            
          
          return (
            <ModalWindow content={Content} key={i + 1}/>
          )
        };
        return undefined
      });

      const Component = (
        <div className="blog__item">
          {/* Image */}
          <div className="blog__preview_image" style={{ backgroundImage: `url(${blog.blogPost.full.images.previewImage})` }}>
            
              {/* Statistic */}
            <div className="blog__preview_stat">
              <div className="stat__views">
                <i className="far fa-eye"></i>
                {blog.views}
              </div>
              <div className="stat__author">
                <i className="fas fa-user"></i>
                <Link to={`/authors/${blog.author.link}`}>{blog.author.name}</Link>
              </div>
              <div className="stat__date">
                {new Date(blog.created).toDateString().slice(4)}
              </div>
            </div>

          </div>
          {/* text */}
          <div className="blog__preview_text">
            <div className="text__header">{blog.blogPost.preview.header}</div>
            <div className="text__body">
              { textBlock }
            </div>
          </div>
          {/* feedback */}
          <Feedback rate={blog.rate} link={window.location.href} blogId={blog._id} />
        </div>
      );
      if ( !state ) setState(Component);
      return undefined;
    } catch (error) {}
  }, [request, blogId, state] )

  useEffect(() => {
    get();
    const comments = document.querySelector('.body__info').children.length;
    if( comments === 0 ) {
      addComents();
      request(`/api/blogs/new-views/${blogId}`);
    };
  }, [request, blogId, get]);
  
  return (
    <div className="container__blog">
      {/* HEADER */}
      <div className="wraper__blog header">
        <p className="header__text">Блог</p>
      </div>
      {/* BODY */}
      <div className="wraper__blog body">
        {state || ""}
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