/* global Hammer, Utils */
/* exported TouchModule */

var TouchModule = (function () {
	"use strict";

	return {
		init: function() {
			var slider = document.getElementById('slider');
			if(!slider)
			{
				return;
			}

			var hammer = new Hammer(slider);
			var pages = slider.querySelectorAll('.slider-page');

			hammer.on('swipe', function (e) {
				var current = slider.querySelectorAll('.slider-page.active');

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