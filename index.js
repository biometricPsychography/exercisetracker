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
    name: String,
    exercises: [{
      description: String,
      duration: {
        type     : Number,
        required : false,
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
    const user = new User({name: req.body.username});



    user.save();
  });

  // app.post('/api/users/:_id/logs?', function (req, res) {
    


  //   User.findById(req.params._id, (err, result) => {
  //     console.log(result);
  //     res.send('<code>'+result+'<code>')
  //   });
  // });

  app.get('/api/users/:_id/logs?', function (req, res) {
    


    User.findById(req.params._id, (err, result) => {
      console.log(result);
      res.send('<code>'+result+'<code>')
    });
  });



}












const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
