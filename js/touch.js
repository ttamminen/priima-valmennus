/* global Hammer, Utils */
/* exported TouchModule */

var TouchModule = (function () {
	"use strict";

	var slider = null,
		pages = null;

	function nextSlide() {
		var current = slider.querySelectorAll('.slider-page.active');

		var target = current[0].nextElementSibling;
		if(target === null)
		{
			target = pages[0];
		}
		Utils.addClass(target, 'active');
		Utils.removeClass(current[0], 'active');
	}

	function prevSlide() {
		var current = slider.querySelectorAll('.slider-page.active');

		var target = current[0].previousElementSibling;
		if(target === null)
		{
			target = pages[0];
		}
		Utils.addClass(target, 'active');
		Utils.removeClass(current[0], 'active');
	}	

	return {
		init: function() {
			this.slider = document.getElementById('slider');
			if(!this.slider)
			{
				return;
			}

			var hammer = new Hammer(slider);
			this.pages = slider.querySelectorAll('.slider-page');

			hammer.on('swipeleft', nextSlide);
			hammer.on('swiperight', prevSlide);
		}
	};

})();