/* global Hammer, Utils */
/* exported TouchModule */

var TouchModule = (function () {
	"use strict";

	return {
		init: function() {
			var slider = document.getElementById('slider');
			var hammer = new Hammer(slider);
			var pages = slider.querySelectorAll('.page');

			hammer.on('panleft panright', function () {
				var current = slider.querySelectorAll('.page.active');

				var target = current[0].nextElementSibling;
				if(target === null)
				{
					target = pages[0];
				}
				Utils.addClass(target, 'active');
				Utils.removeClass(current[0], 'active');
			});
		}
	};

})();