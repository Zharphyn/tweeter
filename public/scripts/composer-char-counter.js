/*jshint esversion: 6 */

// A $( document ).ready() block.
$(() => {
  // start off with button disabled preventing 0 length text
  $('#submit-button').val('Your tweet is too short').attr("disabled", true).css('color', '#22262A');

  $('textarea').on('keydown', function(event) {
    let $length = $(this).val().length;

    // When key down is pressed, the length of this has not updated with the new character length
    // keyCode 8 is the backspace key
    if (event.keyCode === 8) {
      $length -= 1;
    } else {
      $length += 1;
    }

    let $counter = $('.counter');
    $counter.text(140 - $length);
    
    // Max tweet is 140 characters. If we exceed this, we need to alert the user and prevent posting
    if ($length > 140) {
      $('.counter').css('color', 'red');
      $('#submit-button').val('Your tweet is too long').attr("disabled", true).css('color', 'red');

    // If tweet is zero length, we need to alert the user and prevent posting
    } else if ($length <= 0) {
      $counter.text(140);
      $('#submit-button').val('Your tweet is too short').attr("disabled", true).css('color', '#22262A');

    // if negative conditions are not present, we can allow the tweet to be posted
    } else {
      $('.counter').css('color', '#22262A');
      $('#submit-button').val('Submit').removeAttr("disabled").css('color', '#22262A');
    }
  });

});
