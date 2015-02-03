/*! { "name": "againjs", "version": "0.0.11", "homepage": "https://github.com/theborakompanioni/againjs","copyright": "(c) 2015 theborakompanioni" } */
!function(window, factory) {
    "use strict";
    window.Again = factory();
}(this, function() {
    "use strict";
    function now() {
        return new Date().getTime();
    }
    function cancel(timer) {
        clearInterval(timer.id), clearTimeout(timer.delay), delete timer.id, delete timer.delay;
    }
    function run(timer, interval, state, runNow) {
        var runner = function() {
            timer.last[state] = now(), timer.callback();
        };
        if (timer.last = timer.last || {}, runNow) {
            var last = now() - timer.last[state];
            interval > last ? timer.delay = setTimeout(function() {
                runner(), timer.id = setInterval(runner, interval);
            }, interval - last) : (setTimeout(function() {
                runner();
            }, 0), timer.id = setInterval(runner, interval));
        } else timer.id = setInterval(runner, interval);
    }
    function Again(config) {
        return this instanceof Again ? (this._state = null, this._timers = [], this._config = config || {}, 
        void (this._config.reinitializeOn = this._config.reinitializeOn || {})) : new Again(config);
    }
    return Again.prototype.state = function() {
        return this._state;
    }, Again.prototype.update = function(state) {
        this._state = state, this._cancelAndReinitialize();
    }, Again.prototype.every = function(callback, stateIntervals, runNow) {
        var intervals = stateIntervals;
        parseFloat(stateIntervals) === stateIntervals && (intervals = {
            "*": parseFloat(stateIntervals)
        });
        var timer = {
            callback: callback,
            intervals: intervals
        };
        this._timers.push(timer), this._run(timer, !!runNow);
        var me = this;
        return function() {
            var index = me._timers.indexOf(timer);
            return index > -1 ? (cancel(me._timers[index]), me._timers.splice(index, 1), !0) : !1;
        };
    }, Again.prototype.cancelAll = function() {
        for (var i = 0, n = this._timers.length; n > i; i++) cancel(this._timers[i]);
        return !0;
    }, Again.prototype.unregisterAll = function() {
        return this.cancelAll(), this._timers = [], !0;
    }, Again.prototype._run = function(timer, runNow) {
        var interval = +timer.intervals[this._state] || +timer.intervals["*"];
        interval > 0 && run(timer, interval, this._state, !!runNow);
    }, Again.prototype._cancelAndReinitialize = function() {
        for (var runNow = !!this._config.reinitializeOn[this._state], i = 0, n = this._timers.length; n > i; i++) {
            var timer = this._timers[i];
            cancel(timer), this._run(timer, runNow);
        }
    }, Again.create = Again, Again;
});