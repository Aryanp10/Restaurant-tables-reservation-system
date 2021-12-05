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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function SignUp() {
  const [ResultMessage, setmessage] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  
  const setSuccess = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Sign up successful!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have successfully signed up! You are being redirected to the login page in three seconds.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  const setFailure = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Email Address Taken"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Email Address has been taken. Please enter a different one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
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
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let credentials = new FormData(event.target);
    // eslint-disable-next-line no-console
    if (/^\S+@\S+\.\S+$/.test(credentials.get('email'))) {
      Axios.post("http://localhost:3001/register", {
      firstName: credentials.get('firstName'),
      lastName: credentials.get('lastName'),
      email: credentials.get('email'),
      phone: credentials.get('phone'),
      password: credentials.get('password'),
      }).then((response) => {
        if (response.data[0].emailexists === 1){
          setOpen(true);
          setFailure();
        }
        else{
          setOpen(true);
          setSuccess();
          setTimeout(function() {
            window.location='/signin'
          }, 3000);
        }
      })
    }
    else {
      setOpen(true);
      setFailureEmail();
    }
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
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
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
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone"
                  name="phone"
                  autoComplete="phone-number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
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