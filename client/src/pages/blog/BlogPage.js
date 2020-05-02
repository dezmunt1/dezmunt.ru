import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../../hook/http.hook';
import { textFormater } from '../../utils/textFormater';
import {Button} from 'react-bootstrap'

export const BlogPage = () => {
  const [state, setState] = useState(null);

  const { request } = useHttp();

  const get = useCallback(async () => {
    try {
      const data = await request('/api/blogs/');
      const blogList = data.message.map( (blog, i) => {
        const text = textFormater({ type: 'blog', data: blog.blogPost.preview.text });
        const textBlock = text.map( (val, i) => {
          if (val.type.tagName === 'P') return val.data;
          if (val.type.tagName === 'IMG') {
            const linkToImage = val.data.length === 0 ? "" : `url('../img/blogs/${blog._id}/${val.data}.png')`;
            return <div key={i+1} className="text__body-image" style={{backgroundImage: linkToImage}}></div>;
          };
          return undefined
        })
        
        return (
          <div className="blog__item" key={i + 1}>
            {/* Image */}
            <div className="blog__preview_image" style={{ backgroundImage: `url(${blog.blogPost.preview.image})` }}>
              
                {/* Statistic */}
              <div className="blog__preview_stat">
                <div className="stat__views">
                  <i className="far fa-eye"></i>
                  {blog.views}
                </div>
                <div className="stat__author">
                  <i className="fas fa-user"></i>
                  <a href={`/authors/${blog.author.link}`}>{blog.author.name}</a>
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
            {/* nextButton */}
            <div className="blog__preview_btn">
              <Button  variant="secondary" size="lg" href={`/blog/article/${blog._id}`}>
                ДАЛЕЕ
              </Button> 
            </div>
            
          </div>
        );

      });
      
      setState(blogList);
      

    } catch (error) {
      console.log(error)
    }

  }, [request])

  useEffect(() => {
    get()
  }, [get])

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