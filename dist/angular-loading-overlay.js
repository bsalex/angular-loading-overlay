/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BsLoadingOverlayDirective_1 = __webpack_require__(1);
	var BsLoadingOverlayService_1 = __webpack_require__(2);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = angular.module('bsLoadingOverlay', [])
	    .directive('bsLoadingOverlay', BsLoadingOverlayDirective_1.BsLoadingOverlayDirectiveFactory)
	    .factory('bsLoadingOverlayService', BsLoadingOverlayService_1.default);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var BsLoadingOverlayDirective = (function () {
	    function BsLoadingOverlayDirective($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService) {
	        var _this = this;
	        this.$compile = $compile;
	        this.$rootScope = $rootScope;
	        this.$templateRequest = $templateRequest;
	        this.$q = $q;
	        this.$timeout = $timeout;
	        this.bsLoadingOverlayService = bsLoadingOverlayService;
	        this.restrict = 'EA';
	        this.link = function (scope, $element, $attributes) {
	            var overlayElement, referenceId, activeClass, templatePromise, delay, delayPromise;
	            var activate = function () {
	                var globalConfig = _this.bsLoadingOverlayService.getGlobalConfig();
	                referenceId = $attributes.bsLoadingOverlayReferenceId || ($attributes.bsLoadingOverlay === '' ? undefined : $attributes.bsLoadingOverlay);
	                delay = +$attributes.bsLoadingOverlayDelay || globalConfig.delay;
	                activeClass = $attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass;
	                var templateUrl = $attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;
	                if (templateUrl) {
	                    templatePromise = _this.$templateRequest(templateUrl);
	                }
	                else {
	                    templatePromise = _this.$q.reject();
	                }
	                templatePromise.then(function (loadedTemplate) {
	                    overlayElement = _this.$compile(loadedTemplate)(scope);
	                    overlayElement.data('isAttached', false);
	                    updateOverlayElement(referenceId);
	                }).catch(function () {
	                    updateOverlayElement(referenceId);
	                });
	                var unsubscribe = _this.$rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
	                    if (options.referenceId === referenceId) {
	                        updateOverlayElement(referenceId);
	                    }
	                });
	                $element.on('$destroy', unsubscribe);
	            };
	            var updateOverlayElement = function (referenceId) {
	                if (_this.bsLoadingOverlayService.isActive(referenceId)) {
	                    addOverlay();
	                }
	                else {
	                    removeOverlay();
	                }
	            };
	            var isOverlayAdded = function () { return !!delayPromise; };
	            var addOverlay = function () {
	                if (delay) {
	                    if (delayPromise) {
	                        _this.$timeout.cancel(delayPromise);
	                    }
	                    delayPromise = _this.$timeout(angular.noop, delay);
	                }
	                else {
	                    delayPromise = _this.$q.when();
	                }
	                if (overlayElement && !overlayElement.data('isAttached')) {
	                    $element.append(overlayElement);
	                    overlayElement.data('isAttached', true);
	                }
	                $element.addClass(activeClass);
	            };
	            var removeOverlay = function () {
	                if (isOverlayAdded()) {
	                    delayPromise.then(function () {
	                        if (overlayElement && overlayElement.data('isAttached')) {
	                            overlayElement.data('isAttached', false);
	                            overlayElement.detach();
	                        }
	                        $element.removeClass(activeClass);
	                        delayPromise = undefined;
	                    });
	                }
	            };
	            activate();
	        };
	    }
	    return BsLoadingOverlayDirective;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BsLoadingOverlayDirective;
	exports.BsLoadingOverlayDirectiveFactory = function ($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService) {
	    return (new BsLoadingOverlayDirective($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService));
	};
	exports.BsLoadingOverlayDirectiveFactory.$inject = [
	    '$compile',
	    '$rootScope',
	    '$templateRequest',
	    '$q',
	    '$timeout',
	    'bsLoadingOverlayService'
	];


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var BsLoadingOverlayService = (function () {
	    function BsLoadingOverlayService($rootScope, $q) {
	        var _this = this;
	        this.$rootScope = $rootScope;
	        this.$q = $q;
	        this.globalConfig = {};
	        this.activeOverlays = {};
	        this.createHandler = function (options) { return ({
	            start: _this.start.bind(_this, options),
	            stop: _this.stop.bind(_this, options),
	            wrap: _this.wrap.bind(_this, options)
	        }); };
	        this.isActive = function (referenceId) {
	            if (referenceId === void 0) { referenceId = undefined; }
	            return _this.activeOverlays[referenceId];
	        };
	        this.setGlobalConfig = function (options) { return angular.extend(_this.globalConfig, options); };
	        this.getGlobalConfig = function () { return _this.globalConfig; };
	    }
	    BsLoadingOverlayService.prototype.start = function (options) {
	        if (options === void 0) { options = {}; }
	        this.activeOverlays[options.referenceId] = true;
	        this.notifyOverlays(options.referenceId);
	    };
	    BsLoadingOverlayService.prototype.wrap = function (options, promiseFunction) {
	        var promise;
	        if (typeof promiseFunction === 'function') {
	            promise = promiseFunction;
	        }
	        else {
	            promise = function () { return promiseFunction; };
	        }
	        return this.$q.when(this.start(options))
	            .then(promise)
	            .finally(this.stop.bind(this, options));
	    };
	    BsLoadingOverlayService.prototype.notifyOverlays = function (referenceId) {
	        this.$rootScope.$emit('bsLoadingOverlayUpdateEvent', {
	            referenceId: referenceId
	        });
	    };
	    BsLoadingOverlayService.prototype.stop = function (options) {
	        if (options === void 0) { options = {}; }
	        delete this.activeOverlays[options.referenceId];
	        this.notifyOverlays(options.referenceId);
	    };
	    return BsLoadingOverlayService;
	}());
	exports.BsLoadingOverlayService = BsLoadingOverlayService;
	var bsLoadingOverlayServiceFactory = function ($rootScope, $q) { return new BsLoadingOverlayService($rootScope, $q); };
	bsLoadingOverlayServiceFactory.$inject = ['$rootScope', '$q'];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = bsLoadingOverlayServiceFactory;


/***/ }
/******/ ]);