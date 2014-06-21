;(function(window, undefined) {
    'use strict';
    var version = '0.0.9';

    function cancel(timer) {
        clearInterval(timer.id);
        clearTimeout(timer.delay);
        delete timer.id;
        delete timer.delay;
    }

    function run(timer, interval, runNow) {
        var runner = function () {
            timer.last = new Date();
            timer.callback();
        };

        if ( runNow ) {
            var now  = new Date();
            var last = now - timer.last;

            if ( interval > last ) {
                timer.delay = setTimeout(function () {
                    runner();
                    timer.id = setInterval(runner, interval);
                }, interval - last);
            } else {
                runner();
                timer.id = setInterval(runner, interval);
            }

        } else {
          timer.id = setInterval(runner, interval);
        }
    }
    /*--------------------------------------------------------------------------*/

    function Again(config) {
        var me = this;

        me._$$lastTimerId = -1;
        me._$$timers = {};
        me._$$initialized = false;
        me._$$config = config || {};

        me._$$state = null;
        
        this._$$config.reinitializeImmediatelyOn = this._$$config.reinitializeImmediatelyOn || {};
    }

    Again.prototype.state = function() {
        return this._$$state;
    };

    Again.prototype.update = function(state) {
        this._$$state = state;
        this._cancelAndReinitialize();
    };

    Again.prototype.every = function (callback, stateIntervals) {
        this._$$lastTimerId += 1;
        var id = this._$$lastTimerId;

        this._$$timers[id] = {
            callback: callback,
            intervals: stateIntervals
        };

        this._run(id, false);

        return id;
    };

    Again.prototype.stop = function(id) {
        if ( !this._$$timers[id] ) {
            return false;
        }
        cancel(this._$$timers[id]);
        delete this._$$timers[id];
        return true;
    };

    Again.prototype.stopAll = function() {
        for (var id in this._$$timers) {
            if(this._$$timers.hasOwnProperty(id)) {
                cancel(this._$$timers[id]);
            }
        }
        this._$$timers = {};
    };

    Again.prototype._run = function(id, runNow) {
        var timer = this._$$timers[id];

        // interval is NaN if no state or no corresponding interval
        var interval = +timer.intervals[this._$$state];

        if(interval > 0) {
            run(timer, interval, !!runNow);
        }
    };

    Again.prototype._cancelAndReinitialize = function() {
        var runNow = !!this._$$config.reinitializeImmediatelyOn[this._$$state];

        for (var id in this._$$timers) {
            if(this._$$timers.hasOwnProperty(id)) {
                cancel(this._$$timers[id]);
                this._run(id, runNow);
            }
        }
    };

    window.Again = function(config) {
        return new Again(config || {});
    };

    window.Again.version = version;
    window.Again.create = window.Again;

}(window));