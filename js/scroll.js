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

	return {
        init: function () {
            var reserve = document.getElementById('reserve-time-button');
            if(!reserve) {
                return;
            }
            window.onscroll = throttle(function() {
                if (window.pageYOffset > 400) {
                    reserve.classList.add('service-reserve-time-visible');
                } else {
                    reserve.classList.remove('service-reserve-time-visible');
                }
            }, 100)
    	}
    };
})(window);