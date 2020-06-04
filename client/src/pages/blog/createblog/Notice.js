import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';

function createData(syntax, description) {
  return { syntax, description };
};

const rows = [
  createData('**p<string>p**', 'Обворачивает текст в тэг P'),
  createData('=*b<string>b*=', 'Выделяет текст жирным'),
  createData('=*i<string>i*=', 'Выделяет текст курсивом'),
  createData('=*u<string>u*=', 'Нижнее подчеркивание текста'),
  createData('**Image<ordinal>**',
    'Устанавливает точку монитрования изображения из БД. Формат изображений только PNG')
];

export const Notice = props => {

  return (
    <TableContainer component={Paper} >
      <Table aria-label="simple table" size="small" >
        <TableHead>
          <TableRow>
            <TableCell align='center' colSpan={2} >Памятка корректного заполнения блога</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Синтаксис</TableCell>
            <TableCell align="left">Пояснение</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.syntax}>
              <TableCell component="th" scope="row">
                {row.syntax}
              </TableCell>
              <TableCell align="left" >{row.description}</TableCell >
            </TableRow>
          ))}
          {
            props.extra && 
            <TableRow>
              <TableCell align='center' colSpan={2} >{props.extra}</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}