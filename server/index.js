const express = require("express");
const session = require('express-session');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');               //Importing the NPM bcrypt package.
const saltRounds = 10;                          //We are setting salt rounds, higher is safer.

var ssn;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({secret:"XASDASDA"}));

const db = mysql.createPool({
    host: 'restaurant-table-reservation.cnszyl0trzz7.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'Team6',
    password: 'Team6Team6',
    database: 'restaurant_table_reservation',
  });

app.post("/register", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    try{
        db.query('SELECT EXISTS (SELECT EmailAddress FROM User WHERE EmailAddress = ?) as emailexists', [email], function(err, results) {
            if (err) throw err
            res.send(results);
            if (results[0].emailexists === 0){
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    const sqlInsert = "INSERT INTO User (FirstName, LastName, EmailAddress, Password, EarnedPoints) VALUES (?,?,?,?, 0);"
                    db.query(sqlInsert, [firstName, lastName, email, hash], (err, result) => {
                        if(err) {
                            console.log(err);
                        }
                    })
                });
            }
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/deletetable", (req, res) => {
    const reservationid = req.body.reservationid;
    try{
        db.query('DELETE FROM Reservations WHERE ReservationId = ?', [reservationid], function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/getreservationid", (req, res) => {
    try{
        db.query('SELECT ReservationId FROM Reservations ORDER BY ReservationId DESC LIMIT 1', function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/reservetable", (req, res) => {
    const time = req.body.time;
    const date = req.body.date.split('/');
    const month = date[0];
    const day = date[1];
    const year = date[2];
    const fixeddate = year + '-' + month + '-' + day;
    try{
        db.query('SELECT Table1, Table2, Table3, Table4 FROM Reservations WHERE ReservationDate = ? AND StartTime = ?', [fixeddate, time], function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/confirmtable", (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phonenumber = req.body.phonenumber;
    const email = req.body.email;
    const time = req.body.time;
    const date = req.body.date.split('/');
    const month = date[0];
    const day = date[1];
    const year = date[2];
    const fixeddate = year + '-' + month + '-' + day;
    const numofguests = req.body.numofguests;
    const table1 = req.body.table1;
    const table2 = req.body.table2;
    const table3 = req.body.table3;
    const table4 = req.body.table4;
    const UserId = req.body.UserId;
    try{
        db.query('INSERT INTO Reservations (FirstName, LastName, PhoneNumber, Email, StartTime, ReservationDate, SeatsRequired, Table1, Table2, Table3, Table4, UserId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', 
        [firstname, lastname, phonenumber, email, time, fixeddate, numofguests, table1, table2, table3, table4, UserId],
        function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/checkcreditcard", (req, res) => {
    try{
        db.query(`SELECT EXISTS (SELECT CreditCardNo FROM User WHERE UserId = ${ssn.UserId} AND (CreditCardNo IS NULL OR CreditCardNo = '')) as CreditCardEmpty;`, function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/updatetable", (req, res) => {
    const reservationid = req.body.reservationid;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phonenumber = req.body.phonenumber;
    const email = req.body.email;
    try{
        db.query('UPDATE Reservations SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ? WHERE ReservationId = ?', [firstname, lastname, email, phonenumber, reservationid], function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/searchtable", (req, res) => {
    const reservationId = req.body.Id;
    try{
        db.query('SELECT FirstName, LastName, PhoneNumber, Email, StartTime, ReservationDate FROM Reservations WHERE ReservationId = ?;', [reservationId], function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const checkUser = "SELECT * FROM User WHERE EmailAddress = ?;"

    db.query(checkUser, [email], (err, result) => {
        if(err) {
            res.send({err: err});
        }
        if (result.length > 0) {
            ssn = req.session;
            ssn.Password = password;
            bcrypt.compare(password, result[0].Password, function(error, response) {
                if (response == true) {
                    console.log(result)
                    ssn.UserId = result[0].UserId;
                }
                res.send(ssn);
            });
        }
    })
})

app.post("/getid", (req, res) => {
    try{
        res.send(ssn)
    } catch(err){
        console.log(err.message);
    }
})

app.post('/logout' , (req, res) => {
    req.session.destroy(function(err){
        if(err) {
            console.log(err);
        }
        else{
            ssn = req.session;
        }
    })
})

app.post('/userinfo', (req, res) => {
    try{
        db.query(`SELECT FirstName, LastName, EmailAddress, Password, PhoneNumber, MailingAddress,
        BillingAddress, CreditCardNo, PaymentMethod, EarnedPoints FROM User WHERE UserId = ${ssn.UserId}`, function(err, results) {
            if (err) throw err
            console.log(ssn.Password);
            console.log(results)
            results[0].Password = ssn.Password;
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post('/addrewardpoints', (req, res) => {
    try{
        console.log(`UPDATE User SET EarnedPoints = EarnedPoints + 5 WHERE UserId = ${ssn.UserId}`);
        db.query(`UPDATE User SET EarnedPoints = EarnedPoints + 5 WHERE UserId = ${ssn.UserId}`, function(err, results) {
            if (err) throw err
            res.send(results);
          });
    } catch(err){
        console.log(err.message);
    }
})

app.post("/profile_management", (req, res) => {
    //First Name, last name, phone number, email, password, card no., billing address
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone_no = req.body.phone_no;
    const email = req.body.email;
    const password = req.body.password;
    const card_no = req.body.card_no;
    const mailing_add = req.body.mailing_add;
    const billing_add = req.body.billing_add;
    const payment_method = req.body.payment_method;
    const originalemail = req.body.originalemail;
    //put in diner number variable in the command variable
    // const command = "UPDATE User SET firstName = ? , lastName = ? , phoneNumber = ? , email = ?, password = ?, card_no = ? , StreetAddress = ? WHERE UserId = 1"
    const command = `UPDATE User SET FirstName = ?, LastName = ?, EmailAddress = ?, Password = ?, 
    PhoneNumber = ?, MailingAddress = ?, BillingAddress = ?, CreditCardNo = ?, PaymentMethod = ?  WHERE UserId = ${ssn.UserId}`

    try{
        db.query('SELECT EXISTS (SELECT EmailAddress FROM User WHERE EmailAddress = ?) as emailexists', [email], function(err, results) {
            if (err) throw err
            res.send(results);
            if (results[0].emailexists === 0 || email === originalemail){
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    db.query(command, [firstName, lastName, email, hash, phone_no, mailing_add, billing_add, card_no, payment_method], function(err, results) {
                        if (err) throw err
                    })
                })
            }
          });
    } catch(err){
        console.log(err.message);
    }
})

app.listen(3001, () => {
    console.log('Running on port 3001');
})
