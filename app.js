const express = require('express')
const Product = require('./Models/productModel')
const mongoose = require('mongoose')

const app = express()

mongoose.connect("mongodb://localhost:27017/exo-go-fullstack",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json()) // meme role que body-parser(intercepte toutes les requetes qui ont un content-type json pour les mettre a dispo)

// Cors
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/products', (req, res, _next) => {
  delete req.body._id
  const product = new Product({
    ...req.body
  })
  product.save()
    .then((product) => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error }))
})

app.put('/api/products/:id', (req, res, _next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ msg: "Modified" }))
    .catch(error => res.status(400).json({ error }))
})

app.delete('/api/products/:id', (req, res, _next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: "Deleted" }))
    .catch(error => res.status(400).json({ error }))
})

app.get('/api/products/:id', (req, res, _next) => {
  Product.findOne({ _id: req.params.id })
    .then(produit => res.status(200).json(produit))
    .catch(error => res.status(400).json({ error }))
})

app.get('/api/products', (req, res, _next) => {
  Product.find()
    .then((data) => res.status(201).json(data))
    .catch(error => res.status(400).json({ error }))
});

module.exports = app;