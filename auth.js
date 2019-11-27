const passport = require('passport');

module.exports = function (app, db) {
  app.use(passport.initialize());
  app.use(passport.session());
  
  const bcrypt = require('bcrypt');
    
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
}