import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Grid} from '@material-ui/core';

export const ChoiceNewEdit = props => {
  const authorName = props.author.authorName;
  const authorId = props.author.authorId;

  return (
    <Grid container justify="space-evenly" style={{marginTop: "40px"}}>
      <Link to={`/blog/createblog/edit/${authorName}/${authorId}`} >
        <Button variant="contained" color="primary" size="large">
          Редактировать существующие блоги
        </Button>
      </Link>
      
      <Link to={`/blog/createblog/new/${authorName}/${authorId}`} >
        <Button variant="contained" color="primary" size="large">
          Создать новый блог
        </Button>
      </Link>
    </Grid>
  )
};