/*
* jQuery CheckIdle
* 04.10.2012 (c) http://artod.ru
*/

;(function($) {
	'use strict';

    var CheckIdle = function($els, options) {
		this.opts = $.extend({
			discret: 1000,
			timeoutIdle: 5*60000,
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
		this.tmpCallbacksOnWait = [];

		if (this.opts.autoStart) {
			this.start();
		}
	};

	CheckIdle.prototype = {
		check: function() {
			if (this.isIdle) {
				this.triggerOnWait();
			} else if (this.timer >= this.opts.timeoutIdle) {
				this.isIdle = true;
				this.tmpCallbacksOnWait = [].concat(this.callbacksOnWait);
				this.opts.onIdle();
			}
		},
		reset: function() {
			if (this.isIdle) {
				this.isIdle = false;
				this.onReturn(this.timer);
			}

			this.timer = 0;
		},
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
		},
		stop: function() {
			this.$els.off('.checkIdle');
			clearInterval(this.interval);
		},
		triggerOnWait: function() {
			if (!this.tmpCallbacksOnWait.length) {
				return;
			}

			for (var i = 0; i < this.tmpCallbacksOnWait.length; i++) {
				if (this.timer >= this.tmpCallbacksOnWait[i][0]) {
					this.tmpCallbacksOnWait[i][1]();
					this.tmpCallbacksOnWait.splice(i,1);
				}
			}
		},
		onWait: function(timeout, callback) {
			this.callbacksOnWait.push([timeout, callback]);
			return this;
		},
		onReturn: function(timeOnIdle) {
			this.opts.onReturn(timeOnIdle);
		}
	};

    $.checkIdle = function($els, options) {
		return new CheckIdle($els, options);
    };
})(jQuery);