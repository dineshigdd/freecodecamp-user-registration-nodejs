'use strict';
const routes = require('./routes.js');
const auth = require('./auth.js');

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','pug');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());      
  

mongo.connect(process.env.DATABASE, { useUnifiedTopology: true },(err, db) => {
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    db = db.db('users');//I add this line as Version 3 MongoDB connect differently where it gives the parent instead of the db.
    //serialization and app.listen
    passport.serializeUser((user, done) => {
        done( null, user._id);
    });

    passport.deserializeUser((id, done) => {
        db.collection('users').findOne(
          {_id: new ObjectID(id)},
            (err, doc) => {
              done(null, doc);
            }
        );
    });
    
    auth(app,db);
    routes(app, db);
    
    
    app.use(( req, res, next) => {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
    
    
    
    
    app.listen(process.env.PORT || 3000, () => {
          console.log("Listening on port " + process.env.PORT);

     });
    
   
  }});
        

