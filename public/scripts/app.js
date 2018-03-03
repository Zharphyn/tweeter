/*jshint esversion: 6 */

function daysOld(dateStamp) {
  // hours*minutes*seconds*milliseconds
  const oneDay = 24 * 60 * 60 * 1000;
  // subtracts the date on the tweet, to the current date to determine how many days old the tweet is
  const numDays = Math.floor((Date.now() - dateStamp) / oneDay);

  return numDays;
}

// Revceives the tweet information, and builds the HTML header for the tweet
function BuildHeader(tweetData){
  let $avatar = $(`<img src = ${tweetData.user.avatars.small}>`);
  let $h2 = $( `<h2> ${tweetData.user.name} </h2>` );
  let $handle = $('<p class=email> ');
  $handle.text(tweetData.user.handle);
  let $header = $('<header class = tweet-header>');
  $header.append($avatar);
  $header.append($h2);
  $header.append($handle);

  return $header;
}

// Revceives the tweet information, and cleans and builds the HTML tweet portion for the tweet
function buildMiddle(tweetData) {
  // Remove HTML tags to prevent injections
  return $(`<div class="tweet-body clearfix"><p>${tweetData.content.text}</p></div>`);
}

// Revceives the tweet information, and builds the HTML footer for the tweet
function buildFooter(tweetData) {
  let $footer = $(`<footer class="tweet-footer clearfix">`);
  // How many days old is the tweet
  let $p = $(`<p>${daysOld(tweetData.created_at)} days old</p>`);
  // adds the tweet icons to the footer. Functionality of icons still needs to be implemented
  let $div = $(`<div class="footer-icons">`);
  $div.append(`<img class="flag-icon" src='/images/flag.ico' >`);
  $div.append(`<img class="retweet-icon" src='/images/retweet.ico' >`);
  $div.append(`<img class="love-icon" src='/images/empty-heart.ico' >`);
  $footer.append($p);
  $footer.append($div);
        
  return $footer;
}

// Revceives the tweet information, and calls functions to build the separate components and then assembles the HTML tweet
function createTweetElement(tweetData) {
  let $header = BuildHeader(tweetData);
  let $middle = buildMiddle(tweetData);
  let $footer = buildFooter(tweetData);

  let $tweet = $('<article>').append($header);
  $tweet.append($middle);
  $tweet.append($footer);

  return $tweet;
}

// cleans the tweet to prevent cross site scripting (XSS)
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(() => {
  //On click hander which toggles the visibility of the compose tweet section
  //If the compose tweet section is visible, we set the focus to the compose
  //tweet textarea
  $("#compose-button").on('click', function (event) {
    $(".new-tweet").slideToggle("slow", () => {
      if ($(".new-tweet").is(':visible')) {
        $(".new-tweet form textarea").focus();
        $("#compose-button").css('backgroud-color: lightgreen');
      } else {
        $("#compose-button").css('backgroud-color: #eee');
      }
    });
  });

  // loops through the tweet array and calls function to build the HTML tweet, then posts the tweet
  function renderTweets (tweets) {
    $('section.tweets').empty();

    tweets.forEach(function(element) {
      const tweetHtml = createTweetElement(element);
      // 4. Append to the list
      $('section.tweets').append(tweetHtml);
    });
  }
    
  // uses AJAX to request the tweets from the database. Once received, passes the tweet array to be rendered onto the page
  function loadTweets() {
    $(function() {
      $.ajax({
        url: 'http://localhost:8080/tweets',
        method: 'GET',
        success: function (morePostsHtml) {
          renderTweets(morePostsHtml);
        }
      });
    });
  }
 
  // passes the new tweet data to be inserted into the database
  function postNewTweet(tweetText) {
    let tweet = {
      text: tweetText
    };

    $.post("/tweets", tweet, function () {
      loadTweets();
    });

    //clear the form after we tweet
    $(".new-tweet form textarea").val("");
    $(".new-tweet form > .counter").text(140);
  }

  // listens for a new tweet to be posted, verifies that the tweet meets basic requirements,
  // calls for the tweet to be added to the database
  // then calls for the tweets to be redisplayed to the page
  $('.new-tweet form').on('submit', function(event) {
    // prevent the default behaviour
    event.preventDefault();

    // get the data of the form
    // Remove HTML tags to prevent injections (XSS)
    var tweetText = escape($('.new-tweet textarea').val());
    

    //If the tweetBody is null or an empty string we do not make the POST request
    if (!tweetText) {
      $('.counter').text(140);
      $('#submit-button').val('Your tweet is too short').attr("disabled", true).css('color', '#22262A');
      return;
    }

    //Alert the user if their tweet is too long or empty and return
    if (tweetText.length > 140) {
      $('.counter').css('color', 'red');
      $('#submit-button').val('Your tweet is too long').attr("disabled", true).css('color', 'red');
      return;
    }

    //If we get here, the tweet is valid and we can make the POST request which is
    //within the postNewTweet method
    postNewTweet(tweetText);

    // redraw the tweets
    loadTweets();

  });


  // initial load of tweets on page load
  loadTweets();
});

