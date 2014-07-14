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
		var $tel = $context.find('.tel-wrapper');
		var $email = $context.find('.email-wrapper');
		if(this.value === "email") {
			$tel.hide();
			$email.show();
		}
		else if(this.value === "tel") {
			$email.hide();
			$tel.show();
		}	
	};
 
	return {
		init: function() {
			initForm();
		}
	};
 
})(jQuery);