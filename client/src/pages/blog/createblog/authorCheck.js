import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, Fab, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../../hook/http.hook'

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
  }
})

export const useAuthorCheck = props => {
  const [validAuthor, setValidAuthor] = useState(null);

  const {register, handleSubmit, errors, setError, clearError} = useForm();
  const { request } = useHttp();

  const classes = useStyles();
  
  const validAuthorHandle = useCallback( async event => {
    try {
      const body = {author: event.authorInput, secret: event.secretInput};
      const author = await request(`/api/blogs/get-author/`, 'POST', body );
      clearError( ['authorInput', 'secretInput'] );
      const {name: authorName, _id: authorId} = author.message;
      
      setValidAuthor( {authorName, authorId} );
      return null;
      
    } catch (error) {
      const [code, message] = error.message.split('__');
      
      switch (code) {
        case '401':

          return setError('secretInput', 'notMatch', `${message}`);
        case '404':
          return setError('authorInput', 'notMatch', `${message}`);
        default:
          break;
      };
    }
  }, [setError, clearError, request]);

  const Component = useCallback( props => {
    
    return (
      <Grid container item>
        <Grid item xs={12} md={12}>
          <Grid item justify="center" container>
            
            <Box width='50vw'>
              <form onSubmit={handleSubmit(validAuthorHandle)} >

                <Grid container spacing={3}>
                  <Grid item xs={true} md={true}>
                    <TextField
                      fullWidth
                      required
                      inputRef={register}
                      error={ !!errors.authorInput || false }
                      id="standard-error-helper-text"
                      label="Автор"
                      helperText={ 'Введите автора' }
                      name="authorInput"
                      // onChange={ (target) => setValueAuthor(target.currentTarget.value)}
                      // value={valueAuthor}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid className={ classes.noPadding } item xs={12} md={12} >
                    {errors.authorInput && <Typography align='center' component='div' variant='caption' color='error'>{errors.authorInput.message}</Typography>}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={true} md={true}>
                    <TextField
                      fullWidth
                      required
                      inputRef={register}
                      error={ !!errors.secretInput || false}
                      id="standard-error-helper-text"
                      label="Секрет"
                      helperText={ 'Ваша секретная комбинация' }
                      name="secretInput"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs='auto' md='auto'>
                    <Fab color="secondary" aria-label="edit" type='submit'>
                      S
                    </Fab>
                  </Grid>
                  <Grid className={ classes.noPadding } item xs={12} md={12} >
                    {errors.secretInput && <Typography align='center' component='div' variant='caption' color='error'>{errors.secretInput.message}</Typography>}
                  </Grid>
                </Grid>
                
              </form>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  }, [register, handleSubmit, errors, classes, validAuthorHandle]);

  

  return { Component, validAuthor };
};
