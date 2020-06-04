import React, {useCallback, useState} from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextareaAutosize, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormatBold, FormatItalic, FormatUnderlined } from '@material-ui/icons';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import UploadFiles from './UploadFiles';

const useStyles = makeStyles({
  marginTB: {
    margin: '16px 0'
  },
  marginB: {
    marginBottom: '16px'
  }
});

export const TextArea = props => {
  const [ inputs, setInputs ] = useState(null);
  const [ selectMode, setSelectMode ] = useState(""); 
  const { control, errors, setValue } = useFormContext();
  const classes = useStyles();

  const selectTextHandler = useCallback( async ( {target} ) => {
    const subString = target.value.substring( target.selectionStart, target.selectionEnd );
    if (subString.length === 0 || !Boolean(selectMode) ) return undefined;
    const startString = target.value.slice(0, target.selectionStart);
    const endString = target.value.slice(target.selectionEnd);

    setValue( 'textArea', (startString + extraMarkup( selectMode, subString ) + endString)) ;
  }, [selectMode, setValue])

  const handleTextArea = useCallback( async ({target}) => {
    const value = target.value;
    const matchedArr = value.match(/\*\*(I|i)mage\d+\*\*/g);
    if ( matchedArr ) {
      const inputsArr = matchedArr.map( (value, index) => {
        const fieldName = value.slice(2, -2);
        return <UploadFiles required={props.filesRequired} formField={fieldName} key={index+1} />
      });
      return setInputs( inputsArr )
    }
    return null;
  }, [props.filesRequired]);

  const handleExtra = useCallback( async (event, newAlig) => {
    setSelectMode(newAlig);
  }, [] )

  return (
    <>
      {/* Preview Text */}
      <Typography className={classes.marginTB} align='center' component='div' variant='h4'>Превью блога</Typography>

      <Controller
        as={ <TextareaAutosize required rowsMin={5} rowsMax={5} style={{width: "100%"}} className={classes.marginB}/> } 
        control={ control }
        name='previewText'
        rules={{required: true}}
      />
      {errors.previewText && <Typography align='center' component='div' variant='caption' color='error'>{errors.previewText.message}</Typography>}
      {/* Main Text */}
      
      {/* Main Text Area */}
      <Typography align='center' component='div' variant='h4' >Основной текст</Typography>
      <Grid container direction="column">
        <div>
          <ToggleButtonGroup size="small" value={ selectMode } aria-label="text formatting" exclusive onChange={ handleExtra }>
            <ToggleButton value="bold" aria-label="bold">
              <FormatBold />
            </ToggleButton>
            <ToggleButton value="italic" aria-label="italic">
              <FormatItalic />
            </ToggleButton>
            <ToggleButton value="underlined" aria-label="underlined">
              <FormatUnderlined />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Controller
          as={ <TextareaAutosize required rowsMin={10} rowsMax={20} style={{width: "100%"}} onSelect={ selectTextHandler } onInput={handleTextArea}/> } 
          control={ control }
          name='textArea'
          rules={{required: true}}
        />
        {errors.TextArea && <Typography align='center' component='div' variant='caption' color='error'>{errors.TextArea.message}</Typography>}
      </Grid>
      {inputs}
      
    </>
  )
};

function extraMarkup ( type, text ) {
  switch (type) {
    case 'italic':
      return `=*i${text}i*=`;
    case 'bold':
      return `=*b${text}b*=`;
    case 'underlined':
      return `=*u${text}u*=`;
    default:
      break;
  };
  return null
}