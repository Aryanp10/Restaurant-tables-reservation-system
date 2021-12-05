import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Axios from 'axios';
import {useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function ReserveTable() {
  
  //opens and closes dialog box
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [ResultMessage, setmessage] = React.useState(null);

  const [disabled, setdisabled] = React.useState(true);
  const disable = () => {
    setdeletedisabled(true);
  };
  const enable = () => {
    setdisabled(false);
    setdeletedisabled(false);
  };
  const [deletedisabled, setdeletedisabled] = React.useState(true);

  const [Id, setId] = React.useState("");
  const handleId = (event) => {
    disable();
    setId(event.target.value);
  };
  const [Date, setDate] = React.useState("");
  const handleDate = (event) => {
    setDate(event.target.value);
  };
  const [Time, setTime] = React.useState("");
  const handleTime = (event) => {
    setTime(event.target.value);
  };
  const [FirstName, setFirstName] = React.useState("");
  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const [LastName, setLastName] = React.useState("");
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };
  const [Email, setEmail] = React.useState("");
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const [PhoneNumber, setPhoneNumber] = React.useState("");
  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  const setDeleteSuccess = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Reservation Cancellation Success"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have successfully canceled your reservation. The page will refresh.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  const setEditSuccess = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Reservation Change Success!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have successfully updated your reservation. Please search it again to check the changes made.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  const setFailureEmail = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Invalid Email"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please enter a valid email address.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
      </DialogActions>
    </div>)
  }

  const setNoReservation = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Reservation Does Not Exist!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please enter a valid Reservation Id.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  //handles logout button display
  const LogOut = () => {
    // eslint-disable-next-line no-console
    Axios.post("http://localhost:3001/logout", {
    })
    .catch(function(error){
      console.log(error);
    });
  };

  const IdRef = useRef(null);
  //run once, get userid if it exists
  useEffect(() => {
    Axios.post("http://localhost:3001/getid")
    .then((response) => {
      IdRef.current = response.data.UserId
      console.log(response)
      IdRef.current === undefined ? handleLogin() : handleLogout()
      console.log("UserId ", IdRef);
    })
    .catch(function(error){
      console.log(error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let updatepossible = false;
  const handleClick = () => {
    // eslint-disable-next-line no-console
    Axios.post("http://localhost:3001/searchtable", {
      Id: Id
    })
    .then((response) => {
      response.data.map ((values) => (
        updatepossible = true,
        values.FirstName === null ? null:setFirstName(values.FirstName),
        values.LastName === null ? null:setLastName(values.LastName),
        values.EmailAddress === null ? null:setEmail(values.Email),
        values.PhoneNumber === null ? null:setPhoneNumber(values.PhoneNumber),
        values.Date === null ? null:setDate(values.ReservationDate.substring(0,10)),
        values.Time=== null ? null:setTime(values.StartTime)
      ))
      if (updatepossible){
        enable ();
      }
      else {
        disable();
        setOpen(true);
        setNoReservation();
      }
    })
    .catch(function(error){
      console.log(error);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(true);
    let reservation = new FormData(event.target);
    if (/^\S+@\S+\.\S+$/.test(reservation.get('email'))){
      Axios.post("http://localhost:3001/updatetable", {
        reservationid: reservation.get('Id'),
        firstname: reservation.get('firstName'),
        lastname: reservation.get('lastName'),
        phonenumber: reservation.get('phonenumber'),
        email: reservation.get('email')
      }).then((response) => {
        setEditSuccess();
      })
      .catch(function(error){
        console.log(error);
      })
    }
    else {
      setOpen(true);
      setFailureEmail();
    }
  }

  const handleDelete = (event) => {
    event.preventDefault();
    setOpen(true);
    Axios.post("http://localhost:3001/deletetable", {
      reservationid: Id
    }).then((response) => {
      setDeleteSuccess();
      setTimeout(function() {
        window.location='/editreservations'
      }, 500);
    })
    .catch(function(error){
      console.log(error);
    });
  }

  const [Profile, setProfile] = React.useState(null);
  const [Log, setLog] = React.useState(null);
  const handleLogin = (event) => {
    setLog(
    <Button
      href = '/signin'
      sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
    >
      Login
    </Button>);
  };
  const handleLogout = (event) => {
    setLog(
    <Button
      sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
      href="/signin" 
      onClick = {LogOut}
    >
      Logout
    </Button>);
    setProfile(
    <Button
      href = '/profilemanagement'
      sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
    >
      Profile
    </Button>);
  };

  return (
      <Container component="main" maxWidth="md">
        <AppBar position="static">
            <Toolbar disableGutters variant="dense">
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ ml: 4, mr: 2, display: { xs: 'none', md: 'flex', flexGrow: 0.1 }}}
              >
                Reserve
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {Profile}
                  <Button
                    href = '/reservetable'
                    sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
                  >
                    Reserve Table
                  </Button>
                  <Button
                    href = '/editreservations'
                    sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
                  >
                    Edit Table Reservation
                  </Button>
                  {Log}
              </Box>
            </Toolbar>
        </AppBar>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Edit Table Reservation
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                  <TextField
                    name="Id"
                    required
                    fullWidth
                    label="Reservation ID"
                    value = {Id}
                    onChange = {handleId}
                  />
              </Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {handleClick}
              >
                Search with ID
              </Button>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value = {FirstName}
                  onChange = {handleFirstName}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value = {LastName}
                  onChange = {handleLastName}
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phonenumber"
                  type = "text"
                  InputProps={{ inputProps: { minLength:10, maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' } }}
                  label="Phone Number"
                  name="phonenumber"
                  value = {PhoneNumber}
                  onChange = {handlePhoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type = "email"
                  name="email"
                  value = {Email}
                  onChange = {handleEmail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    id="time"
                    label="Time"
                    name="time"
                    value = {Time}
                    onChange = {handleTime}
                    disabled
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    id="date"
                    label="Date"
                    name="date"
                    value = {Date}
                    onChange = {handleDate}
                    disabled
                  />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled = {disabled}
            >
              Update Reservation Information
            </Button>
          </Box>
        </Box>
        <Box component="form" onSubmit={handleDelete} sx={{ mt: 0 }}>
          <Button
              fullWidth
              type = "submit"
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
              disabled = {deletedisabled}
            >
              Cancel Reservation
          </Button>
        </Box>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        {ResultMessage}
        </Dialog>
        </Box>
      </Container>
  );
}