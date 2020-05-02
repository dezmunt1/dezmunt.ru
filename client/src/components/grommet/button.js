import React from "react";

import { Box, Button, Grommet } from "grommet";

export const BasicButtons = props => {
  const myTheme = {
    global: {
      focus: {
        border: {
          color: "#1DB6F2",
        },
        boxShadow: "none"
      }
    },
    button: {
      extend: {
        fontFamily: "'Montserrat', sans-serif"
      },
      border: {
        color: "#1DB6F2"
      }
    },
  };

  const propsTheme = props.customThem ? props.customThem : {};

  return (
    <Grommet theme={{...myTheme, ...propsTheme}}>
      <Box align="center" pad="xsmall">
        <Button label="Default" onClick={() => {}} {...props} />
      </Box>
      {/*
      <Box align="center" pad="medium">
        <Button label="Anchor" href="#" />
      </Box>
      <Box align="center" pad="medium">
        <Button disabled label="Disabled" onClick={() => {}} {...props} />
      </Box>
      <Box align="center" pad="medium">
        <Button primary label="Primary" onClick={() => {}} {...props} /> 
      </Box>
      */}
    </Grommet>
  )
  
};