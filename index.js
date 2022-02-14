// Backend code
const axios = require("axios").default
const express = require("express")
const cors = require("cors")
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = require('./routes/index')
require('dotenv').config()

const PORT = process.env.PORT || 8000;


const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";

const app = express()

// Routes
app.use('/api', router)

// Cors
app.use(cors())

// Logging
app.use(morgan('dev'))

// Authorization
// app.use('', (req, res, next) => {
//   console.log('Peeep')
//   console.log(req.headers.authorization)
//   if (req.headers.authorization === process.env.SERVER_API_KEY) {
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// })

// Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
  target: 'http://localhost:8000/api',
  changeOrigin: true,
  pathRewrite: {
    [`^/json_placeholder`]: '',
  },
}))

// app.get('/info', (req, res, next) => {
//   res.send('Hey tooo fron the proxyyyy')
// })

app.listen(PORT, () => console.log('Server running on port' + PORT))

// app.listen(PORT, HOST, () => {
//   console.log(`Starting Proxy at ${HOST}:${PORT}`)
// })