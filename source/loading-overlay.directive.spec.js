/// <reference path="../typings/index.d.ts" />
"use strict";
describe('bsLoadingOverlay directive', function () {
    var bsLoadingOverlayService, bsLoadingOverlayServiceMock, $compile, scope, $rootScope, referenceId, template, $templateCache, $timeout, defaultConfig = {};
    var getCompiledElement = function (template, scope) {
        var element;
        scope.$apply(function () {
            element = $compile(template)(scope);
        });
        return element;
    };
    beforeEach(function () {
        angular.mock.module('bsLoadingOverlay');
        angular.mock.module(function ($provide) {
            $provide.value('bsLoadingOverlayService', bsLoadingOverlayService);
            $provide.decorator('$timeout', function ($delegate) {
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
        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _$document_, _$templateCache_, _$timeout_) {
            $compile = _$compile_;
            scope = _$rootScope_.$new();
            scope.model = {};
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $timeout = _$timeout_;
        });
        $templateCache.put('default-template-url.html', '<div class="bs-loading-overlay"></div>');
    });
    it('Test 1', function () {
    });
});
