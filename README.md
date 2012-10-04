jQuery CheckIdle
========

Copyright (c) 2012 Artod - gartod@gmail.com

Demo
----------

http://artod.ru/check-idle/demo/

How to use
----------

To get started, download the plugin, unzip it and copy files to your website/application directory.
Load files in the 'head' section of your HTML document. Make sure you also add the jQuery library.

    <head>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script src="jquery.check-idle.js"></script>
    </head>

Initialise the script like this:

    <script>
        $(document).ready(function() {
			var checkIdle = $.checkIdle($(document), {
				onIdle: function() {
					alert('onIdle!');
				},
				onReturn: function() {
					alert('onReturn!');
				}
			});
        });
    </script>

May also be passed an optional options object which will extend the default values. Example:

    <script>
        $(document).ready(function() {
			var checkIdle = $.checkIdle($(document), {
				discret: 1000, // frequency of checking
				timeoutIdle: 5*60000,
				autoStart: false,
				events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove',
				onIdle: function() {
					alert('onIdle!');
				},
				onReturn: function() {
					alert('onReturn!');
				}
			});

			checkIdle.start();
        });
    </script>

You can create multiple handlers for any period of time:

    <script>
        $(document).ready(function() {
			var checkIdle = $.checkIdle($(document));
			
			checkIdle.onWait(5*60000, function() {
				alert('onWait 5 minutes!');
			}).onWait(20*60000, function() {
				alert('onWait 20 minutes!');
			}).onWait(60*60000, function() {
				alert('onWait 1 hour!');
			});
        });
    </script>