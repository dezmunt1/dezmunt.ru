import React from 'react';
import { ChoiceNewEdit } from './blog/createblog/ChoiceNewEdit'
import { useAuthorCheck } from './blog/createblog/authorCheck';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  page_header: {
    color: 'lightslategray',
    textTransform: "uppercase" 
  },
});

export const CreateBlog = props => {
  const { Component: AuthorCheck, validAuthor } = useAuthorCheck();

  const classes = useStyles();

  if ( validAuthor ) {
    localStorage.setItem( 'validAuthor', validAuthor.authorId )
  };

  return  (
    
    <div className="conatainer_createblog overscreen">
      <Grid container direction="column" alignItems="center">
        <Grid item xs={12} md={12} >
          <Typography className={ classes.page_header } variant='h3' align='center'>
            Создадим запись БЛОГа
          </Typography>
        </Grid>
        
        { validAuthor ? <ChoiceNewEdit author={validAuthor} /> : <AuthorCheck />}
      </Grid>
      
    </div>
  )
}
