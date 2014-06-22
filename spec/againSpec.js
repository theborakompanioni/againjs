/*global Again,jasmine,describe,it,expect,beforeEach,afterEach*/
describe('Again', function() {
    'use strict';

    var noop = function() { /*empty*/ };

    // TODO: uncomment this if jasmine supports mocking the Date object natively
    //it('should verify that jasmine mocks the Date object', function () {
    //    expect(jasmine.clock().mockDate).toBeDefined();
    //});

    it('should get the version of Again', function () {
        expect(Again.version).toBe('0.0.9');
    });

    it('should create an Again instance', function () {
        var again = Again.create({});

        expect(again).toBeDefined();
    });

    describe('Again.every()', function() {
        var again;

        beforeEach(function() {
            again = Again.create({});
        });

        it('should return consecutive timer ids', function () {
            var i, id;
            for(i = 0; i <= 1000; i++) {
                id = again.every(noop, {});
            }

            again.stopAll();

            expect(id).toEqual(1000);
        });

        it('should return the current state', function () {
            again.update('state1');

            var state = again.state();

            expect(state).toEqual('state1');
        });

        it('should return false when stopping unknown handlers', function () {
            var stopped = again.stop(1000);

            expect(stopped).toBe(false);
        });

        describe('Again.every() async', function() {
            var update = noop;
            var update2 = noop;
            var update3 = noop;

            beforeEach(function() {
                update = jasmine.createSpy('update');
                update2 = jasmine.createSpy('update2');
                update3 = jasmine.createSpy('update3');

                jasmine.clock().install();

                //jasmine.clock().mockDate();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should attach and remove a handler', function () {
                var id = again.every(update, {});
                var stopped = again.stop(id);

                expect(stopped).toBe(true);
            });

            it('should invoke handler once', function () {
                again.every(update, {
                    '100': 100
                });
                again.update('100');

                expect(update).not.toHaveBeenCalled();

                jasmine.clock().tick(101);

                expect(update).toHaveBeenCalled();
            });

            it('should invoke handler twice', function () {
                again.every(update, {
                    '100': 100
                });

                again.update('100');

                expect(update).not.toHaveBeenCalled();

                jasmine.clock().tick(201);

                expect(update.calls.count()).toEqual(2);
            });

            it('should deregister handler correctly', function () {
                var id = again.every(update, {
                    '10': 10
                });

                again.update('10');

                expect(update).not.toHaveBeenCalled();

                jasmine.clock().tick(1001);

                expect(update.calls.count()).toEqual(100);

                var stopped = again.stop(id);

                expect(stopped).toBe(true);

                jasmine.clock().tick(1001);

                expect(update.calls.count()).toEqual(100);

            });

            it('should call corresponding handler on state change (2 states)', function () {
                var id = again.every(update, {
                    '10': 10,
                    '*': 20
                });

                var id2 = again.every(update2, {
                    '10': 10
                });

                var id3 = again.every(update3, {
                    '20': 20
                });
                again.update('10');

                expect(update).not.toHaveBeenCalled();
                expect(update2).not.toHaveBeenCalled();
                expect(update3).not.toHaveBeenCalled();

                jasmine.clock().tick(11);

                expect(update.calls.count()).toEqual(1);
                expect(update2.calls.count()).toEqual(1);
                expect(update3.calls.count()).toEqual(0);

                again.update('20');

                jasmine.clock().tick(21);

                expect(update.calls.count()).toEqual(2);
                expect(update2.calls.count()).toEqual(1);
                expect(update3.calls.count()).toEqual(1);

                var allStopped = again.stop(id) && again.stop(id2) && again.stop(id3);

                expect(allStopped).toBe(true);

            });


            it('should call corresponding handler on state change (3 states)', function () {
                var id = again.every(update, {
                    '10': 10,
                    '20': 20
                });

                var id2 = again.every(update2, {
                    '10': 10,
                    '40': 40
                });

                var id3 = again.every(update3, {
                    '20': 20,
                    '40': 40
                });

                again.update('10');

                expect(update).not.toHaveBeenCalled();
                expect(update2).not.toHaveBeenCalled();
                expect(update3).not.toHaveBeenCalled();

                jasmine.clock().tick(11);

                expect(update.calls.count()).toEqual(1);
                expect(update2.calls.count()).toEqual(1);
                expect(update3.calls.count()).toEqual(0);

                again.update('20');

                jasmine.clock().tick(21);

                expect(update.calls.count()).toEqual(2);
                expect(update2.calls.count()).toEqual(1);
                expect(update3.calls.count()).toEqual(1);

                again.update('40');

                jasmine.clock().tick(41);

                expect(update.calls.count()).toEqual(2);
                expect(update2.calls.count()).toEqual(2);
                expect(update3.calls.count()).toEqual(2);

                var allStopped = again.stop(id) && again.stop(id2) && again.stop(id3);

                expect(allStopped).toBe(true);

            });

            it('should idle on non-existing state updates', function () {
                var id = again.every(update, {
                    '10': 10
                });

                again.update('10');

                expect(update).not.toHaveBeenCalled();

                jasmine.clock().tick(11);

                expect(update.calls.count()).toEqual(1);

                again.update('undefined');

                jasmine.clock().tick(21);

                expect(update.calls.count()).toEqual(1);

                again.update('false');

                jasmine.clock().tick(41);

                expect(update.calls.count()).toEqual(1);

                again.update('10');

                jasmine.clock().tick(91);

                expect(update.calls.count()).toEqual(10);

                var stopped = again.stop(id);

                expect(stopped).toBe(true);

            });

        });


    });


    describe('Again.every() reinitializeOn', function() {
        var again;
        var update = noop;
        var update2 = noop;
        var update3 = noop;

        beforeEach(function() {
            again = Again.create({
                reinitializeOn: {
                    '10': false,
                    '20': true
                }
            });
            update = jasmine.createSpy('update');
            update2 = jasmine.createSpy('update2');
            update3 = jasmine.createSpy('update3');

            jasmine.clock().install();

            //jasmine.clock().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should reinitialize immediately on state change (3 states)', function () {
            var id = again.every(update, {
                '10': 10,
                '20': 20
            });

            var id2 = again.every(update2, {
                '10': 10
            });

            var id3 = again.every(update3, {
                '20': 20
            });

            again.update('10');

            expect(update).not.toHaveBeenCalled();
            expect(update2).not.toHaveBeenCalled();
            expect(update3).not.toHaveBeenCalled();

            jasmine.clock().tick(11);

            expect(update.calls.count()).toEqual(1);
            expect(update2.calls.count()).toEqual(1);
            expect(update3.calls.count()).toEqual(0);

            again.update('20');

            expect(update.calls.count()).toEqual(2);
            expect(update2.calls.count()).toEqual(1);
            expect(update3.calls.count()).toEqual(1);

            jasmine.clock().tick(11);

            expect(update.calls.count()).toEqual(2);
            expect(update2.calls.count()).toEqual(1);
            expect(update3.calls.count()).toEqual(1);

            jasmine.clock().tick(11);

            expect(update.calls.count()).toEqual(3);
            expect(update2.calls.count()).toEqual(1);
            expect(update3.calls.count()).toEqual(2);

            var allStopped = again.stop(id) && again.stop(id2) && again.stop(id3);

            expect(allStopped).toBe(true);

        });

        /*it('should reinitialize immediately on state change (3 states)', function () {

            var id = again.every(update, {
                '10': 10,
                '20': 20
            });
            again.update('10');

            // nothing should be invoked
            expect(update).not.toHaveBeenCalled();

            jasmine.clock().tick(11); // now state '10' should have been invoked

            console.log(jasmine.clock().tick(1));

            expect(update.calls.count()).toEqual(1);

            jasmine.clock().tick(5);

            again.update('20'); // should run immediately

            expect(update.calls.count()).toEqual(2);

            jasmine.clock().tick(11);

            again.update('10');

            expect(update.calls.count()).toEqual(2);

            jasmine.clock().tick(5); // nothing should run in the meantime

            expect(update.calls.count()).toEqual(2);

            again.update('20'); // should NOT run because the last run was only 16ms ago

            expect(update.calls.count()).toEqual(2);
            jasmine.clock().tick(6); // now '20' should have been invoked

            expect(update.calls.count()).toEqual(3);

            var stopped = again.stop(id);

            expect(stopped).toBe(true);
        });*/
    });
});