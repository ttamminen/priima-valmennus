Modernizr.load([
	{
		load: 'js/vendor/responsive-nav.js',
		complete: function () {
			if(!responsiveNav) {
				throw new Error("Could not load responsive nav");
			}

			var nav = responsiveNav(".nav-collapse", {
				label: "☰ Menu"
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
		load: '/js/app.js',
		complete: function () {
			AppModule.init();
		}
	}
]);
