import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = ({currentTarget: target}) => {
    if ( target.ariaCurrent === "true") {
      props.actionHandler()
    }
    
    setOpen(false);
  };
  return (
    <Grid container justify={props.justify}>
      <Grid onClick={handleClickOpen}>
        {props.children}
      </Grid>
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Подтвердите действие"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.bodyText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button aria-current="false" onClick={handleClose} color="primary">
            Отменить
          </Button>
          <Button aria-current="true" onClick={handleClose} color="primary">
            Подтверждаю
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
