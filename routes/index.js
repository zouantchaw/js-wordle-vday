const express = require("express");
const router = express.Router();
const axios = require("axios").default;

router.get("/word", (req, res) => {
  const options = {
    method: "GET",
    url: process.env.RAPID_RANDOM_WORD_URL,
    params: { count: "5", wordLength: "5" },
    headers: {
      "x-rapidapi-host": "random-words5.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);

      // Log request to public api
      if (process.env.NODE_ENV !== "production") {
        console.log(`REQUEST: ${process.env.RAPID_RANDOM_WORD_URL}`);
      }

      res.json(response.data[0]);
    })
    .catch((error) => {
      console.error(error);
    });
});
 
router.get("/check", (req, res) => {
  const word = req.query.word;

  const options = {
    method: "GET",
    url: process.env.RAPID_DICTIONARY_URL,
    params: { entry: word },
    headers: {
      "x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);

      // Log request to public api
      if (process.env.NODE_ENV !== "production") {
        console.log(`REQUEST: ${process.env.RAPID_DICTIONARY_URL}`);
      }

      res.json(response.data.result_msg);
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = router;
