/// <reference path="../typings/index.d.ts" />

import BsLoadingOverlayModule from './BsLoadingOverlayModule';
import IBsLoadingOverlayOptions from './IBsLoadingOverlayOptions';

interface BsLoadingOverlayScope extends ng.IScope {
    model: any;
}

interface IRootScopeServiceWithExposedListeners extends ng.IRootScopeService {
    $$listeners: any;
}

describe('bsLoadingOverlay directive', () => {
    let bsLoadingOverlayService: any,
        bsLoadingOverlayServiceMock: Sinon.SinonMock,
        $compile: ng.ICompileService,
        scope: BsLoadingOverlayScope,
        $rootScope: IRootScopeServiceWithExposedListeners,
        referenceId: string,
        template: string,
        $templateCache: ng.ITemplateCacheService,
        $timeout: Sinon.SinonSpy & ng.ITimeoutService,
        defaultConfig: IBsLoadingOverlayOptions = {};

    const getCompiledElement = (template: string, scope: ng.IScope) => {
        let element: ng.IAugmentedJQuery;

        scope.$apply(function() {
            element = $compile(template)(scope);
        });

        return element;
    };

    beforeEach(function() {
        angular.mock.module(BsLoadingOverlayModule.name);
        angular.mock.module(($provide: ng.auto.IProvideService) => {
            $provide.value('bsLoadingOverlayService', bsLoadingOverlayService);
            $provide.decorator('$timeout', function($delegate: any) {
                return sinon.spy($delegate);
            });
        });

        template = '<div bs-loading-overlay bs-loading-overlay-reference-id="referenceId"></div>';

        referenceId = 'referenceId';

        defaultConfig = {
            templateUrl: 'default-template-url.html',
            activeClass: 'bs-loading-overlay--active'
        };

        bsLoadingOverlayService = {
            isActive: angular.noop,
            getGlobalConfig: angular.noop
        };

        bsLoadingOverlayServiceMock = sinon.mock(bsLoadingOverlayService);
        bsLoadingOverlayServiceMock.expects('getGlobalConfig').atLeast(1).returns(defaultConfig);

        angular.mock.inject((
            _$compile_: ng.ICompileService,
            _$rootScope_: IRootScopeServiceWithExposedListeners,
            _$q_: ng.IQService,
            _$document_: ng.IDocumentService,
            _$templateCache_: ng.ITemplateCacheService,
            _$timeout_: Sinon.SinonSpy & ng.ITimeoutService
        ) => {
            $compile = _$compile_;
            scope = <BsLoadingOverlayScope>_$rootScope_.$new();
            scope.model = {};
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $timeout = _$timeout_;
        });

        $templateCache.put('default-template-url.html', '<div class="bs-loading-overlay"></div>');
    });


    it('should compile', function() {
        const element = getCompiledElement(template, scope);

        expect(element[0]).toBeDefined();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should add overlay when reference is active', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should not add overlay when reference is not active', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    describe('with reference set by directive name attribute', function() {
        beforeEach(function() {
            template = '<div bs-loading-overlay="referenceId"></div>';
        });

        it('should not add overlay when reference is not active', function() {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should add overlay when reference is active', function() {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });
    });

    it('should not add overlay when reference templateUrl is undefined in global config and not set in directive', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        defaultConfig.templateUrl = undefined;

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should reuse the same element on start stop and start again', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        element[0].querySelector('.bs-loading-overlay').id = 'test id';

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
        });

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
        });

        expect(element[0].querySelector('.bs-loading-overlay').id).toEqual('test id');
        bsLoadingOverlayServiceMock.verify();
    });

    it('should add overlay element using provided templateUrl when reference is active', function() {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.from-template-url')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    describe('with global config', function() {
        const globalConfig: IBsLoadingOverlayOptions = {
            templateUrl: 'global-template-url.html',
            activeClass: 'globalActiveClass'
        };

        beforeEach(function() {
            bsLoadingOverlayServiceMock.restore();
            bsLoadingOverlayServiceMock = sinon.mock(bsLoadingOverlayService);
            bsLoadingOverlayServiceMock.expects('getGlobalConfig').once().returns(globalConfig);

            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            $templateCache.put('global-template-url.html', '<div class="from-global-template-url"></div>');
        });

        it('should use templateUrl from global config if it is not provided directly into directive', function() {
            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.from-global-template-url')).not.toBeNull();
        });

        it('should use active class from global config if it is not provided directly into directive', function() {
            const element = getCompiledElement(template, scope);

            expect(element.hasClass('globalActiveClass')).toBeTruthy();
        });

        it('should use delay from global config if it is not provided directly into directive', function() {
            globalConfig.delay = 1000;
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);
            scope.$apply(function() {
                $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                    referenceId: referenceId
                });
            });

            expect(element[0].querySelector('.from-global-template-url')).not.toBeNull();
            $timeout.flush();
            expect(element[0].querySelector('.from-global-template-url')).toBeNull();
        });
    });

    describe('with delay', function() {
        it('should call timeout with correct args if delay is set', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            expect($timeout.withArgs(angular.noop, 5000).calledOnce).toBeTruthy();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not remove overlay element until timer is triggered', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should remove overlay element when timer is triggered', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $timeout.flush();

            expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not remove overlay element when timer is triggered, but overlay became active again', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $timeout.flush();

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not remove overlay element until timeout triggered on second stop', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $timeout.flush();

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should remove overlay element when timeout triggered on second stop', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $timeout.flush();

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            $timeout.flush();

            expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not call timeout if delay is not set', function() {
            template = '<div bs-loading-overlay bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            expect($timeout.called).toBeFalsy();
            bsLoadingOverlayServiceMock.verify();
        });
    });

    describe('with two loader overlays', function() {
        it('should be able to render two loaders with different templates and references', function() {
            $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
            $templateCache.put('some-another-template.html', '<div class="from-another-template-url"></div>');
            template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';
            const anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-another-template.html" bs-loading-overlay-reference-id="anotherreferenceId"></div>';

            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherreferenceId').returns(true);

            const element = getCompiledElement(template, scope);
            const anotherElement = getCompiledElement(anotherTemplate, scope);

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-another-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should be able to render and show two loaders with same referenceId and template', function() {
            $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
            template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';

            bsLoadingOverlayServiceMock.expects('isActive').twice().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);
            const anotherElement = getCompiledElement(template, scope);

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should be able to render two loaders with same referenceId but different templates', function() {
            $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
            $templateCache.put('some-another-template.html', '<div class="from-another-template-url"></div>');
            template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';
            const anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-another-template.html" bs-loading-overlay-reference-id="referenceId"></div>';

            bsLoadingOverlayServiceMock.expects('isActive').twice().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);
            const anotherElement = getCompiledElement(anotherTemplate, scope);

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-another-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should be able to render two loaders with different referenceId but same templates', function() {
            $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
            template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';
            const anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="anotherreferenceId"></div>';

            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherreferenceId').returns(true);

            const element = getCompiledElement(template, scope);
            const anotherElement = getCompiledElement(anotherTemplate, scope);

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should be able to render two loaders with different referenceId and templates then hide and show first', function() {
            $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
            $templateCache.put('some-another-template.html', '<div class="from-another-template-url"></div>');
            template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';
            const anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-another-template.html" bs-loading-overlay-reference-id="anotherreferenceId"></div>';

            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherreferenceId').returns(true);

            const element = getCompiledElement(template, scope);
            const anotherElement = getCompiledElement(anotherTemplate, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            scope.$apply();

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });

            scope.$apply();

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-another-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });
    });

    it('should remove overlay with provided templateUrl class if reference became inactive and update event emitted', function() {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';

        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);

        scope.$apply(function() {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });
        });

        expect(element[0].querySelector('.from-template-url')).toBeNull();
    });

    it('should add overlay class when reference is active', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element.hasClass('bs-loading-overlay--active')).toBeTruthy();
    });

    it('should add overlay class when reference is active event if templateUrl is false', function() {
        defaultConfig.templateUrl = undefined;
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element.hasClass('bs-loading-overlay--active')).toBeTruthy();
    });

    it('should not add overlay class when it is false in global config and not provided to directive', function() {
        defaultConfig.activeClass = undefined;
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    it('should remove overlay class if reference became inactive and update event emitted', function() {
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);

        scope.$apply(function() {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });
        });

        expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    it('should remove overlay class if reference became inactive and update event emitted and templateUrl is false', function() {
        defaultConfig.templateUrl = undefined;
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);

        scope.$apply(function() {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });
        });

        expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    describe('with custom class', function() {
        beforeEach(function() {
            template = '<div bs-loading-overlay bs-loading-overlay-active-class="some-active-class" bs-loading-overlay-reference-id="referenceId"></div>';
        });

        it('should add overlay custom class when reference is active', function() {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);

            expect(element.hasClass('some-active-class')).toBeTruthy();
        });

        it('should remove overlay custom class if reference became inactive and update event emitted', function() {
            bsLoadingOverlayServiceMock.expects('isActive')
                .twice()
                .withArgs(referenceId)
                .onFirstCall()
                .returns(true)
                .onSecondCall()
                .returns(false);

            const element = getCompiledElement(template, scope);

            scope.$apply(function() {
                $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                    referenceId: referenceId
                });
            });

            expect(element.hasClass('some-active-class')).toBeFalsy();
        });
    });

    it('should remove overlay if reference became inactive and update event emitted', function() {
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);
        scope.$apply(function() {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId: referenceId
            });
        });

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
    });

    it('should not remove overlay if reference became inactive and update event is not emitted', function() {
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
    });

    it('should add overlay when rootScope event triggered and reference become active', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        const element = getCompiledElement(template, scope);

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
        });

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should not add overlay when reference become active but rootScope event is not triggered', function() {
        const element = getCompiledElement(template, scope);

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
    });

    it('should remove rootScope listener on overlay element removed', function() {
        const element = getCompiledElement(template, scope);

        scope.$apply(function() {
            element.remove();
        });

        expect($rootScope.$$listeners.bsLoadingOverlayUpdateEvent[0]).toBeNull();
    });

    it('should not add overlay when rootScope event triggered for another reference', function() {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        const element = getCompiledElement(template, scope);

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: 'another'
        });

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should add overlay when it was configured without referenceId and rootScope event triggered with referenceId undefined', function() {
        template = '<div bs-loading-overlay></div>';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(undefined).returns(false);

        const element = getCompiledElement(template, scope);

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(undefined).returns(true);
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: undefined
        });

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });
});
