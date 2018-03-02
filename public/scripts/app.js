/*jshint esversion: 6 */


// Fake data taken from tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


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

  function loadAndRenderTweets () {
    $('section.tweets').empty();

    data.forEach(function(element) {
      const tweetHtml = createTweetElement(element);
      // 4. Append to the list
      $('section.tweets').append(tweetHtml);
    });
  }
 

   $('.new-tweet form').on('submit', function(event) {
    // prevent the default behaviour
    event.preventDefault();
    // get the data of the form
    var tweetText = $('.new-tweet textarea').val();
  	// build the new tweet
  	let newTweet = {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": tweetText
    },
    "created_at": Date.now()
  };
  // add the new tweet to the 'database'
  data.push(newTweet);
  // redraw the tweets
  loadAndRenderTweets();

  });

  loadAndRenderTweets();
});


