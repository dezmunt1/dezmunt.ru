import { createContext } from 'react';

function noop() {};

export const AppContext = createContext({
  toastMessage: noop,
  authorData: undefined
});