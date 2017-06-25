/* global Modernizr, responsiveNav, SliderModule, 
      TouchSliderModule, ContactFormModule, NewsModule, JSONP, _ */

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

  function initNav() {
    if(typeof responsiveNav === "undefined") {
      throw new Error("Could not load responsive nav");
    }

    var nav = document.getElementsByClassName('nav-collapse');
    if(nav.length === 0) 
    {
      return;
    }

    responsiveNav('.nav-collapse', {
      label: '☰ Menu'
    });

    var currentLocation = location.pathname;
    var links = document.querySelectorAll('.nav-collapse a');
    Utils.forEach(links, function (link) {
      if(link && link.getAttribute('href') === currentLocation) {
        Utils.addClass(link.parentNode, 'current-link');
      }
    })
  }

  function initContactForm() {
    ContactFormModule.init();
  }

  function initNews() {
    var socialmediaupdates = '.social-media-updates';
    if(document.querySelectorAll(socialmediaupdates).length === 0) {
      return;
    }

    JSONP('http://priimavalmennus-socialmedia.azurewebsites.net/api/facebook', function (data) {
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