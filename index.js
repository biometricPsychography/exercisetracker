const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
const cors = require('cors')
const port = 8080;
const mongoose = require('mongoose');
require('dotenv').config()


app.use(cors())
app.use(express.static('public'))

app.use(function(req, res, next) {console.log(
`req.method: ${req.method} 
req.url: ${req.url} 
req.body: ${JSON.stringify(req.body)}`
); next();});





main().catch(err => console.log(err));

async function main() {
  let dbConnectionStatus = await mongoose.connect(`mongodb+srv://${process.env.UN}:${process.env.PW}@cluster0.aaqngpq.mongodb.net/exercisetracker`);




  

 
  




  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    exercises: [{
      description: {
        type: String,
        required: true
      },
      duration: {
        type     : Number,
        required : true,
        unique   : false,
        validate : {
          // Pretty sure the Number below is not the same as the Number of type:
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }
      },
      date: {
        type : Date,
        required: false,
        unique: false
      }
    }] 
  });

  const User = mongoose.model('User', userSchema);

  


  
  app.get('/', (req, res) => {


    if (!dbConnectionStatus) {
      res.sendFile(__dirname + '/views/preindex.html')
    } else {
      res.sendFile(__dirname + '/views/index.html')
    }
  });





  app.post('/api/users', function (req, res) {
    const user = new User({username: req.body.username});



    user.save().then((savedDoc) => {
      // instantly executed anonymous function using object destructuring inside .send() to filter object properties
      res.send((({ _id, username }) => ({ _id, username }))(savedDoc));
      
    }, (err) => {
      res.send(err);
    });
  });

  app.get('/api/users', (req, res) => {
    User.find({}).select('username').exec( (err, doc) => {
      res.send(doc);
    });
  });

  app.post('/api/users/:_id/exercises', function (req, res) {
    


    User.findById(req.params._id, (err, doc) => {
      if (err) {res.send(err); return;}
      let datePieces = req.body.date.split('-')
      let date = new Date(datePieces[0], datePieces[1]-1, datePieces[2])

      doc.exercises.push({description: req.body.description, duration: req.body.duration, date: date});
      doc.save().then((doc) => {
        let apiOutputScaffold = Object.assign({}, req.body);
      apiOutputScaffold.username = doc.username;
      console.log(apiOutputScaffold);
      res.send(apiOutputScaffold);
      }, (err) => {
        res.send(err);
      })
      
    });
  });

  app.get('/api/users/:_id/logs', function (req, res) {
    let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;

    console.log(from, to, limit)


    User.findById(req.params._id, (err, doc) => {
      let apiOutputScaffold = (({ _id, username }) => ({ _id, username }))(doc);
      exerciseArr = [];
      
      doc.exercises.forEach((element, index, arr) => {
        exerciseArr.push(element);
      })

      apiOutputScaffold.count = exerciseArr.length;

      apiOutputScaffold.log = exerciseArr;
      res.send(apiOutputScaffold);
    });
  });



}












const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
