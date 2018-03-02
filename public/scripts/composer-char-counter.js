/*jshint esversion: 6 */

// A $( document ).ready() block.
$(() => {
    console.log( "ready!" );
 
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
		if ($length > 140) {
			$counter.text($length - 140);
			$('.counter').css('color', 'red');

		} else {

			$counter.text(140 - $length);
			$('.counter').css('color', '#22262A');
		}

			
	});


});
