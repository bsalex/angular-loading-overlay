(function () {
  "use strict";

  ngDescribe({
    name: 'bsLoadingOverlayService interface',
    modules: 'bsLoadingOverlay',
    inject: ['$rootScope', 'bsLoadingOverlayService', '$q'],
    tests: function (dependencies) {
      it("should exist", function () {
        expect(dependencies.bsLoadingOverlayService).toBeDefined();
      });

      describe("handlers", function () {
        var overlayHandler,
          referenceId;

        beforeEach(function () {
          referenceId = 'referenceId';
          overlayHandler = dependencies.bsLoadingOverlayService.createHandler({
            referenceId: referenceId
          });
        });

        it("should emit rootScope event on start with referenceId in options", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
            expect(options.referenceId).toEqual(referenceId);
            done();
          });

          overlayHandler.start();
        });

        it("should emit rootScope event on stop with referenceId in options", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
            expect(options.referenceId).toEqual(referenceId);
            done();
          });

          overlayHandler.stop();
        });
      });

      describe("wrapper", function () {
        var overlayHandler,
          referenceId,
          func1,
          func2,
          func1Spy,
          func2Spy,
          startSpy,
          stopSpy,
          t;

        beforeEach(function () {
          referenceId = 'referenceId';

          func1 = function () {
            return dependencies.$q.when(1);
          };

          func2 = function () {
            return dependencies.$q.when(2);
          };
          t = {
            func1: func1,
            func2: func2
          };
          func1Spy = sinon.spy(t, 'func1');
          func2Spy = sinon.spy(t, 'func2');
          startSpy = sinon.spy(dependencies.bsLoadingOverlayService, 'start');
          stopSpy = sinon.spy(dependencies.bsLoadingOverlayService, 'stop');
        });

        it("should wrap provided function returning promise in start and stop functions", function () {
          dependencies.$rootScope.$apply(function () {
            dependencies.bsLoadingOverlayService.wrap(function () {
              return t.func1().then(t.func2);
            }, {
              referenceId: referenceId
            });
          });

          expect(startSpy.calledBefore(func1Spy)).toBeTruthy();
          expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
          expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
          expect(stopSpy.called).toBeTruthy();
        });

        it("should wrap provided promise in start and stop functions", function () {
          dependencies.$rootScope.$apply(function () {
            dependencies.bsLoadingOverlayService.wrap(t.func1().then(t.func2), {
              referenceId: referenceId
            });
          });

          expect(startSpy.calledBefore(stopSpy)).toBeTruthy();
          expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
          expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
          expect(stopSpy.called).toBeTruthy();
        });

        it("should hide overlay if provided promise failed", function () {
          dependencies.$rootScope.$apply(function () {
            dependencies.bsLoadingOverlayService.wrap(function () {
              return dependencies.$q.reject();
            }, {
              referenceId: referenceId
            });
          });

          expect(stopSpy.called).toBeTruthy();
        });
      });

      describe("global config", function () {
        it("should be able to set and get global config", function () {
          var config = {
            option1: 1,
            option2: 2
          };

          dependencies.bsLoadingOverlayService.setGlobalConfig(config);

          expect(dependencies.bsLoadingOverlayService.getGlobalConfig()).toEqual(config);
        });

        it("should return global empty object as global config by default", function () {
          expect(dependencies.bsLoadingOverlayService.getGlobalConfig()).toEqual({});
        });

        it("should extend global config", function () {
          var config = {
            option1: 1,
            option2: 2
          };

          var extendedConfig = {
            option1: 1,
            option2: 2,
            option3: 3
          };

          dependencies.bsLoadingOverlayService.setGlobalConfig(config);
          dependencies.bsLoadingOverlayService.setGlobalConfig({
            option3: 3
          });

          expect(dependencies.bsLoadingOverlayService.getGlobalConfig()).toEqual(extendedConfig);
        });
      });

      describe("handler wrapper", function () {
        var overlayHandler,
          referenceId,
          func1,
          func2,
          func1Spy,
          func2Spy,
          startSpy,
          stopSpy,
          t,
          handler;

        beforeEach(function () {
          referenceId = 'referenceId';

          func1 = function () {
            return dependencies.$q.when(1);
          };

          func2 = function () {
            return dependencies.$q.when(2);
          };
          t = {
            func1: func1,
            func2: func2
          };
          func1Spy = sinon.spy(t, 'func1');
          func2Spy = sinon.spy(t, 'func2');
          handler = dependencies.bsLoadingOverlayService.createHandler({
            referenceId: referenceId
          });

          startSpy = sinon.spy(dependencies.bsLoadingOverlayService, 'start');
          stopSpy = sinon.spy(dependencies.bsLoadingOverlayService, 'stop');
        });

        it("should wrap provided function returning promise in start and stop functions", function () {
          dependencies.$rootScope.$apply(function () {
            handler.wrap(function () {
              return t.func1().then(t.func2);
            });
          });

          expect(startSpy.calledBefore(func1Spy)).toBeTruthy();
          expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
          expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
          expect(stopSpy.called).toBeTruthy();
        });

        it("should wrap provided promise in start and stop functions", function () {
          dependencies.$rootScope.$apply(function () {
            handler.wrap(t.func1().then(t.func2), {
              referenceId: referenceId
            });
          });

          expect(startSpy.calledBefore(stopSpy)).toBeTruthy();
          expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
          expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
          expect(stopSpy.called).toBeTruthy();
        });

        it("should hide overlay if provided promise failed", function () {
          dependencies.$rootScope.$apply(function () {
            handler.wrap(function () {
              return dependencies.$q.reject();
            });
          });

          expect(stopSpy.called).toBeTruthy();
        });
      });

      describe("without referenceId", function () {
        it("should emit rootScope event on start", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function () {
            done();
          });

          dependencies.bsLoadingOverlayService.start();
        });

        it("should indicate that loadingOverlay is active after start", function () {
          dependencies.bsLoadingOverlayService.start();

          expect(dependencies.bsLoadingOverlayService.isActive()).toBeTruthy();
        });

        it("should indicate that loadingOverlay is not active by default", function () {
          expect(dependencies.bsLoadingOverlayService.isActive()).toBeFalsy();
        });

        it("should indicate that loadingOverlay is not active after stop", function () {
          dependencies.bsLoadingOverlayService.start();
          dependencies.bsLoadingOverlayService.stop();

          expect(dependencies.bsLoadingOverlayService.isActive()).toBeFalsy();
        });

        it("should emit rootScope event on stop", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function () {
            done();
          });

          dependencies.bsLoadingOverlayService.stop();
        });
      });

      describe("with referenceId", function () {
        var referenceId;
        beforeEach(function () {
          referenceId = 'referenceId';
        });

        it("should emit rootScope event on start", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function () {
            done();
          });

          dependencies.bsLoadingOverlayService.start({
            referenceId: referenceId
          });
        });

        it("should emit rootScope event on stop", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function () {
            done();
          });

          dependencies.bsLoadingOverlayService.stop({
            referenceId: referenceId
          });
        });

        it("should emit rootScope event on start with referenceId in options", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
            expect(options.referenceId).toEqual(referenceId);
            done();
          });

          dependencies.bsLoadingOverlayService.start({
            referenceId: referenceId
          });
        });

        it("should emit rootScope event on stop with referenceId in options", function (done) {
          dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
            expect(options.referenceId).toEqual(referenceId);
            done();
          });

          dependencies.bsLoadingOverlayService.stop({
            referenceId: referenceId
          });
        });

        it("should not make other references active on start", function () {
          dependencies.bsLoadingOverlayService.start({
            referenceId: referenceId
          });

          expect(dependencies.bsLoadingOverlayService.isActive('otherReference')).toBeFalsy();
        });

        it("should not be marked as active on other reference start", function () {
          dependencies.bsLoadingOverlayService.start({
            referenceId: 'otherReference'
          });

          expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeFalsy();
        });

        it("should not stop other references on stop", function () {
          dependencies.bsLoadingOverlayService.start({
            referenceId: referenceId
          });

          dependencies.bsLoadingOverlayService.start({
            referenceId: 'otherReference'
          });

          dependencies.bsLoadingOverlayService.stop({
            referenceId: referenceId
          });

          expect(dependencies.bsLoadingOverlayService.isActive('otherReference')).toBeTruthy();
        });

        it("should indicate that loadingOverlay is active after start", function () {
          dependencies.bsLoadingOverlayService.start({
            referenceId: referenceId
          });

          expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeTruthy();
        });

        it("should indicate that loadingOverlay is not active by default", function () {
          expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeFalsy();
        });

        it("should indicate that loadingOverlay is not active after stop", function () {
          dependencies.bsLoadingOverlayService.start({
            referenceId: referenceId
          });
          dependencies.bsLoadingOverlayService.stop({
            referenceId: referenceId
          });

          expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeFalsy();
        });
      });

    }
  });
})();
