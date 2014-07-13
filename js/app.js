var AppModule = (function ($) {
 	var $context = $('.contact-form');

	function initForm() {
		var $contactMethod = $context.find('.contact-method');
		if($contactMethod.length) {
			var $selection = $contactMethod.find('input[type="radio"]');
			$selection.on('change', onContactMethodChange);
		}
	}

	onContactMethodChange = function (e) {
	};
 
	return {
		init: function() {
			initForm();
		}
	};
 
})(jQuery);