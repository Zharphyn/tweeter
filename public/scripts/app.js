/*jshint esversion: 6 */

function daysOld(dateStamp) {
	const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	const numDays = Math.floor((Date.now() - dateStamp) / oneDay);

	return numDays;
}

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

function buildMiddle(tweetData) {
	// Remove HTML tags to prevent injections
	return $(`<div class="tweet-body clearfix"><p>${tweetData.content.text}</p></div>`);
}

function buildFooter(tweetData) {
	let $footer = $(`<footer class="tweet-footer clearfix">`);
	let $p = $(`<p>${daysOld(tweetData.created_at)} days old</p>`);
    let $div = $(`<div class="footer-icons">`);
    $div.append(`<img class="flag-icon" src='/images/flag.ico' >`);
    $div.append(`<img class="retweet-icon" src='/images/retweet.ico' >`);
    $div.append(`<img class="love-icon" src='/images/empty-heart.ico' >`);
    $footer.append($p);
    $footer.append($div);
        
    return $footer;
}

function createTweetElement(tweetData) {
	let $header = BuildHeader(tweetData);
	let $middle = buildMiddle(tweetData);
	let $footer = buildFooter(tweetData);

	let $tweet = $('<article>').append($header);
	$tweet.append($middle);
	$tweet.append($footer);

	return $tweet;
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
    
  function loadTweets() {
  	// that is responsible for fetching tweets from the http://localhost:8080/tweets page.
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

  function renderTweets (tweets) {
    $('section.tweets').empty();

    tweets.forEach(function(element) {
      const tweetHtml = createTweetElement(element);
      // 4. Append to the list
      $('section.tweets').append(tweetHtml);
    });
  }
 
  function postNewTweet(tweetText) {
    //To pass to the post for writing the tweet
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

  $('.new-tweet form').on('submit', function(event) {
    // prevent the default behaviour
    event.preventDefault();
    // get the data of the form
    var tweetText = $('.new-tweet textarea').val();
    // Remove HTML tags to prevent injections (XSS)
    tweetText = $(tweetText).text();

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


  
  loadTweets();
});

//POST request to add new tweet to mongo database (tweets collection)




