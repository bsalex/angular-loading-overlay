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

        scope.$apply(() => {
            element = $compile(template)(scope);
        });

        return element;
    };

    beforeEach(() => {
        angular.mock.module(BsLoadingOverlayModule.name);
        angular.mock.module(($provide: ng.auto.IProvideService) => {
            $provide.value('bsLoadingOverlayService', bsLoadingOverlayService);
            $provide.decorator('$timeout', ($delegate: any) => sinon.spy($delegate));
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


    it('should compile', () => {
        const element = getCompiledElement(template, scope);

        expect(element[0]).toBeDefined();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should add overlay when reference is active', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    describe('with options', () => {
        it('should pass provided template options to the template', () => {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            template = '<div bs-loading-overlay bs-loading-overlay-template-options="{option: \'optionValue\'}" bs-loading-overlay-reference-id="referenceId"></div>';
            $templateCache.put(
                'default-template-url.html',
                '<div class="bs-loading-overlay">{{bsLoadingOverlayTemplateOptions.option}}</div>'
            );

            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.bs-loading-overlay').textContent).toBe('optionValue');
            bsLoadingOverlayServiceMock.verify();
        });

        it('should pass provided different template options for different overlays in the same scope', () => {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherReferenceId').returns(true);

            template = `
                <div>
                    <div bs-loading-overlay bs-loading-overlay-template-options="{option: \'optionValue\'}" bs-loading-overlay-reference-id="referenceId"></div>
                    <div bs-loading-overlay bs-loading-overlay-template-options="{option: \'anotherOptionValue\'}" bs-loading-overlay-reference-id="anotherReferenceId"></div>
                </div>`;

            $templateCache.put(
                'default-template-url.html',
                '<div class="bs-loading-overlay">{{bsLoadingOverlayTemplateOptions.option}}</div>'
            );

            const element = getCompiledElement(template, scope);
            const overlayElements = element[0].querySelectorAll('.bs-loading-overlay');

            expect(overlayElements[0].textContent).toBe('optionValue');
            expect(overlayElements[1].textContent).toBe('anotherOptionValue');

            bsLoadingOverlayServiceMock.verify();
        });
    });

    it('should not add overlay when reference is not active', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    describe('with reference set by directive name attribute', () => {
        beforeEach(() => {
            template = '<div bs-loading-overlay="referenceId"></div>';
        });

        it('should not add overlay when reference is not active', () => {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should add overlay when reference is active', () => {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });
    });

    it('should not add overlay when reference templateUrl is undefined in global config and not set in directive', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        defaultConfig.templateUrl = undefined;

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should reuse the same element on start stop and start again', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        element[0].querySelector('.bs-loading-overlay').id = 'test id';

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId
        });

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId
        });

        expect(element[0].querySelector('.bs-loading-overlay').id).toEqual('test id');
        bsLoadingOverlayServiceMock.verify();
    });

    it('should add overlay element using provided templateUrl when reference is active', () => {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.from-template-url')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    describe('with global config', () => {
        const globalConfig: IBsLoadingOverlayOptions = {
            templateUrl: 'global-template-url.html',
            activeClass: 'globalActiveClass'
        };

        beforeEach(() => {
            bsLoadingOverlayServiceMock.restore();
            bsLoadingOverlayServiceMock = sinon.mock(bsLoadingOverlayService);
            bsLoadingOverlayServiceMock.expects('getGlobalConfig').once().returns(globalConfig);

            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            $templateCache.put('global-template-url.html', '<div class="from-global-template-url"></div>');
        });

        it('should use templateUrl from global config if it is not provided directly into directive', () => {
            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.from-global-template-url')).not.toBeNull();
        });

        it('should use active class from global config if it is not provided directly into directive', () => {
            const element = getCompiledElement(template, scope);

            expect(element.hasClass('globalActiveClass')).toBeTruthy();
        });

        it('should use delay from global config if it is not provided directly into directive', () => {
            globalConfig.delay = 1000;
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);
            scope.$apply(() => {
                $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                    referenceId
                });
            });

            expect(element[0].querySelector('.from-global-template-url')).not.toBeNull();
            $timeout.flush();
            expect(element[0].querySelector('.from-global-template-url')).toBeNull();
        });

        it('should pass provided template options from global config if it is not provided directly into directive', () => {
            globalConfig.templateOptions = {option: 'optionValue'};
            $templateCache.put(
                'global-template-url.html',
                '<div class="from-global-template-url">{{bsLoadingOverlayTemplateOptions.option}}</div>'
            );

            const element = getCompiledElement(template, scope);

            expect(element[0].querySelector('.from-global-template-url').textContent).toBe('optionValue');
            bsLoadingOverlayServiceMock.verify();
        });
    });

    describe('with delay', () => {
        it('should call timeout with correct args if delay is set', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            expect($timeout.withArgs(angular.noop, 5000).calledOnce).toBeTruthy();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not remove overlay element until timer is triggered', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should remove overlay element when timer is triggered', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $timeout.flush();

            expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not remove overlay element when timer is triggered, but overlay became active again', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $timeout.flush();

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not remove overlay element until timeout triggered on second stop', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $timeout.flush();

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should remove overlay element when timeout triggered on second stop', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $timeout.flush();

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            $timeout.flush();

            expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should not call timeout if delay is not set', () => {
            template = '<div bs-loading-overlay bs-loading-overlay-reference-id="referenceId"></div>';
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

            const element = getCompiledElement(template, scope);

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            expect($timeout.called).toBeFalsy();
            bsLoadingOverlayServiceMock.verify();
        });
    });

    describe('with two loader overlays', () => {
        it('should be able to render two loaders with different templates and references', () => {
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

        it('should be able to render and show two loaders with same referenceId and template', () => {
            $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
            template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId"></div>';

            bsLoadingOverlayServiceMock.expects('isActive').twice().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);
            const anotherElement = getCompiledElement(template, scope);

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });

        it('should be able to render two loaders with same referenceId but different templates', () => {
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

        it('should be able to render two loaders with different referenceId but same templates', () => {
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

        it('should be able to render two loaders with different referenceId and templates then hide and show first', () => {
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
                referenceId
            });

            scope.$apply();

            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });

            scope.$apply();

            expect(element[0].querySelector('.from-template-url')).not.toBeNull();
            expect(anotherElement[0].querySelector('.from-another-template-url')).not.toBeNull();
            bsLoadingOverlayServiceMock.verify();
        });
    });

    it('should remove overlay with provided templateUrl class if reference became inactive and update event emitted', () => {
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

        scope.$apply(() => {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });
        });

        expect(element[0].querySelector('.from-template-url')).toBeNull();
    });

    it('should add overlay class when reference is active', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element.hasClass('bs-loading-overlay--active')).toBeTruthy();
    });

    it('should add overlay class when reference is active event if templateUrl is false', () => {
        defaultConfig.templateUrl = undefined;
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element.hasClass('bs-loading-overlay--active')).toBeTruthy();
    });

    it('should not add overlay class when it is false in global config and not provided to directive', () => {
        defaultConfig.activeClass = undefined;
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        const element = getCompiledElement(template, scope);

        expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    it('should remove overlay class if reference became inactive and update event emitted', () => {
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);

        scope.$apply(() => {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });
        });

        expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    it('should remove overlay class if reference became inactive and update event emitted and templateUrl is false', () => {
        defaultConfig.templateUrl = undefined;
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);

        scope.$apply(() => {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });
        });

        expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    describe('with custom class', () => {
        beforeEach(() => {
            template = '<div bs-loading-overlay bs-loading-overlay-active-class="some-active-class" bs-loading-overlay-reference-id="referenceId"></div>';
        });

        it('should add overlay custom class when reference is active', () => {
            bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

            const element = getCompiledElement(template, scope);

            expect(element.hasClass('some-active-class')).toBeTruthy();
        });

        it('should remove overlay custom class if reference became inactive and update event emitted', () => {
            bsLoadingOverlayServiceMock.expects('isActive')
                .twice()
                .withArgs(referenceId)
                .onFirstCall()
                .returns(true)
                .onSecondCall()
                .returns(false);

            const element = getCompiledElement(template, scope);

            scope.$apply(() => {
                $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                    referenceId
                });
            });

            expect(element.hasClass('some-active-class')).toBeFalsy();
        });
    });

    it('should remove overlay if reference became inactive and update event emitted', () => {
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true)
            .onSecondCall()
            .returns(false);

        const element = getCompiledElement(template, scope);
        scope.$apply(() => {
            $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
                referenceId
            });
        });

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
    });

    it('should not remove overlay if reference became inactive and update event is not emitted', () => {
        bsLoadingOverlayServiceMock.expects('isActive')
            .twice()
            .withArgs(referenceId)
            .onFirstCall()
            .returns(true);

        const element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
    });

    it('should add overlay when rootScope event triggered and reference become active', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        const element = getCompiledElement(template, scope);

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId
        });

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should not add overlay when reference become active but rootScope event is not triggered', () => {
        const element = getCompiledElement(template, scope);

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
    });

    it('should remove rootScope listener on overlay element removed', () => {
        const element = getCompiledElement(template, scope);

        scope.$apply(() => {
            element.remove();
        });

        expect($rootScope.$$listeners.bsLoadingOverlayUpdateEvent[0]).toBeNull();
    });

    it('should not add overlay when rootScope event triggered for another reference', () => {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        const element = getCompiledElement(template, scope);

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: 'another'
        });

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
    });

    it('should add overlay when it was configured without referenceId and rootScope event triggered with referenceId undefined', () => {
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
