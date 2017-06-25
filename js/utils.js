/* exported Utils */

var Utils = (function () {
  "use strict";

  return {
    addClass: function (el, className) {
      if (el.classList) { 
        el.classList.add(className);
      }
      else {
          el.className += ' ' + className;
      }
    },

    removeClass: function (el, className) {
      if (el.classList) {
          el.classList.remove(className);
        }
      else {
          el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    },

    forEach: function (array, fn) {
      for (var i = 0; i < array.length; i++)
        fn(array[i], i);
    },

    getJSON: function (url, successCallback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function() {
        if (this.status >= 200 && this.status < 400){
          // Success!
          var data = JSON.parse(this.response);
          successCallback(data);
        } else {
          console.log("Ajax request failed");
        }
      };

      request.onerror = function() {
          console.log("Ajax request failed");
      };

      request.send();		
    }
  };
})();