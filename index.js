const express = require('express')
const app = express()
const cors = require('cors')
const port = 8080;
const mongoose = require('mongoose');
require('dotenv').config()


app.use(cors())
app.use(express.static('public'))



main().catch(err => console.log(err));

async function main() {
  app.get('/', (req, res) => {


    if (!dbConnectionStatus) {
      res.sendFile(__dirname + '/views/preindex.html')
    } else {
      res.sendFile(__dirname + '/views/index.html')
    }
  });


  let dbConnectionStatus = await mongoose.connect(`mongodb+srv://${process.env.UN}:${process.env.PW}@cluster0.aaqngpq.mongodb.net/exercisetracker`);
  




  const userSchema = new mongoose.Schema({
    name: String,
    exercises: [{
      description: String,
      duration: {
        type     : Number,
        required : true,
        unique   : false,
        validate : {
          // Pretty sure the Number below is not the same as the Number of type:
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }
      }
    }] 
  });

  const User = mongoose.model('User', userSchema);

  const silence = new User({name: "Silence"});

  await silence.save();
  





  app.post('/api/shorturl', function (req, res) {

  });
}












const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
