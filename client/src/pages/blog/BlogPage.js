import React, { useEffect, useCallback, useState, useReducer } from 'react';
import {Link} from 'react-router-dom';
import { useHttp } from '../../hook/http.hook';
import { textFormater } from '../../utils/textFormater';
import Button from 'react-bootstrap/Button';
import { Pagination } from '@material-ui/lab';

const initialPagintion = {
  count: 1,
  page: 1,
  totalRecors: 0
};

function reducer( state, action ) {
  switch (action.type) {
    case 'setCount':
      return {...state, count: action.allCounts, totalRecors: action.allRecords };

    case 'setPage':
      return {...state, page: action.data};

    default:
      break;
  };
  return undefined
}

export const BlogPage = () => {
  const [state, setState] = useState(null);
  const [ pagination , dispatch ] = useReducer( reducer, initialPagintion );

  const { request } = useHttp();

  const get = useCallback(async () => {
    try {
      const blogsData = (await request(`/api/blogs/page/${pagination.page}`)).message;
      const allRecords = blogsData.lengthCollection;
      const allCounts = Math.ceil( allRecords / 10 );
      dispatch({ type: "setCount", allCounts, allRecords});
      const blogList = blogsData.data.map( (blog, i) => {
        const text = textFormater({ type: 'blog', data: blog.blogPost.preview.text });
        const textBlock = text.map( (val, i) => {
          if (val.type.tagName === 'P') return val.data;
          if (val.type.tagName === 'IMG') {
            const linkToImage = val.data.length === 0 ? "" : `url('${blog.blogPost.full.images[val.data]}')`; // ../img/blogs/${blog._id}/${val.data}.png
            return <div key={i+1} className="text__body-image" style={{backgroundImage: linkToImage}}></div>;
          };
          return undefined;
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
            {/* nextButton */}
            <div className="blog__preview_btn">
              
              <Link to={`/blog/article/${blog._id}`}style= {{width: "80%"}}>
                <Button  variant="secondary" size="lg">
                  ДАЛЕЕ
                </Button>
              </Link>
      
            </div>
            
          </div>
        );

      });
      
      setState(blogList);
    
    } catch (error) {
      console.log(error)
    }

  }, [request, pagination.page])

  useEffect(() => {
    get();
  }, [get])

  const handlePagination = ( event, value ) => {
    dispatch( { type: "setPage", data: value });
    document.querySelector('body').scrollIntoView({block: "start", behavior: "smooth"});
  };
  
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
        <Pagination count={pagination.count} page={pagination.page} onChange={handlePagination}/>
      </div>
    </div>
  )
}