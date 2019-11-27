app.use(passport.initialize());
app.use(passport.session());   

module.exports = function (app, db) {

  
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

    routes(app, db);
    
    passport.deserializeUser((id, done) => {
        db.collection('users').findOne(
          {_id: new ObjectID(id)},
            (err, doc) => {
              done(null, doc);
            }
        );
    });
    
}