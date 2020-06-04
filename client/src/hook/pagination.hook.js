/* 
*  Хук предназначен для работы с библиотекой Material-UI
*  компонентом Pagintion https://material-ui.com/ru/api/pagination/
*/
import { useReducer, useCallback } from 'react';

const initialPagintion = {
  count: 1,
  page: 1,
  totalRecords: 0
};

function reducer( state, action ) {
  switch (action.type) {
    case 'setCount':
      return {...state, count: action.allCounts, totalRecords: action.allRecords };

    case 'setPage':
      return {...state, page: action.data};

    default:
      break;
  };
  return undefined
};

export const usePagination = () => {
  const [ pagination , dispatch ] = useReducer( reducer, initialPagintion );

  const setCount = useCallback( (counts, records) => {
    dispatch( {type: 'setCount', allCounts: counts, allRecords: records});
  }, []);

  const setPage = useCallback( page => {
    dispatch( {type: 'setPage', data: page});
  }, []);

  return {
    count: pagination.count,
    page: pagination.page,
    totalRecords: pagination.totalRecords,
    setCount,
    setPage,
  }
};