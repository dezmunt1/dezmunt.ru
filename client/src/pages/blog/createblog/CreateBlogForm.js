import React, { useCallback, useState } from 'react';
import { Grid, Typography, TextField, Fab } from '@material-ui/core';
import { useForm, FormContext } from 'react-hook-form';
import { makeStyles } from '@material-ui/styles';
import { useParams } from 'react-router-dom';


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
  hidden: {
    display: 'none'
  }
})

export const CreateBlogForm = props => {

  const [formSended, setFormSended] = useState(null)
  const { ...methods } = useForm();
  const classes = useStyles();
  const {authorname , authorid} = useParams();

  const validFormHandle = useCallback( async event => {
    try {
      const form = new FormData();
      // Added data from form
      for (let i in event) {
        if ( !event[i] ) return methods.setError( i, 'notMatch', 'Пустое поле');
        if ( event[i].toString() === '[object File]' ) {
          form.append( i, event[i], i);
          continue;
        }
        form.append( i, event[i] );
      };

      // Added data from parent component
      form.append('authorName', authorname);
      form.append('authorId', authorid);

      const response = await fetch( '/api/blogs/create', {method: 'POST', body: form});
      if (response.ok) setFormSended(<Grid item><h1>Форма отправлена</h1></Grid>); 
      return undefined;
    } catch (error) {
      console.log(error)
      
    }
  }, [methods, authorid, authorname]);

  if ( localStorage.getItem('validAuthor') !== authorid ) {
    return (
      <Grid container className="conatainer_createblog overscreen">
        <Typography style={{width: '100%'}} align='center' variant='h3' color='error'>Пройдите сначала аутентификацию</Typography>
      </Grid>
    )
  };

  return (
    <div className="conatainer_createblog overscreen">
      <Grid container direction="column" alignItems="center">
        <Grid item xs={12} md={12} >
          <Typography className={ classes.page_header } variant='h3' align='center'>
            Создадим запись БЛОГа
          </Typography>
        </Grid>
        
        {
          formSended ? formSended :
          <Grid item container direction='column' alignItems='center' xs={12} md={9}>

            <Grid item>
              <h1>Заполняй</h1>
            </Grid>

            <Grid item >
              <FormContext {...methods}>
                <form onSubmit={methods.handleSubmit(validFormHandle)} encType='multipart/form-data'>
                  <Grid container direction='column' alignItems='center'>
                    {/* header input */}
                    <Grid item container direction='column' alignItems='center' spacing={3}>
                      <Grid container item xs={true} md={true}>
                        <TextField
                          fullWidth
                          required
                          inputRef={methods.register}
                          error={ !!methods.errors.blogHeader || false }
                          id="standard-error-helper-text"
                          label="Заголовок"
                          helperText={ 'Введите заголовок блога' }
                          name="blogHeader"
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid className={ classes.noPadding } item xs={12} md={12} >
                        {methods.errors.blogHeader && <Typography align='center' component='div' variant='caption' color='error'>{methods.errors.blogHeader.message}</Typography>}
                      </Grid>
                      {/* preview image input */}
                      <UploadFiles formField='previewImage' required />
                      {/* Notice about formating */}
                      <Grid container item xs={12} md={12}>
                        <Notice />
                      </Grid>
                      {/* Text Area */}
                      <Grid item container xs={12} md={12} justify='center'>
                        <TextArea filesRequired />
                      </Grid>
                      
                    </Grid>
                    <Grid item xs='auto' md='auto'>
                      <Fab color="secondary" aria-label="edit" type='submit'>
                        S
                      </Fab>
                    </Grid>
                  </Grid>
                </form>
              </FormContext>
            </Grid>
            
          </Grid>
        }
      </Grid>
      
    </div>
  )
};


// ✅ Введите заголовок блога 
// ✅ Закрепить превью изображение блога
// ✅ Памятка стилизации текста и правила прикрепления изображений
// ✅ Ввести основной текст
// ✅ Парсит текст на изображения, создает инпуты по количеству из текста