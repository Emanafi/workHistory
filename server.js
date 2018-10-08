// require express and other modules
const express = require('express');
const app = express();

// parse incoming urlencoded form data
// and populate the req.body object
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/************
 * DATABASE *
 ************/

const db = require('./models/index.js');

/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML Endpoints
 */

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/workhistory', (req, res) => {
  res.sendFile(__dirname + '/views/workhistory.html');
});

/*
 * JSON API Endpoints
 */

//Describing possible end points
app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to my personal api! Here's what you need to know!",
    documentationUrl: "https://github.com/example-username/express-personal-api/README.md", //add link to github readme.md
    baseUrl: "http://YOUR-APP-NAME.herokuapp.com", // https://dashboard.heroku.com/apps/ancient-retreat-41547
    endpoints: [
      {method: "GET", path: "/api", description: "Describes all available endpoints"},
      {method: "GET", path: "/api/profile", description: "Information about me"}, 
      {method: "GET", path: "/api/workhistory", description: "All of my work history"},
      {method: "POST", path: "/api/workhistory", description: "Creating an item"},
      {method: "PUT", path: "/api/workhistory/:id", description: "Updating an item"},
      {method: "DELETE", path: "/api/workhistory/:id", description: "Deleting an item"},
    ]
  })
});

//Profile
 app.get('/api/profile', (req, res) => {
  res.json({
    fullName: "Elpi Manafi",
    githubUsername: "Emanafi",
    githubLink: "https://github.com/Emanafi",
    githubProfileImage: "./images/eddie_and_i.jpeg",
    currentCity: "San Jose, Ca",
    hobbies: [
      {name: "Soccer", type: "Sport", position: "Right Back"}, 
      {name: "Mechanical work", type: "Blue Collar", car: "Toyota 4Runner"},
    ]
  })
});

// returns all work Index
app.get('/api/workhistory', (req, res) => {
  db.workHistory.find((err, allWork) => {
    if (err) res.json(err);
    res.json(allWork);
  });
});

// Work Create
app.post('/api/workhistory', (req, res) => {
  db.workHistory.create(req.body, (err, newWork) => {
    if (err) res.json(err);
    res.json(newWork);
  });
});

// Work Update
app.put('/api/workhistory/:id', (req, res) => {
  const workId = req.params.id;
  const workData = req.body;
  console.log(`Work ID = ${workId} \n Work Data = ${workData}`)
  db.workHistory.findOneAndUpdate({_id: workId}, workData, {new: true}, (err, updatedWork) => {
    res.json(updatedWork);
  });
});

// Work Destroy
app.delete('/api/workhistory/:id', (req, res) => {
  const workId = req.params.id;

  db.workHistory.findOneAndRemove({_id: workId}, (err, deletedWork) => {
    if (err) res.json(err);
    res.json(deletedWork);
  });
});


/**********
 * SERVER *
 **********/

// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server is up and running on http://localhost:3000/');
});
