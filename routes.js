const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, db) {
  
  app.route('/')
      .get((req, res) => {    
        res.render(process.cwd() + '/views/pug/index', { title:'Home page' , message:'Please login', showLogin: true ,showRegistration: true});
      }); 

    app.route('/login') 
       .post(passport.authenticate('local',{ failureRedirect: '/' } ),(req,res) =>{
              res.redirect('/profile');
    });              
    
    app
      .route('/profile')
      .get(ensureAuthenticated,(req,res) => {
               res.render(process.cwd() + '/views/pug/profile', { username: req.user.username });
    });
    
    app.route('/register')
    .post((req, res, next) => {  
      db.collection('users').findOne({ username: req.body.username }, function(err, user) {
        if (err) {
          next(err);
        } else if (user) {       
          console.log("the user exist")
          res.redirect('/');
        } else {    
          var hash = bcrypt.hashSync(req.body.password, 12);
          
          db.collection('users').insertOne({
            username: req.body.username,
            password: hash
          },
            (err, doc) => {
              if (err) {
                res.redirect('/');
              } else {
                next(null, user);
              }
            }
          )
        }
      })
    },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );
    
    
    app.route('/logout')
       .get(( req, res ) => {
          req.logout();
        res.redirect('/');
    });
  
  
  function ensureAuthenticated(req,res,next){
      if( req.isAuthenticated()){
        return next();
      }
        res.redirect('/');
    };

  
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

