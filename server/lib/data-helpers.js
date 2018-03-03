"use strict";
/*jslint node: true */
/*jshint esversion: 6 */

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      if (!newTweet) { return; }
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        tweets.sort((a, b) => {
          return b.created_at - a.created_at;
        });
        callback(null, tweets);
      });
    }
  };
};


