import React, { useEffect, useState } from 'react';
import { Humburger } from "./grommet/humburger";

export const NavBarMobile = props => {
  const [, setState] = useState("");

  const loading = document.querySelectorAll('.navigation-list--item').length === 0 ? true: false;
  
  useEffect( () => {
    setState('x'); // Чтоб обновить DOM
  }, [])

  if ( loading ) return (<> </>);

  

  return (
      <Humburger
        dropAlign={ {left:"right", top: "bottom"} }
        dropBackground={ "#293b5a" }
      />
  );
};