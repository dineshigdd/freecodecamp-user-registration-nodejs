'use strict';
const routes = require('./routes.js');

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
  


    
     routes(app, db)
    passport.use( new LocalStrategy (
      
      function( username , password , done ){
        db.collection('users').findOne( { username: username }, function( err, user) {
            console.log('User ' + username + ' attempted to log in.');
            if(err){ return done(err); }
            if(!user) { return done( null, false);}
            if(!bcrypt.compareSync(password, user.password)){ return done(null, false);}
            return done( null, user);
        });
      }    
      
      
    ));      
    
  
    
    app.use(( req, res, next) => {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
    
    
    
    
    app.listen(process.env.PORT || 3000, () => {
          console.log("Listening on port " + process.env.PORT);

     });
    
   
  }});
        

