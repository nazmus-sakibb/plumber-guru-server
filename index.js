const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dvpw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const serviceCollection = client.db("plumber").collection("services");
  const reviewCollection = client.db("plumber").collection("testimonials");

  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })


  app.get('/testimonials', (req, res) => {
    reviewCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })


  app.get('/book/:id', (req, res) => {
    serviceCollection.find({id: req.params._id})
    .toArray((err, items) => {
      res.send(items);
      console.log('working', items, err);
    })
  })

  

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new product', newService);
    serviceCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })


  app.post('/addTestimonial', (req, res) => {
    const newReview = req.body;
    console.log('adding new product', newReview);
    reviewCollection.insertOne(newReview)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })
});


app.listen(process.env.PORT || port)