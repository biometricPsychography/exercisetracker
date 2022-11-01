const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
const cors = require('cors')
const port = 8080;
const mongoose = require('mongoose');
const e = require('express');
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
      if (req.body.date) {
        let datePieces = req.body.date.split('-')
        var date = new Date(datePieces[0], datePieces[1]-1, datePieces[2])
      } else {
        var date = new Date();
      }

      doc.exercises.push({description: req.body.description, duration: req.body.duration, date: date});
      doc.save().then((doc) => {
        let apiOutputScaffold = Object.assign({}, req.body);
      apiOutputScaffold.username = doc.username;
      apiOutputScaffold.date = date.toDateString();
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




    User.findById(req.params._id, (err, doc) => {
      let apiOutputScaffold = (({ _id, username }) => ({ _id, username }))(doc);
      exerciseArr = [];



      
  

      if (/\d{4}-\d{1,2}-\d{1,2}/.test(from)) {
        let fromPieces = from.split('-');
        var fromDateObj = new Date(fromPieces[0], fromPieces[1] - 1, fromPieces[2])
      }

      if (/\d{4}-\d{1,2}-\d{1,2}/.test(to)) {
        let toPieces = to.split('-');
        var toDateObj = new Date(toPieces[0], toPieces[1] - 1, toPieces[2])
      }
      console.log({toDateObj})


      doc.exercises.every((embeddedDoc, index, arr) => {
        
        // stop iteration when limit is passed
        if (limit && index + 1 > limit) {
          return false;
        }
        
        let plainOldJavascriptObject = embeddedDoc.toObject();


      // ideally this filtering would be done in the DB but freeCodeCamp tutorial didn't teach enough
      // for that to be practical to figure out right now. I've definitely tried. I know it 
      // would involve something like using aggregate...

        var willIncludeDoc;

   
        if (fromDateObj && plainOldJavascriptObject.date >= fromDateObj) {
          willIncludeDoc = true;
        } else if (!fromDateObj) {
          willIncludeDoc = true;
        } else {
          willIncludeDoc = false;
        }

        if (willIncludeDoc && toDateObj && plainOldJavascriptObject.date <= toDateObj) {
          willIncludeDoc = true;
          
        } else if (willIncludeDoc && !toDateObj) {
          willIncludeDoc = true;
        } else {
          willIncludeDoc = false;
        }

        if (willIncludeDoc) {
          delete plainOldJavascriptObject._id;
          plainOldJavascriptObject.date = plainOldJavascriptObject.date.toDateString();
          exerciseArr.push(plainOldJavascriptObject);
          console.log('wut'); 
        }


        return true;
        

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
