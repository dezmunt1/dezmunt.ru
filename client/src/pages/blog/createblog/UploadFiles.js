import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Input } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

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
    opacity: 0,
    position: 'absolute',
    left: 0
  },
  marginTB: {
    margin: '16px 0'
  },
});

const UploadFiles = props => {
  const [ loaded, setLoaded ] = useState('');
  const {register, errors, setValue} = useFormContext();
  const classes = useStyles();

  useEffect(() => {
    register({name: props.formField}, { required: props.required || false})
  }, [register, props.formField, props.required])

  return (
    <>
      <Grid item xs={true} md={true} className={classes.marginTB}>
        <div style={{position: "relative"}}>
          <label htmlFor={`${props.formField}_file`}>
            <Button variant="contained" color={errors[ props.formField ] ? 'secondary' : 'primary'} component="span">
              {loaded || props.formField}
            </Button>
          </label>
          <Typography className={`${props.formField}_loaded`} align='left' component='span' variant='caption'></Typography>
          <Input
            inputRef={register}
            required={ props.required || false }
            name={props.formField}
            className={classes.hidden}
            error={ !!errors[ props.formField ] }
            accept="image/png"
            id={`${props.formField}_file`}
            type="file"
            onChange={ ({target}) => {
              const file = target.files[0];
              if ( !file ) return;
              document.querySelector(`.${props.formField}_loaded`).innerHTML = file.name;
              setValue( props.formField, file, true );
              setLoaded(`${props.formField}: OK!`)
            }}
          />
        </div>
      </Grid>
      <Grid className={ classes.noPadding } item xs={12} md={12} >
        {errors[ props.formField ] && <Typography align='center' component='div' variant='caption' color='error'>{errors[ props.formField ].message}</Typography>}
      </Grid>
    </>
  )
};

UploadFiles.propTypes = {
  formField: PropTypes.string
}
export default UploadFiles;