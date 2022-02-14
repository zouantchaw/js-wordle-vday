// Backend code

const PORT = process.env.PORT || 8000;
const axios = require("axios").default
const express = require("express")
const cors = require("cors")
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require('dotenv').config()

const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";
const HOST = "localhost";

const app = express()

// Cors
app.use(cors())

// Logging
app.use(morgan('dev'))

// Authorization
app.use('', (req, res, next) => {
  console.log('Peeep')
  console.log(req.headers.authorization)
  if (req.headers.authorization === process.env.SERVER_API_KEY) {
    next();
  } else {
    res.sendStatus(403);
  }
})

// Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    [`^/json_placeholder`]: '',
  },
}))

app.get('/info', (req, res, next) => {
  res.send('Hey tooo fron the proxyyyy')
})

app.get('/word', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
    params: {count: '5', wordLength: '5'}, 
    headers: {
      'x-rapidapi-host': 'random-words5.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY,
    }
  };
  
  axios.request(options).then((response) => {
    console.log(response.data);
    res.json(response.data[0])
  }).catch((error) => {
    console.error(error);
  });
})

app.get('/check', (req, res) => {
  const word = req.query.word

  const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: {entry: word},
    headers: {
      'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY,
    }
  };
  
  axios.request(options).then((response) => {
    console.log(response.data);
    res.json(response.data.result_msg)
  }).catch((error) => {
    console.error(error);
  });
})

// app.listen(PORT, () => console.log('Server running on port' + PORT))

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`)
})