import React  from "react";
import {Link} from 'react-router-dom';

import { Grommet, Box, Menu, Text } from "grommet";
import { FormDown } from "grommet-icons";

export const Humburger = props => {

  const links = document.querySelectorAll('.navigation-list--item');
  const navigationList = Array.from(links).map( (value, index) => {
    const anchor = value.querySelector('a');
    const item = {
      label:
        <Box align="end">
          <div className="navigation-list--item">
            <Link to={ anchor.pathname } title={ anchor.title }>
              <i className={ anchor.querySelector('i').className }></i>
                <p>{ value.innerText.trim() }</p>
            </Link>
          </div>
        </Box>,
      onClick: () => {}
    }
    return item
  });

  return (
    <Grommet style={{width: "100%"}} theme={ {} }>
      <Box alignSelf="end" pad={{right: "15px"}} justify="end">
        <Menu
          justifyContent="stretch"
          alignSelf="stretch"
          dropBackground={ props.dropBackground || "#fff" }
          dropAlign={ props.dropAlign || {"top":"bottom"} }
          
          plain
          open={ false }
          items={navigationList}
        >
          <Box direction="row" gap="small" pad="xsmall" justify="end">
            <FormDown />
            <Text color="#fff" size="large" ><i className="fas fa-bars"></i></Text>
          </Box>
        </Menu>
      </Box>
    </Grommet>
  )
};