const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/coache-player", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log(`Connected to '${db.name}' database...!`);
});
const users = require('./routes/user.route');
const players = require('./routes/player.route');

const app = express();

app.use(cors());
// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use("/", (req, res, next) => {
  try {
    if (["/", "/login", "/register", "/register-admin", "/players", "/players/add"].indexOf(req.path) > 0) {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'back-end-test', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    sucessMessage: 'Back-end API'
  });
});

/* login api */
app.all("/login", users);

/* register admin user api */
app.all("/register-admin", users);

/* register api */
app.all("/register", users);

/* Api to add Player*/
app.all("/players/add", players);

/*Api to post and search players by name*/
app.all("/players", players);

app.listen(PORT, () => {
  console.log(`Back end server is Runing On port ${PORT}...`);
});
