import React, {useCallback, useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { Grid, List, ListItem, ListItemText, Divider, Button, Typography, TextField, Fab, useMediaQuery } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { usePagination } from '../../../hook/pagination.hook';
import { useHttp } from '../../../hook/http.hook';
import { useForm, FormContext } from 'react-hook-form';

import ConfirmAction from '../../../components/ConfirmAction';
import { AppContext } from '../../../context/AppContext';
import UploadFiles from './UploadFiles';
import { Notice } from './Notice';
import { TextArea } from './TextArea';


const useStyles = makeStyles({
  root: {
    color: 'white',
  },
  page_header: {
    color: 'pink',
    textTransform: "uppercase" 
  },
  noPadding: {
    padding: '0 !important'
  },
  marginTB: {
    margin: '16px 0'
  },
  paddingTB: {
    padding: '16px 0'
  },
  marginLR: {
    margin: '0 16px'
  },
  paddingLR: {
    padding: '0 16px'
  },
  marginB: {
    marginBottom: '16px'
  },
  hidden: {
    display: 'none'
  },
  blogList: {
    backgroundColor: "rgba(189, 195, 199, .3)"
  }
})

export const EditBlogForm = props => {
  const [content, setContent] = useState(null);
  const [blogSelected, setBlogSelected] = useState(false);
  const {authorname , authorid} = useParams();
  const { toastMessage }  = useContext(AppContext);
  const { count, page, totalRecords, setCount, setPage } = usePagination();
  const { request } = useHttp();
  const {...methods} = useForm();
  const classes = useStyles();
  const minWidth480 = useMediaQuery('(min-width:480px)');

  const getArticles = useCallback( async () => {
    try {
      const {blogs} = (await request(`/api/blogs/get-author/${authorid}&${page}`)).message;
      const result = blogs.data.map( (blog, i) => {

        function handleClick() {
          setBlogSelected(this);
        };

        return (
          <ListItem button key={i + 1} onClick={ handleClick.bind(blog) }>
            <ListItemText primary={blog.blogPost.preview.header} />
          </ListItem>
        )
      });

      const allCounts = Math.ceil( blogs.lengthCollection / 5 );
      const allRecords = blogs.lengthCollection;

      setCount( allCounts, allRecords );
      setContent(result);
      return undefined;

    } catch (error) {
      console.error(error)
    }
  }, [authorid, page, request, setCount]);

  const handlePagination = ( event, value ) => {
    setPage( value );
  };

  const handleDeleteBlog = async () => { 
    const deleteBlog = await request( `/api/blogs/delete/${blogSelected._id}&${authorid}`, 'DELETE');
    toastMessage({
      show: true,
      headerText: "Удаление блога",
      bodyText: deleteBlog.message
    });
    setBlogSelected(false);
  };

  const validFormHandle = useCallback( async event => {
    try {
      if (!authorname || !authorid){
        throw new Error(`Поля "authorname" или "authorid" пустые!`);
      }
      const form = new FormData(); 
      // Added data from form
      for (let i in event) {
        if ( !event[i] ) {
          form.append(i, 'withoutChanges');
          continue;
        };
        if ( event[i].toString() === '[object File]' ) {
          form.append( i, event[i], i);
          continue;
        }
        form.append( i, event[i] );
      };

      // Added data from parent component
      form.append('authorName', authorname);
      form.append('authorId', authorid);
      form.append('blogId', blogSelected._id)
      
      const editRequest = await fetch( '/api/blogs/edit', {method: 'POST', body: form});
      const toastText = await editRequest.json();
      toastMessage({
        show: true,
        headerText: "Редактирование блога",
        bodyText: toastText.message
      });
      setBlogSelected(false)
      return undefined;
    } catch (error) {
      console.log(error)
    }
  }, [authorid, authorname, blogSelected._id, toastMessage]);


  useEffect( () => {
    getArticles();
  }, [getArticles, blogSelected]);

  if ( localStorage.getItem('validAuthor') !== authorid ) {
    return (
      <Grid container className="conatainer_createblog overscreen">
        <Typography style={{width: '100%'}} align='center' variant='h3' color='error'>Пройдите сначала аутентификацию</Typography>
      </Grid>
    )
  };



  return(
    <Grid container direction='column' className="conatainer_createblog overscreen">
      <Typography className={classes.page_header} align='center' component='div' variant={minWidth480 ? 'h3' : 'h5'}>Список Ваших блогов</Typography>
      <Grid item container className={classes.blogList}>
        <List component="nav" aria-label="secondary mailbox folders">
          {content}
        </List>
      </Grid>
      <Pagination className={classes.marginTB} count={count} page={page} onChange={handlePagination} />
      <Grid item className={classes.paddingLR}>
        <Typography component='div' variant='subtitle1'>Всего записей: {totalRecords}</Typography>
        <Typography component='div' variant='subtitle1'>Автор: {authorname}</Typography>
        <Typography component='div' variant='subtitle1'>ID автора: {authorid}</Typography>
        <Typography component='div' variant='subtitle1'>ID выбранного блога: {blogSelected?.link}</Typography>
      </Grid>
      
      <Divider className={classes.marginTB} />

      { blogSelected &&
        <Grid item container direction='column' alignItems='center'>
          {/* Delete Blog */}
          <ConfirmAction
            justify='center'
            actionHandler={handleDeleteBlog}
            bodyText={`Вы удаляете блог "${blogSelected.blogPost.preview.header}". Данное действие будет не обратимо, вы согласны?`}>
            <Button variant="contained" color="secondary" size="large" className={classes.marginB}>
              <span className={classes.paddingLR}>🗑</span>Удалить выбранный блог
            </Button>
          </ConfirmAction>
          {/* Edit Blog */}
          <FormContext {...methods}>
            <EditForm
              methods={methods}
              previewHeader={blogSelected.blogPost.preview.header}
              previewText={blogSelected.blogPost.preview.text}
              blogText={blogSelected.blogPost.full.text}
              formHandle={validFormHandle}
            />
          </FormContext>

        </Grid>
      } 
    
    </Grid>
  )
};

const EditForm = props => {
  const classes = useStyles();

  const methods = props.methods;
  const setValue = methods.setValue;

  const blogPreviewHeader = props.previewHeader;
  const blogPreviewText = props.previewText;
  const blogText = props.blogText;
  const validFormHandle = props.formHandle;

  const setDefaultInputValue = useCallback( async () => {
    setValue([
      {'blogHeader': blogPreviewHeader},
      {'previewText': blogPreviewText},
      {'textArea': blogText}
    ]);
  }, [setValue, blogText, blogPreviewHeader, blogPreviewText])
  
  useEffect(() => {
    setDefaultInputValue();
  }, [blogText, setDefaultInputValue])

  return (
    <form onSubmit={methods.handleSubmit(validFormHandle)} encType='multipart/form-data'>
      <Grid container item direction='column' alignItems='center' xs={12} md={12}>
        {/* header input */}
        <Grid item container direction='column' alignItems='center'>
          <Grid container item xs={true} md={true}>
            <TextField
              fullWidth
              required
              inputRef={methods.register}
              error={ !!methods.errors.blogHeader || false }
              id="standard-error-helper-text"
              label="Заголовок"
              helperText={ 'Введите заголовок блога' }
              // defaultValue={blogPreviewHeader}
              name="blogHeader"
              autoComplete="off"
            />
          </Grid>
          <Grid className={ classes.noPadding } item xs={12} md={12} >
            {methods.errors.blogHeader && <Typography align='center' component='div' variant='caption' color='error'>{methods.errors.blogHeader.message}</Typography>}
          </Grid>
          {/* preview image input */}
          <UploadFiles formField='previewImage' required={false}/>
          {/* Notice about formating */}
          <Grid container item xs={12} md={12}>
            <Notice extra="Вы в режиме редактирования блога. Изображения необходимо прикрепить " />
          </Grid>
          {/* Text Area */}
          <Grid item container xs={12} md={12} justify='center'>
            <TextArea filesRequired={false}/>
          </Grid>
          
        </Grid>
        <Grid item xs='auto' md='auto' className={classes.marginTB}>
          <Fab color="secondary" aria-label="edit" type='submit'>
            S
          </Fab>
        </Grid>
      </Grid>
    </form>
  )
}


