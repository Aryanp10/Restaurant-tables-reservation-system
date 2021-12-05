import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Axios from 'axios';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
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
  const [disabled, setdisabled] = React.useState(true);
  const disable = () => {
    setdisabled(true);
  };
  const enable = () => {
    setdisabled(false);
  };

  const navigate = useNavigate();
  const signin = () => {
    navigate('/signin')
  }
  //opens and closes dialog box
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
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
  
  //Get tables available
  let tablestaken = []
  let tables = [1,2,3,4]
  let tableseats = []
  let tablesremaining = []
  //table combinations
  let onetable = []
  let twotable = []
  let threetable = []
  let fourtable = []
  //check tablecombination arrays against tables remaining
  let availabletable = []
  let tablesboolean = []
  let completereservationinfo = []
  let foundtable = false;
  
  const holidayweekend = useRef(false);

  const getRemainingTables = (firstName, lastName, phonenumber, email, time, date, seatsrequired) => {
    //get tables that remain
    tablesremaining = [1,2,3,4]
    tables.map ((table, index) => (
      tablestaken.map((tabletaken) => (
        table === tabletaken ? tablesremaining.splice(tablesremaining.indexOf(table), 1) : null
      ))
    ))
    //create list with tableid and seats of remaining tables
    tableseats = []
    tablesremaining.map((tableid) =>(
      // eslint-disable-next-line
      tableid === 1 ? tableseats.push({table_id: tableid, numofseats: 2}) : null,
      tableid === 2 ? tableseats.push({table_id: tableid, numofseats: 4}) : null,
      tableid === 3 ? tableseats.push({table_id: tableid, numofseats: 6}) : null,
      tableid === 4 ? tableseats.push({table_id: tableid, numofseats: 8}) : null
    ))
    getAvailableTables(firstName, lastName, phonenumber, email, time, date, seatsrequired);
  }

  const getAvailableTables = (firstName, lastName, phonenumber, email, time, date, seatsrequired) => {
    //create table combinations
    onetable = []
    twotable = []
    threetable = []
    fourtable = []
    tableseats.map((table1, index1) =>(
      // eslint-disable-next-line
      onetable.push({table1: table1.table_id, numofseats: table1.numofseats}), //creates combinations of one table
      //if four tables are available create a fourtable combination array once
      (index1 === 0 && tableseats.length === 4) ? fourtable.push({table1: 1, table2: 2, table3: 3, table4: 4, numofseats: 20}) : null, 
      tableseats.map((table2, index2) =>(
        //make sure index1 >= index2, so you don't repeat combinations
        index1 >= index2 ? null : (twotable.push({table1: table1.table_id, table2: table2.table_id, numofseats: table1.numofseats + table2.numofseats}),
        tableseats.map((table3, index3) =>(
          //make sure index2 >= index3, so you don't repeat combinations
          index2 >= index3 ? null : threetable.push({table1: table1.table_id, table2: table2.table_id, table3: table3.table_id, numofseats: table1.numofseats + table2.numofseats + table3.numofseats})
        )))
      ))
    ))
    console.log("One table combination: ", onetable)
    console.log("Two table combination: ", twotable)
    console.log("Three table combination: ", threetable)
    console.log("Four table combination: ", fourtable)

    //check if table combinations seatsrequired <= numofseats with .map, push table ids
    availabletable = []
    foundtable = onetable.some(function(table) {
      return seatsrequired <= table.numofseats ? availabletable.push (table.table1) : console.log("Continue to 2");
    })

    foundtable === false ? foundtable = twotable.some(function(table){
                              return seatsrequired <= table.numofseats ? availabletable.push (table.table1, table.table2) : null
                            }) : console.log("Continue to 3");
                            
    foundtable === false ? foundtable = threetable.some(function(table){
      return seatsrequired <= table.numofseats ? availabletable.push (table.table1, table.table2, table.table3) : null
    }) : console.log("Continue to 4");

    foundtable === false ? foundtable = fourtable.some(function(table){
      return seatsrequired <= table.numofseats ? availabletable.push (table.table1, table.table2, table.table3, table.table4) : null
    }) : console.log("Done searching.");

    console.log("Available table: ", availabletable);
    
    //place true inside tablesboolean if tableid in available === tables array of all ids [1,2,3,4]
    tablesboolean = [false, false, false, false]
    tables.map ((table, index1) => (
      availabletable.some ((available) => (
        table === available ? tablesboolean[index1] = true : null
      ))
    )); 

    console.log("Boolean values: ", tablesboolean)
    
    //create completereservationinfo that contains all input fields including tables to be reserved
    completereservationinfo = [firstName, lastName, phonenumber, email, time, date, seatsrequired]
    tablesboolean.map ((table) => (
      completereservationinfo.push (table)
    ))
    //completereservationinfo is what you should send to the query
  }

  //Handles Check available tables button on form
  const handleSubmit = (event) => {
    event.preventDefault();
    let reservation = new FormData(event.target);
    if (/^\S+@\S+\.\S+$/.test(reservation.get('email'))){
      // eslint-disable-next-line no-console
      let isWeekend = false;
      let isHolidayFixed = false;
      let isHolidayRangedMon = false;
      let isHolidayRangedThurs = false;
      let weekends = [0, 5, 6]
      let holidays = ['01/01', '06/19', '07/04', '11/11', '12/25']
      isWeekend = weekends.some((weekend) => (
        weekend === date.getDay()
      ));
      isHolidayFixed = holidays.some((holiday) => (
        reservation.get('date').includes(holiday)
      ));
      let holidaysrange = [['01/15', '01/21'], ['02/15', '02/21'], ['05/25', '05/31'], ['09/01', '09/07'], ['10/08', '10/14']]
      isHolidayRangedMon = holidaysrange.some((holidayrange) => (
        (reservation.get('date').substring(0,5) >= holidayrange[0]) 
        && (reservation.get('date').substring(0,5) <= holidayrange[1]) && (date.getDay() === 1) 
      ));
      let thanksgiving = ['11/22', '11/28']
      isHolidayRangedThurs = (reservation.get('date').substring(0,5) >= thanksgiving[0]) && 
        (reservation.get('date').substring(0,5) <= thanksgiving[1]) && (date.getDay() === 4);

      holidayweekend.current = (isWeekend || isHolidayFixed || isHolidayRangedMon || isHolidayRangedThurs);

      ((holidayweekend.current === true) && (IdRef.current === undefined)) && setHolidayNotSignedin ();
      
      ((holidayweekend.current === true) && (IdRef.current != undefined)) &&
      Axios.post("http://localhost:3001/checkcreditcard", {
      }).then((response) => {
        response.data.map ((result) => (
          result.CreditCardEmpty === 1 ? setHolidayCreditCard () : checkReservations (reservation)
        ))
      })
      .catch(function(error){
        console.log(error);
      });
      (holidayweekend.current === false) && checkReservations(reservation);
    }
    else {
      setOpen(true);
      setFailureEmail();
    }
  };

  const checkReservations = ((reservation) => (
    Axios.post("http://localhost:3001/reservetable", {
      time: reservation.get('time'),
      date: reservation.get('date')
    }).then((response) => {
      //get ids of tablestaken from database
      tablestaken = []
      console.log(response.data)
      response.data.map((table) => (
        // eslint-disable-next-line
          table.Table1 === 1 ? tablestaken.push(1) : null,
          table.Table2 === 1 ? tablestaken.push(2) : null,
          table.Table3 === 1 ? tablestaken.push(3) : null,
          table.Table4 === 1 ? tablestaken.push(4) : null
      ))
      getRemainingTables(reservation.get('firstName'), reservation.get('lastName'), reservation.get('phonenumber'), 
      reservation.get('email'), reservation.get('time'), reservation.get('date'), reservation.get('seatsrequired'));
      handleReservationConfirm(); //set state of resevationconfirm to be sent to database
      handleReservationUpdate();
      if ((completereservationinfo[7] === false && completereservationinfo[8] === false && completereservationinfo[9] === false 
        && completereservationinfo[10] === false))
      {
        disable();
        setNoAvailableTables();
      }
      else{
        enable();
      }
    })
    .catch(function(error){
      console.log(error);
    })
  ));

  //Handles Confirm Reservation
  const handleClick = () => {
    setOpen(true);
    // eslint-disable-next-line no-console
    // display error message if no tables are available
    holidayweekend.current ? setConfirmationHoliday () :
    (IdRef.current === undefined ? setSignIn() : setConfirmation())
  };

  const finalizereservation = () => {
    disable();
    availabletable = []
    handleReservationUpdate();
    Axios.post("http://localhost:3001/confirmtable", {
      firstname: ReservationConfirm[0],
      lastname: ReservationConfirm[1],
      phonenumber: ReservationConfirm[2],
      email: ReservationConfirm[3],
      time: ReservationConfirm[4],
      date: ReservationConfirm[5],
      numofguests: ReservationConfirm[6],
      table1: ReservationConfirm[7],
      table2: ReservationConfirm[8],
      table3: ReservationConfirm[9],
      table4: ReservationConfirm[10],
      UserId: IdRef.current
    }).then((response) => {
      getReservationId();
    })
    .catch(function(error){
      console.log(error);
    });
  };

  //variable states and their functions
  let current = new Date();
  let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + (current.getDate() + 1);

  const [date, setDate] = React.useState(new Date(cDate));
  const [time, setTime] = React.useState('10:00:00');
  const [ReservationTables, setReservationTables] = React.useState(null);
  const [ReservationConfirm, setReservationConfirm] = React.useState(null);
  const [ResultMessage, setmessage] = React.useState(null);

  const handleReservationUpdate = () => {
    let tableinput = [];
    let seats = 0
    availabletable.map((table, index)=>(
      // eslint-disable-next-line
      table === 1 ? seats = 2 : null,
      table === 2 ? seats = 4 : null,
      table === 3 ? seats = 6 : null,
      table === 4 ? seats = 8 : null,
      tableinput.push(<TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="center">Table {table}</TableCell>
                        <TableCell align="center">{seats}</TableCell>
                      </TableRow>)
    ))
    setReservationTables(tableinput);
 }

  const handleReservationConfirm = () => {
    setReservationConfirm(completereservationinfo)
  }

  const setConfirmationHoliday = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Confirm Holiday/Weekend Reservation"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you wish to confirm your table reservation?
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          There will be a hold fee of $5 applied to your account.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          No show will result in your card being charged $10 as well.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={finalizereservation}>Yes</Button>
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
        <Button onClick={handleClose}>No</Button>
      </DialogActions>
    </div>)
  }
  //success message (confirm, signin, or finalize)
  const setConfirmation = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Confirm Reservation"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you wish to confirm your table reservation?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={finalizereservation}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </DialogActions>
    </div>)
  }
  const setSignIn = () => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Sign in before reservation?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you wish to sign in before reserving a table?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={signin}>Yes</Button>
        <Button onClick={finalizereservation}>No, finalize reservation</Button>
      </DialogActions>
    </div>)
  }
  const setNoAvailableTables = () => {
    setOpen(true);
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"No Tables Available."}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There are no tables available for your selection. Please enter a new time/date
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>)
  }
  const setFinalized = (id) => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Table Reservation Success!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have sucessfully reserved table(s)! Your reservation ID is: {id}
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          Make sure to hold onto this to make any changes.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>
    )
  }
  const setFinalizedLoggedIn = (id) => {
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Table Reservation Success!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have sucessfully reserved table(s)! Your reservation ID is: {id}.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          Make sure to hold onto this to make any changes.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          You've earned 5 rewards points for booking! Go to profile management to check it out!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>
    )
  }

  const getReservationId = () => {
    Axios.post("http://localhost:3001/getreservationid", {
    }).then((response) => {
      response.data.map ((id) => (
        IdRef.current === undefined ?     
        setFinalized(id.ReservationId) : Axios.post("http://localhost:3001/addrewardpoints", {
        }).then((response) => {
          setFinalizedLoggedIn(id.ReservationId)
        })
        .catch(function(error){
          console.log(error)
        })
      ))
    })
    .catch(function(error){
      console.log(error);
    });
  }

  const setHolidayNotSignedin = () => {
    setOpen(true);
    disable();
    availabletable = [];
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Please sign in"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have to sign in to reserve on a holiday/weekend!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>
    )
  }

  const setHolidayCreditCard = () => {
    setOpen(true);
    disable();
    availabletable = [];
    setmessage(
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Please update your credit card information"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You need a valid credit card in the system in order to reserve on a holiday/weekend.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </div>
    )
  }

  const handleChange = (event) => {
    setTime(event.target.value);
  };

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
            Reserve Table
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
                  id="phonenumber"
                  label="Phone Number"
                  type = "text"
                  InputProps={{ inputProps: { minLength:10, maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' } }}
                  name="phonenumber"
                  autoComplete="phonenumber"
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
              <Grid item xs={12} sm={6}>
                <Select
                  required
                  id="time"
                  value={time}
                  fullWidth
                  onChange={handleChange}
                  name = "time"
                >
                  <MenuItem value={'10:00:00'}>10:00 A.M.</MenuItem>
                  <MenuItem value={'11:00:00'}>11:00 A.M.</MenuItem>
                  <MenuItem value={'12:00:00'}>12:00 P.M.</MenuItem>
                  <MenuItem value={'13:00:00'}>1:00 P.M.</MenuItem>
                  <MenuItem value={'14:00:00'}>2:00 P.M.</MenuItem>
                  <MenuItem value={'15:00:00'}>3:00 P.M.</MenuItem>
                  <MenuItem value={'16:00:00'}>4:00 P.M.</MenuItem>
                  <MenuItem value={'17:00:00'}>5:00 P.M.</MenuItem>
                  <MenuItem value={'18:00:00'}>6:00 P.M.</MenuItem>
                  <MenuItem value={'19:00:00'}>7:00 P.M.</MenuItem>
                  <MenuItem value={'20:00:00'}>8:00 P.M.</MenuItem>
                  <MenuItem value={'21:00:00'}>9:00 P.M.</MenuItem>
                  <MenuItem value={'22:00:00'}>10:00 P.M.</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    required
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    minDate={new Date(cDate)}
                    renderInput={(params) => <TextField name = "date" {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 20 } }}
                  name="seatsrequired"
                  label="Number of Guests"
                  id="seatsrequired"
                  autoComplete="seatsrequired"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Check Available Tables
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Available Tables
          </Typography>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Table Available</TableCell>
                <TableCell align="center">Number of Seats</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {ReservationTables}
            </TableBody>
          </Table>
          <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
              disabled = {disabled}
            >
            Confirm Reservation
          </Button>
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