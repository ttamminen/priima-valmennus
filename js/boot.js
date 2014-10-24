/* global Modernizr, responsiveNav, SliderModule, 
		  TouchSliderModule, ContactFormModule, NewsModule, JSONP, _ */

(function () {
	"use strict";

	Modernizr.load([
		{
			load: 'js/vendor/responsive-nav.js',
			complete: function () {
				if(typeof responsiveNav === "undefined") {
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
			load: ['/js/utils.js', '/js/vendor/lodash.compat.min.js', '/js/vendor/JSONP.js']
		},
		{
			test: document.getElementById('contact-form'),
			load: '/js/contactform.js',
			complete: function () {
				ContactFormModule.init();
			}
		},
		{
			test: document.getElementsByClassName('social-media-updates'),
			load: '/js/news.js',
			complete: function () {
				JSONP('http://priima-valmennus.apphb.com/api/facebook', 'callback', function (data) {
					NewsModule.init(data);
				});
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