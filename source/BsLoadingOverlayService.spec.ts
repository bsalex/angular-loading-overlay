import BsLoadingOverlayModule from './BsLoadingOverlayModule';
import {BsLoadingOverlayService} from './BsLoadingOverlayService';

declare var ngDescribe: (testDescriptions: any) => void;

ngDescribe({
    name: 'bsLoadingOverlayService interface',
    modules: BsLoadingOverlayModule.name,
    inject: ['$rootScope', 'bsLoadingOverlayService', '$q'],
    tests: function(dependencies: {
        bsLoadingOverlayService: BsLoadingOverlayService,
        $rootScope: ng.IRootScopeService,
        $q: ng.IQService
    }) {
        it('should exist', () => {
            expect(dependencies.bsLoadingOverlayService).toBeDefined();
        });

        describe('handlers', () => {
            let overlayHandler,
                referenceId;

            beforeEach(() => {
                referenceId = 'referenceId';
                overlayHandler = dependencies.bsLoadingOverlayService.createHandler({
                    referenceId
                });
            });

            it('should emit rootScope event on start with referenceId in options', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', (event, options) => {
                    expect(options.referenceId).toEqual(referenceId);
                    done();
                });

                overlayHandler.start();
            });

            it('should emit rootScope event on stop with referenceId in options', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', (event, options) => {
                    expect(options.referenceId).toEqual(referenceId);
                    done();
                });

                overlayHandler.stop();
            });
        });

        describe('wrapper', () => {
            let overlayHandler,
                referenceId,
                func1,
                func2,
                func1Spy,
                func2Spy,
                startSpy,
                stopSpy,
                t;

            beforeEach(() => {
                referenceId = 'referenceId';

                func1 = () => {
                    return dependencies.$q.when(1);
                };

                func2 = () => {
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

            it('should wrap provided function returning promise in start and stop functions', () => {
                dependencies.$rootScope.$apply(() => {
                    dependencies.bsLoadingOverlayService.wrap({
                        referenceId
                    }, () => {
                        return t.func1().then(t.func2);
                    });
                });

                expect(startSpy.calledBefore(func1Spy)).toBeTruthy();
                expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
                expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
                expect(stopSpy.called).toBeTruthy();
            });

            it('should wrap provided promise in start and stop functions', () => {
                dependencies.$rootScope.$apply(() => {
                    dependencies.bsLoadingOverlayService.wrap({
                        referenceId
                    }, t.func1().then(t.func2));
                });

                expect(startSpy.calledBefore(stopSpy)).toBeTruthy();
                expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
                expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
                expect(stopSpy.called).toBeTruthy();
            });

            it('should hide overlay if provided promise failed', () => {
                dependencies.$rootScope.$apply(() => {
                    dependencies.bsLoadingOverlayService.wrap({
                            referenceId
                        }, () => {
                        return dependencies.$q.reject();
                    });
                });

                expect(stopSpy.called).toBeTruthy();
            });
        });

        describe('global config', () => {
            it('should be able to set and get global config', () => {
                const config = {
                    option1: 1,
                    option2: 2
                };

                dependencies.bsLoadingOverlayService.setGlobalConfig(config);

                expect(dependencies.bsLoadingOverlayService.getGlobalConfig()).toEqual(config);
            });

            it('should return global empty object as global config by default', () => {
                expect(dependencies.bsLoadingOverlayService.getGlobalConfig()).toEqual({});
            });

            it('should extend global config', () => {
                const config = {
                    option1: 1,
                    option2: 2
                };

                const extendedConfig = {
                    option1: 1,
                    option2: 2,
                    templateUrl: 'templateUrl'
                };

                dependencies.bsLoadingOverlayService.setGlobalConfig(config);
                dependencies.bsLoadingOverlayService.setGlobalConfig({
                    templateUrl: 'templateUrl'
                });

                expect(dependencies.bsLoadingOverlayService.getGlobalConfig()).toEqual(extendedConfig);
            });
        });

        describe('handler wrapper', () => {
            let overlayHandler,
                referenceId,
                func1,
                func2,
                func1Spy,
                func2Spy,
                startSpy,
                stopSpy,
                t,
                handler;

            beforeEach(() => {
                referenceId = 'referenceId';

                func1 = () => {
                    return dependencies.$q.when(1);
                };

                func2 = () => {
                    return dependencies.$q.when(2);
                };
                t = {
                    func1: func1,
                    func2: func2
                };
                func1Spy = sinon.spy(t, 'func1');
                func2Spy = sinon.spy(t, 'func2');
                handler = dependencies.bsLoadingOverlayService.createHandler({
                    referenceId
                });

                startSpy = sinon.spy(dependencies.bsLoadingOverlayService, 'start');
                stopSpy = sinon.spy(dependencies.bsLoadingOverlayService, 'stop');
            });

            it('should wrap provided function returning promise in start and stop functions', () => {
                dependencies.$rootScope.$apply(() => {
                    handler.wrap(() => {
                        return t.func1().then(t.func2);
                    });
                });

                expect(startSpy.calledBefore(func1Spy)).toBeTruthy();
                expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
                expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
                expect(stopSpy.called).toBeTruthy();
            });

            it('should wrap provided promise in start and stop functions', () => {
                dependencies.$rootScope.$apply(() => {
                    handler.wrap(t.func1().then(t.func2), {
                        referenceId
                    });
                });

                expect(startSpy.calledBefore(stopSpy)).toBeTruthy();
                expect(func1Spy.calledBefore(func2Spy)).toBeTruthy();
                expect(func2Spy.calledBefore(stopSpy)).toBeTruthy();
                expect(stopSpy.called).toBeTruthy();
            });

            it('should hide overlay if provided promise failed', () => {
                dependencies.$rootScope.$apply(() => {
                    handler.wrap(() => {
                        return dependencies.$q.reject();
                    });
                });

                expect(stopSpy.called).toBeTruthy();
            });
        });

        describe('without referenceId', () => {
            it('should emit rootScope event on start', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', () => {
                    done();
                });

                dependencies.bsLoadingOverlayService.start();
            });

            it('should indicate that loadingOverlay is active after start', () => {
                dependencies.bsLoadingOverlayService.start();

                expect(dependencies.bsLoadingOverlayService.isActive()).toBeTruthy();
            });

            it('should indicate that loadingOverlay is not active by default', () => {
                expect(dependencies.bsLoadingOverlayService.isActive()).toBeFalsy();
            });

            it('should indicate that loadingOverlay is not active after stop', () => {
                dependencies.bsLoadingOverlayService.start();
                dependencies.bsLoadingOverlayService.stop();

                expect(dependencies.bsLoadingOverlayService.isActive()).toBeFalsy();
            });

            it('should emit rootScope event on stop', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', () => {
                    done();
                });

                dependencies.bsLoadingOverlayService.stop();
            });
        });

        describe('with referenceId', () => {
            let referenceId;
            beforeEach(() => {
                referenceId = 'referenceId';
            });

            it('should emit rootScope event on start', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', () => {
                    done();
                });

                dependencies.bsLoadingOverlayService.start({
                    referenceId
                });
            });

            it('should emit rootScope event on stop', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', () => {
                    done();
                });

                dependencies.bsLoadingOverlayService.stop({
                    referenceId
                });
            });

            it('should emit rootScope event on start with referenceId in options', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', (event, options) => {
                    expect(options.referenceId).toEqual(referenceId);
                    done();
                });

                dependencies.bsLoadingOverlayService.start({
                    referenceId
                });
            });

            it('should emit rootScope event on stop with referenceId in options', (done) => {
                dependencies.$rootScope.$on('bsLoadingOverlayUpdateEvent', (event, options) => {
                    expect(options.referenceId).toEqual(referenceId);
                    done();
                });

                dependencies.bsLoadingOverlayService.stop({
                    referenceId
                });
            });

            it('should not make other references active on start', () => {
                dependencies.bsLoadingOverlayService.start({
                    referenceId
                });

                expect(dependencies.bsLoadingOverlayService.isActive('otherReference')).toBeFalsy();
            });

            it('should not be marked as active on other reference start', () => {
                dependencies.bsLoadingOverlayService.start({
                    referenceId: 'otherReference'
                });

                expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeFalsy();
            });

            it('should not stop other references on stop', () => {
                dependencies.bsLoadingOverlayService.start({
                    referenceId
                });

                dependencies.bsLoadingOverlayService.start({
                    referenceId: 'otherReference'
                });

                dependencies.bsLoadingOverlayService.stop({
                    referenceId
                });

                expect(dependencies.bsLoadingOverlayService.isActive('otherReference')).toBeTruthy();
            });

            it('should indicate that loadingOverlay is active after start', () => {
                dependencies.bsLoadingOverlayService.start({
                    referenceId
                });

                expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeTruthy();
            });

            it('should indicate that loadingOverlay is not active by default', () => {
                expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeFalsy();
            });

            it('should indicate that loadingOverlay is not active after stop', () => {
                dependencies.bsLoadingOverlayService.start({
                    referenceId
                });
                dependencies.bsLoadingOverlayService.stop({
                    referenceId
                });

                expect(dependencies.bsLoadingOverlayService.isActive(referenceId)).toBeFalsy();
            });
        });

    }
});
