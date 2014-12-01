/* global Modernizr, responsiveNav, SliderModule, 
		  TouchSliderModule, ContactFormModule, NewsModule, ga,  JSONP, _ */

(function () {
	"use strict";

	function trackNav() {
		ga('send', 'event', 'button', 'click', 'navigation', this.text);
	}

	Modernizr.load([
		{
			load: 'js/vendor/responsive-nav.js',
			complete: function () {
				if(typeof responsiveNav === "undefined") {
					throw new Error("Could not load responsive nav");
				}

				var nav = document.getElementsByClassName('nav-collapse');
				if(nav.length === 0) 
				{
					return;
				}

				var links = nav[0].querySelectorAll('a');
				for(var i = 0 ; i < links.length - 1 ; i++) {
					links[i].addEventListener('click', trackNav);
				}

				responsiveNav('.nav-collapse', {
					label: '☰ Menu'
				});
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
			test: document.getElementById('contact-form') !== null,
			load: '/js/contactform.js',
			complete: function () {
				ContactFormModule.init();
			}
		},
		{
			load: '/js/news.js',
			complete: function () {
				var socialmediaupdates = '.social-media-updates';
				if(document.querySelectorAll(socialmediaupdates).length === 0) {
					return;
				}

				JSONP('http://priima-valmennus.apphb.com/api/facebook', 'callback', function (data) {
					NewsModule.init(data, socialmediaupdates);
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