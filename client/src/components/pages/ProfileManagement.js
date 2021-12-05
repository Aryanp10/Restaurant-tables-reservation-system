import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Axios from 'axios';
import { useEffect } from "react";
import { useRef } from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function ProfileManagement() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [ResultMessage, setmessage] = React.useState(null);

  const setUpdateSuccess = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Profile Update Success"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have successfully updated your profile. The page will refresh.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  const setUpdateFailure = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Email Address is taken!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          The email address is taken. Please enter a different one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  const [RewardsPoints, setRewardsPoints] = React.useState(0);
  const handleRewardsPoints = (event) => {
    setRewardsPoints(event.target.value);
  };
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    setBillingAddress(MailingAddress);
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
  const [Password, setPassword] = React.useState("");
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const [PhoneNumber, setPhoneNumber] = React.useState("");
  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };
  const [CardNumber, setCardNumber] = React.useState("");
  const handleCardNumber = (event) => {
    setCardNumber(event.target.value);
  };
  const [BillingAddress, setBillingAddress] = React.useState("");
  const handleBillingAddress = (event) => {
    setBillingAddress(event.target.value);
  };
  const [MailingAddress, setMailingAddress] = React.useState("");
  const handleMailingAddress = (event) => {
    checked === true && setBillingAddress (event.target.value)
    setMailingAddress(event.target.value);
  };
  const [PaymentMethod, setPaymentMethod] = React.useState("");
  const handlePaymentMethod = (event) => {
    setPaymentMethod(event.target.value);
  };

  //handles logout button display
  const LogOut = () => {
    // eslint-disable-next-line no-console
    Axios.post("http://localhost:3001/logout", {
    })
    .catch(function(error){
      console.log(error);
    });
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    let credentials = new FormData(event.target);
    if (/^\S+@\S+\.\S+$/.test(credentials.get('email'))){
      // eslint-disable-next-line no-console
      Axios.post("http://localhost:3001/profile_management", {
        firstName: credentials.get('firstName'),
        lastName: credentials.get('lastName'),
        phone_no: credentials.get('phone_no'),
        email: credentials.get('email'),
        password: credentials.get('password'),
        card_no: credentials.get('card_no'),
        mailing_add: credentials.get('mailing_add'),
        billing_add: credentials.get('billing_add'),
        payment_method: credentials.get('payment_method'),
        originalemail: email.current
      }).then((response) => {
        if (response.data[0].emailexists === 0 || email.current === credentials.get('email')){
          setOpen(true);
          setUpdateSuccess();
          setTimeout(function() {
            window.location='/profilemanagement'
          }, 500);
        }
        else {
          setOpen(true);
          setUpdateFailure();
        }
      })
    }
    else {
      setOpen(true);
      setFailureEmail();
    }
  };

  const IdRef = useRef(null);
  //run once, get userid if it exists
  useEffect(() => {
    Axios.post("http://localhost:3001/getid")
    .then((response) => {
      IdRef.current = response.data.UserId
      console.log("UserId ", IdRef.current);
    })
    .catch(function(error){
      console.log(error);
    });
  }, []);

  const email = useRef(null);
  useEffect(() => {
    Axios.post("http://localhost:3001/userinfo")
    .then((response) => {
      response.data.map ((values) => (
        values.FirstName === null ? null:setFirstName(values.FirstName),
        values.LastName === null ? null:setLastName(values.LastName),
        values.EmailAddress === null ? null:setEmail(values.EmailAddress),
        values.Password === null ? null:setPassword(values.Password),
        values.PhoneNumber === null ? null:setPhoneNumber(values.PhoneNumber),
        values.CreditCardNo === null ? null:setCardNumber(values.CreditCardNo),
        values.BillingAddress === null ? null:setBillingAddress(values.BillingAddress),
        values.MailingAddress === null ? null:setMailingAddress(values.MailingAddress),
        values.PaymentMethod === null ? null:setPaymentMethod(values.PaymentMethod),
        setRewardsPoints(values.EarnedPoints),
        email.current = values.EmailAddress
      )) 
    })
    .catch(function(error){
      console.log(error);
    });
  }, []);

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
                  <Button
                    href = '/profilemanagement'
                    sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
                  >
                    Profile
                  </Button>
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
                  <Button
                    sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0.05}}
                    href="/signin" 
                    onClick = {LogOut}
                  >
                    Logout
                  </Button>
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
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
      </Avatar>
      <Typography component="h1" variant="h5">
        Profile Management
      </Typography>
      <Typography component="h1" variant="h6" mt={2}>
        Preferred Diner ID: {IdRef.current}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          </Grid>
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
              id="email"
              label="Email Address"
              type = "email"
              name="email"
              value = {Email}
              onChange = {handleEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value = {Password}
              onChange = {handlePassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="phone_no"
              label="Phone Number"
              id="phone_no"
              type = "text"
              InputProps={{ inputProps: { minLength:10, maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' } }}
              value = {PhoneNumber}
              onChange = {handlePhoneNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="card_no"
              label="Credit Card Number"
              type = "text"
              InputProps={{ inputProps: { minLength:16, maxLength: 16, inputMode: 'numeric', pattern: '[0-9]*' } }}
              id="card_no"
              value = {CardNumber}
              onChange = {handleCardNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="payment_method"
              name="payment_method"
              select
              label="Preferred Payment Method"
              value={PaymentMethod}
              onChange={handlePaymentMethod}
              helperText="Please select your preferred payment method"
            >
              <MenuItem value={'Cash'}>
                Cash
              </MenuItem>
              <MenuItem value={'Credit'}>
                Credit
              </MenuItem>
              <MenuItem value={'Check'}>
                Check
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="mailing_add"
              label="Mailing Address"
              type="text"
              id="mailing_add"
              value = {MailingAddress}
              onChange = {handleMailingAddress}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="billing_add"
              label="Billing Address"
              type="text"
              id="billing_add"
              value = {BillingAddress}
              onChange = {handleBillingAddress}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="Rewards Points"
              label="Rewards Points"
              type="text"
              value = {RewardsPoints}
              onChange = {handleRewardsPoints}
              disabled
            />
          </Grid>
          <FormGroup>
            <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange}/>} label="My billing information is the same as my mailing." />
          </FormGroup>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update Profile
        </Button>
      </Box>
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
