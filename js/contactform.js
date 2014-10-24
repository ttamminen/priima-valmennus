/* global _gaq, jQuery */
/* exported ContactFormModule */

var ContactFormModule = (function ($) {
	"use strict";
 	var $context = $('#contact-form form');

	function initForm() {
		var $contactMethod = $context.find('.contact-method');
		if($contactMethod.length) {
			var $selection = $contactMethod.find('input[type="radio"]');
			$selection.on('change', onContactMethodChange);
			$selection.first().trigger('change');
		}

		bindTrackingEvents();
	}	

	var bindTrackingEvents = function () {
		$context.find('input[type="submit"]').submit(function () {
			_gaq.push(['_trackEvent', 'Yhteydenotto', 'Lähetä palaute']);
		});
		$context.find('input').first().one('change', function () {
			_gaq.push(['_trackEvent', 'Yhteydenotto', 'Aloitti viestin kirjoittamisen']);
		});
	};

	var onContactMethodChange = function () {
		var $tel = $context.find('.tel-wrapper');
		var $telField = $tel.find('input');
		var $email = $context.find('.email-wrapper');
		var $emailField = $email.find('input');
		if(this.value === "email") {
			$tel.hide();
			$email.show();
			$telField.prop('required', false);
			$emailField.prop('required', true);
		}
		else if(this.value === "tel") {
			$email.hide();
			$tel.show();			
			$telField.prop('required', true);
			$emailField.prop('required', false);
		}	
	};
 
	return {
		init: function() {
			if($context.length === 0)
			{
				return;
			}

			initForm();
		}
	};
 
})(jQuery);