/* global window */

/* exported ScrollModule */

var ScrollModule = (function (_) {
    "use strict";

    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last, deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
            } else {
            last = now;
            fn.apply(context, args);
            }
        };
    }

    function getElementOffset(element)
    {
        var de = document.documentElement;
        var box = element.getBoundingClientRect();
        var top = box.top + window.pageYOffset - de.clientTop;
        var left = box.left + window.pageXOffset - de.clientLeft;
        return { top: top, left: left };
    }

	return {
        init: function () {
            var reserve = document.getElementById('reserve-time-button');
            if(!reserve) {
                return;
            }
            var elementOffset = getElementOffset(reserve)
            window.onscroll = throttle(function() {
                if ((window.innerHeight + window.pageYOffset) > elementOffset.top) {
                    reserve.classList.add('service-reserve-time-fixed');
                } else {
                    reserve.classList.remove('service-reserve-time-fixed');
                }
            }, 100)
    	}
    };
})(window);