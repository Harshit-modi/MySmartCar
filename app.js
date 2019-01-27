var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const smartcar = require('smartcar');

var app = express();

const port = 4000;

const client = new smartcar.AuthClient({
  clientId: 'a0a02014-6562-4f13-8e1b-9fcdc23711f3',
  clientSecret: '11803929-e44c-4864-9a30-1f49781e9f0b',
  redirectUri: 'https://javascript-sdk.smartcar.com/redirect-2.0.0?app_origin=http://localhost:3000',
  scope: ['read_vehicle_info']
});

// Redirect to Smartcar's authentication flow
app.get('/login', function(req, res) {

  const link = client.getAuthUrl({state: 'MY_STATE_PARAM'});

  // redirect to the link
  res.redirect(link);
});

// Handle Smartcar callback with auth code
app.get('/callback', function(req, res, next) {
  let access;

  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }

  // exchange auth code for access token
  return client.exchangeCode(req.query.code)
    .then(function(_access) {
      // in a production app you'll want to store this in some kind of persistent storage
      access = _access;
      // get the user's vehicles
      return smartcar.getVehicleIds(access.accessToken);
    })
    .then(function(res) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(res.vehicles[0], access.accessToken);
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(data) {
      console.log(data);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      // json response will be sent to the user
      data.accessToken = access.accessToken;
      res.json(data);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(port, () => console.log(`Listening on port ${port}`));
