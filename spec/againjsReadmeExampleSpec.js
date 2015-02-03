/*global Again,jasmine,describe,it,expect,beforeEach,afterEach*/
describe('Again README example', function () {
  'use strict';

  var noop = function () { /*empty*/
  };
  var update = noop;

  beforeEach(function () {
    update = jasmine.createSpy('update');

    jasmine.clock().install();

    //jasmine.clock().mockDate();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  /*
   console output should equal
   1000 : visible
   2000 : visible
   3000 : visible
   8000 : hidden
   13000: hidden
   18000: hidden
   21000: visible
   22000: visible
   23000: visible*/
  it('should run Example 01', function () {
    var again = Again.create();

    again.update('visible');

    again.every(update, {
      'visible': 1000,
      'hidden': 5000
    });

    jasmine.clock().tick(3000);

    expect(update.calls.count()).toEqual(3);

    again.update('hidden');

    jasmine.clock().tick(2000);

    expect(update.calls.count()).toEqual(3);

    jasmine.clock().tick(15000);

    expect(update.calls.count()).toEqual(6);

    again.update('visible');

    jasmine.clock().tick(3000);

    expect(update.calls.count()).toEqual(9);

  });


  it('should run Example 02 (with reinitializeOn)', function () {
    var again = Again.create({
      reinitializeOn: {
        'visible': true,
        'hidden': true
      }
    });

    again.every(update, {
      'visible': 1000,
      'hidden': 5000
    });


    again.update('visible');

    jasmine.clock().tick(3000);

    expect(update.calls.count()).toEqual(4);

    again.update('hidden');

    jasmine.clock().tick(1);

    expect(update.calls.count()).toEqual(5);

    jasmine.clock().tick(15000);

    expect(update.calls.count()).toEqual(8);

    again.update('visible');

    jasmine.clock().tick(3000);

    expect(update.calls.count()).toEqual(11);

  });

});
