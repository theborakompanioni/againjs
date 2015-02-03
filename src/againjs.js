(function(window, factory) {
  'use strict';
  window.Again = factory();
}) (this, function (undefined) {
  'use strict';

  function now () {
    return new Date().getTime();
  }

  function cancel(timer) {
    clearInterval(timer.id);
    clearTimeout(timer.delay);
    delete timer.id;
    delete timer.delay;
  }

  function run(timer, interval, state, runNow) {
    var runner = function () {
      timer.last[state] = now();
      timer.callback();
    };

    timer.last = timer.last || {};

    if (!runNow) {
      timer.id = setInterval(runner, interval);
    } else {
      var last = now() - timer.last[state];

      if (interval > last) {
        timer.delay = setTimeout(function () {
          runner();
          timer.id = setInterval(runner, interval);
        }, interval - last);
      } else {
        setTimeout(function () {
          runner();
        }, 0);
        timer.id = setInterval(runner, interval);
      }
    }
  }

  /*--------------------------------------------------------------------------*/

  function Again(config) {
    if (!(this instanceof Again)) {
      return new Again(config);
    }

    this._state = null;
    this._timers = [];
    this._config = config || {};
    this._config.reinitializeOn = this._config.reinitializeOn || {};
  }

  Again.prototype.state = function () {
    return this._state;
  };

  Again.prototype.update = function (state) {
    this._state = state;
    this._cancelAndReinitialize();
  };

  Again.prototype.every = function (callback, stateIntervals, runNow) {
    var intervals = stateIntervals;

    // handle every(function() { ... }, 1000)
    if (parseFloat(stateIntervals) === stateIntervals) {
      intervals = {
        '*': parseFloat(stateIntervals)
      };
    }

    var timer = {
      callback: callback,
      intervals: intervals
    };

    this._timers.push(timer);

    this._run(timer, !!runNow);

    var me = this;
    return function unregister () {
      var index = me._timers.indexOf(timer);

      if (index > -1) {
        cancel(me._timers[index]);

        console.debug('Unregistering timer on index %i', index);

        me._timers.splice(index, 1);

        console.debug('%i timers left', me._timers.length);

        return true;
      }

      return false;
    };
  };

  Again.prototype.cancelAll = function () {
    console.debug('Stopping all %i timers', this._timers.length);
    for (var i = 0, n = this._timers.length; i < n; i++) {
      cancel(this._timers[i]);
    }
    return true;
  };

  Again.prototype.unregisterAll = function () {
    console.debug('Unregistering all %i timers', this._timers.length);
    this.cancelAll();
    this._timers = [];
    return true;
  };

  Again.prototype._run = function (timer, runNow) {
    // interval is NaN if no state or no corresponding interval
    var interval = +timer.intervals[this._state] || +timer.intervals['*'];

    if (interval > 0) {
      run(timer, interval, this._state, !!runNow);
    }
  };

  Again.prototype._cancelAndReinitialize = function () {
    var runNow = !!this._config.reinitializeOn[this._state];
    for (var i = 0, n = this._timers.length; i < n; i++) {
      var timer = this._timers[i];
      cancel(timer);
      this._run(timer, runNow);
    }
  };

  Again.create = Again;

  return Again;
});
