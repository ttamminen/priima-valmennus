/* global Hammer, Utils */
/* exported TouchSliderModule */

var TouchSliderModule = (function () {
	"use strict";

	var module = {};

	module.sliderEl = null;
	module.pages = null;

	module.nextSlide = function () {
		var current = module.sliderEl.querySelectorAll('.slider-page.active');

		var target = current[0].nextElementSibling;
		if(target === null)
		{
			target = module.pages[0];
		}
		Utils.addClass(target, 'active');
		Utils.removeClass(current[0], 'active');
	};

	module.prevSlide = function () {
		var current = module.sliderEl.querySelectorAll('.slider-page.active');

		var target = current[0].previousElementSibling;
		if(target === null)
		{
			target = module.pages[module.pages.length - 1];
		}
		Utils.addClass(target, 'active');
		Utils.removeClass(current[0], 'active');
	};

	return {
		init: function() {
			var sliderEl = document.getElementById('slider');
			if(!sliderEl)
			{
				return;
			}

			var next = sliderEl.querySelectorAll('.js-slider-next');
			var prev = sliderEl.querySelectorAll('.js-slider-prev');
			next.addEventListener('click', next);
			prev.addEventListener('click', prev);

			var hammer = new Hammer(sliderEl);

			module.pages = sliderEl.querySelectorAll('.slider-page');
			module.sliderEl = sliderEl;

			hammer.on('swipeleft', module.nextSlide);
			hammer.on('swiperight', module.prevSlide);
		}
	};
})();