const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const BSON = require('bson');

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lk2v0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/add-product', (req, res) => {
  client.connect(err => {
    const pdCollection = client.db(process.env.DB_NAME).collection('products');
    pdCollection.insertOne(req.body)
      .then(result => res.send(result))
      .catch(errr => console.log(errr))
  });
})

app.get('/get-products', (req, res) => {
  client.connect(err => {
    const pdCollection = client.db(process.env.DB_NAME).collection('products');
    pdCollection.find()
      .toArray()
      .then(products => res.send(products));
  })
})

app.get('/get-product/:id', (req, res) => {
  client.connect(err => {
    const pdCollection = client.db(process.env.DB_NAME).collection('products');
    const id = req.params.id;
    pdCollection.findOne({ "_id": BSON.ObjectId(id) })
      .then(result => res.send(result));
  })
})

app.delete('/delete-product/:id', (req, res) => {
  client.connect(err => {
    const pdCollection = client.db(process.env.DB_NAME).collection('products');
    const id = req.params.id;
    pdCollection.deleteOne({ "_id": BSON.ObjectId(id) })
    .then(result => res.send(result))
    .catch(err=> res.send(err.errmsg))
  })
})




app.listen(5000);