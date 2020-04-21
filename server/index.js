const express = require('express');
var db = require('../database');
var gh = require('../helpers/github.js');
// var cors = require('cors')
// const fetch = require("node-fetch");
var request = require('request');
var http = require('http');
var bodyParser = require('body-parser')


let app = express();

// ----------------
// middle ware

app.use(express.static(__dirname + '/../client/dist'));
// app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())


app.post('/repos', function (req, res) {

  gh.getReposByUsername(req.body.username, (repos) => {

    var parsedRepos = JSON.parse(repos.body);

    if (Array.isArray(parsedRepos)) {
      for (var repo of parsedRepos) {
        // console.log(repo);
        db.save(repo);
      }
    } else {
      console.log(typeof parsedRepos);
    }
    res.end();
  });

});

app.get('/repos', function (req, res) {


  db.Repo.find({}, function (err, repo) {
    if (err) return console.log(err);
  }).sort( { popularity: -1 } ).limit(25)
  .then((repos) => {
    db.Repo.count()
    .then((count) => {
      res.end(JSON.stringify([repos, count]));
    });
  });

});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

