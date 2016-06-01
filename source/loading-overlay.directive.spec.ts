/// <reference path="../typings/index.d.ts" />

import BsLoadingOverlayModule from './loading-overlay.module';
import IBsLoadingOverlayOptions from './loading-overlay.options';

interface BsLoadingOverlayScope extends ng.IScope {
    model: any;
}

describe('bsLoadingOverlay directive', () => {
    let bsLoadingOverlayService: any,
        bsLoadingOverlayServiceMock: Sinon.SinonMock,
        $compile: ng.ICompileService,
        scope: BsLoadingOverlayScope,
        $rootScope: ng.IRootScopeService,
        referenceId: string,
        template: string,
        $templateCache: ng.ITemplateCacheService,
        $timeout: ng.ITimeoutService,
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
            _$rootScope_: ng.IRootScopeService,
            _$q_: ng.IQService,
            _$document_: ng.IDocumentService,
            _$templateCache_: ng.ITemplateCacheService,
            _$timeout_: ng.ITimeoutService
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


    it('Test 1', () => {

    });
});
