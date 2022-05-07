const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

///////////////////Connect Mongodb//////////////
mongoose.connect("mongodb://localhost:27017/movieDB");

////////////////////////Schema///////////////////////
const homeSchema = ({
  image: String,
});
const allMovieSchema = ({
  movieName: String,
  title: String,
  posterImage: String,
  downloadLink420p: String,
  downloadLink720p: String,
  downloadLink1080p: String,
  imdbRating: String,
  storyLine: String,
  director: String,
  writer: String,
  stars: String,
  language: String,
  size: String,
  format: String,
  screenshotLink1: String,
  screenshotLink2: String,
  screenshotLink3: String,


});

/////////////////create model/////////////////////
const Home = mongoose.model("Home", homeSchema);
const AllMovie = mongoose.model("AllMovie", allMovieSchema);

app.get('/', function(req, res) {
  res.render('home', );
});

app.get('/allMovies', function(req, res) {

  AllMovie.find(function(err, result) {
    if (!err) {
      res.render('allMovies', {
        movies: result,
      });
    }

  });
});

///////////////////////////////Movie Details Page (EJS Routing Params)//////////////////////////

app.get("/info/:movieId", function(req, res) {

  const requestedId = req.params.movieId;

  AllMovie.findOne({
    _id: requestedId
  }, function(err, result) {

    res.render("info", {
      movie: result,
    });
  });

});


//////////////////////////Upload Section////////////////
app.get("/:adminUpload", function(req, res) {
  const urlInput = (req.params.adminUpload);
   var pass = urlInput.slice(0, 11);
   var movieName = urlInput.slice(11, urlInput.length);
   console.log(movieName);
   console.log(pass);

  if (pass === "AdminUpload") {
    res.render("upload", );
  }
  /////////////////////////////////Update Section//////////////////////////
  if (pass === "AdminUpdate"){
    AllMovie.findOne({movieName: movieName}, function(err, result){
      // console.log(result._id);
      if(!err) {
        res.render("update", {
          movie: result,
        });
      }
      else {
        console.log(err);
      }
    })

  }
  else {
    res.render("error",{
      massage: "Passwords do not match :( "
    });
  }

});

app.post("/update", function(req, res){


  const updatedMovie = new AllMovie({
    movieName: req.body.movieName,
    title: req.body.movieTitle,
    posterImage: req.body.posterImageLink,
    downloadLink420p: req.body.downloadLink420p,
    downloadLink720p: req.body.downloadLink720p,
    downloadLink1080p: req.body.downloadLink1080p,
    imdbRating:req.body.imdb,
    storyLine: req.body.story,
    director: req.body.director,
    writer: req.body.writer,
    stars: req.body.size,
    language: req.body.languages,
    size: req.body.size,
    format: req.body.format,
    screenshotLink1:req.body.ss1,
    screenshotLink2: req.body.ss2,
    screenshotLink3: req.body.ss3,
  });

  const id = req.body.id;
  console.log("update")
  console.log(id);
  console.log(updatedMovie.title)
  AllMovie.updateOne({_id:id},{
    movieName: updatedMovie.movieName,
    title: updatedMovie.title,
    posterImage: updatedMovie.posterImage,
    downloadLink420p: updatedMovie.downloadLink420p,
    downloadLink720p: updatedMovie.downloadLink720p,
    downloadLink1080p:updatedMovie.downloadLink1080p,
    imdbRating:updatedMovie.imdbRating,
    storyLine: updatedMovie.storyLine,
    director: updatedMovie.director,
    writer: updatedMovie.writer,
    stars: updatedMovie.stars,
    language: updatedMovie.language,
    size: updatedMovie.size,
    format: updatedMovie.format,
    screenshotLink1: updatedMovie.screenshotLink1,
    screenshotLink2: updatedMovie.screenshotLink2,
    screenshotLink3: updatedMovie.screenshotLink3,

  }, function(err){
    if (!err){
      console.log("Successfully updated");
    }
  });

res.redirect("/allMovies");

});



/////////////////////////Post-Upload//////////////////////////////////////
app.post("/Upload", function(req, res) {

  const movie = AllMovie({
    movieName: req.body.movieName,
    title: req.body.movieTitle,
    posterImage: req.body.posterImageLink,
    downloadLink420p: req.body.downloadLink420p,
    downloadLink720p: req.body.downloadLink720p,
    downloadLink1080p: req.body.downloadLink1080p,
    imdbRating:req.body.imdb,
    storyLine: req.body.story,
    director: req.body.director,
    writer: req.body.writer,
    stars: req.body.size,
    language: req.body.languages,
    size: req.body.size,
    format: req.body.format,
    screenshotLink1:req.body.ss1,
    screenshotLink2: req.body.ss2,
    screenshotLink3: req.body.ss3,
  });
  movie.save();
  res.redirect("/AdminUpload");

});


app.listen(3000, function(req, res) {
  console.log("im on port 3000");
});
