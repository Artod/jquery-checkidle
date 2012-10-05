/*
* jQuery CheckIdle
* 05.10.2012 (c) http://artod.ru
*/

;(function($) {
	'use strict';

    var CheckIdle = function($els, options) {
		this.opts = $.extend({
			discret: 1000,
			idleAfter: 5*60000,
			autoStart: true,
			events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove',
			onIdle: function() { },
			onReturn: function() { }
        }, options);

		this.$els = $els;
		this.interval = null;
		this.timer = 0;
		this.isIdle = false;
		this.callbacksOnWait = [];
		this.timeoutsOnWait = [];

		if (this.opts.autoStart) {
			this.start();
		}
	};

	CheckIdle.prototype = {
		start: function() {
			this.stop();

			var self = this;
			this.interval = setInterval(function() {
				self.timer += self.opts.discret;
				self.check();
			}, this.opts.discret);

			this.$els.on($.trim( (this.opts.events + ' ').split(' ').join('.checkIdle ') ), function() {
				self.reset();
			});

			this.check();

			return this;
		},
		stop: function() {
			this.$els.off('.checkIdle');
			clearInterval(this.interval);
			this.clearTimeoutsOnWait();

			return this;
		},
		check: function() {
			if (!this.isIdle && this.timer >= this.opts.idleAfter) {
				this.isIdle = true;

				this.setTimeoutsOnWait();
				this.opts.onIdle();
			}
		},
		reset: function() {
			if (this.isIdle) {
				this.isIdle = false;
				this.clearTimeoutsOnWait();
				this.opts.onReturn(this.timer);
			}

			this.timer = 0;
		},
		setTimeoutsOnWait: function() {
			this.clearTimeoutsOnWait();

			var self = this;
			for (var i = 0; i < this.callbacksOnWait.length; i++) {
				(function() {
					var j = i;
					self.timeoutsOnWait.push(setTimeout(function() {
						self.callbacksOnWait[j][1]();
					}, self.callbacksOnWait[j][0]));
				})();
			}

			return this;
		},
		clearTimeoutsOnWait: function() {
			for (var i = 0; i < this.timeoutsOnWait.length; i++) {
				clearTimeout(this.timeoutsOnWait[i]);
			}

			return this;
		},
		onWait: function(timeout, callback) {
			this.callbacksOnWait.push([timeout, callback]);

			return this;
		}
	};

    $.checkIdle = function($els, options) {
		return new CheckIdle($els, options);
    };
})(jQuery);