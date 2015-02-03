/*! { "name": "againjs", "version": "0.1.0", "homepage": "https://github.com/theborakompanioni/againjs","copyright": "(c) 2015 theborakompanioni" } */
!function(window, factory) {
    "use strict";
    window.Again = factory();
}(this, function(undefined) {
    "use strict";
    function now() {
        return new Date().getTime();
    }
    function cancel(timer) {
        clearInterval(timer.intervalId), clearTimeout(timer.delay), delete timer.intervalId, 
        delete timer.delay;
    }
    function run(timer, interval, state, runNow) {
        var runner = function() {
            timer.last[state] = now(), timer.callback();
        };
        if (runNow) {
            var last = now() - timer.last[state];
            if (interval > last) {
                var delay = interval - last;
                timer.delay = setTimeout(function() {
                    runner(), timer.intervalId = setInterval(runner, interval);
                }, delay);
            } else setTimeout(function() {
                runner();
            }, 0), timer.intervalId = setInterval(runner, interval);
        } else timer.intervalId = setInterval(runner, interval);
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
            name: (Math.random() + 1).toString(36).substring(3, 9),
            callback: callback,
            intervals: intervals,
            delay: undefined,
            intervalId: undefined,
            last: {}
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