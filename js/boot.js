/* global Modernizr, responsiveNav, AppModule, SliderModule, TouchSliderModule */

(function () {
	"use strict";

	Modernizr.load([
		{
			load: 'js/vendor/responsive-nav.js',
			complete: function () {
				if(!responsiveNav) {
					throw new Error("Could not load responsive nav");
				}

				var nav = document.getElementsByClassName('nav-collapse');
				if(nav.length > 0) {
					responsiveNav('.nav-collapse', {
						label: '☰ Menu'
					});
				}
			}
		},
		{
			load: '//ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.1.min.js',
			complete: function () {
				if ( !window.jQuery ) {
					Modernizr.load('js/vendor/jquery-2.1.1.min.js');
				}
			}
		},
		{
			load: '/js/utils.js'
		},
		{
			load: '/js/app.js',
			complete: function () {
				AppModule.init();
			}
		},
		{
			test: Modernizr.touch,
			yep: ['/js/vendor/hammer.js', '/js/touchslider.js'],
			nope: ['/js/slider.js'],
			complete: function () {
				if(Modernizr.touch) {
					TouchSliderModule.init();
				}
				else {
					SliderModule.init();
				}
			}
		}
	]);
})();