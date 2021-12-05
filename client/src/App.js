import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';
import React from "react";
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import ReserveTable from './components/pages/ReserveTable';
import EditReservations from './components/pages/EditReservations';
import ProfileManagement from './components/pages/ProfileManagement';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/signin" element={<SignIn />}/>
          <Route path="/reservetable" element={<ReserveTable />}/>
          <Route path="/profilemanagement" element={<ProfileManagement />}/>
          <Route path="/editreservations" element={<EditReservations />}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;