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
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function SignIn() {
  let UserId = null;
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [ResultMessage, setmessage] = React.useState(null);

  const setLoginFailure = () => {
    setOpen(true);
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Login Failure"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Incorrect Username/Password. Please enter an existing one.
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

    Axios.post("http://localhost:3001/login", {
      email: credentials.get('email'),
      password: credentials.get('password'),
    }).then((response) => {
      UserId = response.data.UserId;
      console.log("UserId ", UserId);
      UserId === undefined ? setLoginFailure():navigate('/reservetable')
    })
    .catch(function(error){
      console.log(error);
    });
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              type = "email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              id="login"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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