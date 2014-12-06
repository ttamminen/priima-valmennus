/* global Modernizr, responsiveNav, SliderModule, 
		  TouchSliderModule, ContactFormModule, NewsModule, ga,  JSONP, _ */

function ready(fn) {
	"use strict";
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', fn);
	} else {
	document.attachEvent('onreadystatechange', function() {
		if (document.readyState === 'interactive')
			fn();
		});
	}
}

function boot() {
	"use strict";

	function trackNav() {
		ga('send', 'event', 'button', 'click', 'navigation', this.text);
	}

	function initNav() {
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

	function initContactForm() {
		ContactFormModule.init();
	}

	function initNews() {
		var socialmediaupdates = '.social-media-updates';
		if(document.querySelectorAll(socialmediaupdates).length === 0) {
			return;
		}

		JSONP('http://priima-valmennus.apphb.com/api/facebook', function (data) {
			NewsModule.init(data, socialmediaupdates);
		});		
	}

	function initSlider() {
		if(Modernizr.touch) {
			TouchSliderModule.init();
		}
		else {
			SliderModule.init();
		}
	}

	function init() {
		initNav();
		initNews();
		initContactForm();		
		initSlider();
	}

	init();
}

ready(boot);