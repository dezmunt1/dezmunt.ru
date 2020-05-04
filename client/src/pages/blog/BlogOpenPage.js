import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../../hook/http.hook';
import { textFormater } from '../../utils/textFormater';
import { useParams} from 'react-router-dom';
import { Feedback } from '../../components/Feedback';

export const BlogOpenPage = () => {
  const [state, setState] = useState(null);
  const { request } = useHttp();
  const blogId = useParams().id;
  
  const get = useCallback( async () => {
    try {
      const blog = (await request(`/api/blogs/${blogId}`)).message;
      
      const text = textFormater({ type: 'blog', data: blog.blogPost.full.text });
      const textBlock = text.map( (val, i) => {
        if (val.type.tagName === 'P') return val.data;
        if (val.type.tagName === 'IMG') {
          const linkToImage = val.data.length === 0 ? "" : `url('/img/blogs/${blog._id}/${val.data}.png')`;
          return <div key={i+1} className="text__body_image" style={{backgroundImage: linkToImage}}>
            <img src={`/img/blogs/${blog._id}/${val.data}.png`} alt={val.data} />
          </div>;
        };
        return undefined
      });

      const Component = (
        <div className="blog__item">
          {/* Image */}
          <div className="blog__preview_image" style={{ backgroundImage: `url(${blog.blogPost.full.images.main})` }}>
            
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
            <div className="text__header">{blog.blogPost.full.header}</div>
            <div className="text__body">
              { textBlock }
            </div>
          </div>
          {/* feedback */}
          <Feedback rate={blog.rate} link={blog.link} blogId={blog._id} />
        </div>
      );
      return setState(Component)
    } catch (error) {}
  }, [request, blogId] )

  useEffect(() => {
    get()
    request(`/api/blogs/new-views/${blogId}`);
    const comments = document.querySelector('.body__info').children.length;
    if( comments === 0 ) addComents();
  }, [get, request, blogId]);

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