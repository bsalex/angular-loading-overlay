(function () {
  'use strict';

  describe("bsLoadingOverlay directive", function () {
    var bsLoadingOverlayService,
      bsLoadingOverlayServiceMock,
      $compile,
      scope,
      $rootScope,
      referenceId,
      template,
      $templateCache,
      $timeout,
      defaultConfig;

    function getCompiledElement(template, scope) {
      var element;

      scope.$apply(function () {
        element = $compile(template)(scope);
      });

      return element;
    }

    beforeEach(function () {
      module('bsLoadingOverlay');

      module(function ($provide) {
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

      inject(function (_$compile_, _$rootScope_, _$q_, _$document_, _$templateCache_, _$timeout_) {
        $compile = _$compile_;
        scope = _$rootScope_.$new();
        scope.model = {};
        $rootScope = _$rootScope_;
        $templateCache = _$templateCache_;
        $timeout = _$timeout_;
      });

      $templateCache.put('default-template-url.html', '<div class="bs-loading-overlay"></div>');
    });

    it("should compile", function () {
      var element = getCompiledElement(template, scope);

      expect(element[0]).toBeDefined();
      bsLoadingOverlayServiceMock.verify();
    });

    it("should not add overlay when reference is not active", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

      var element = getCompiledElement(template, scope);

      expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
      bsLoadingOverlayServiceMock.verify();
    });

    it("should add overlay when reference is active", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      var element = getCompiledElement(template, scope);

      expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
      bsLoadingOverlayServiceMock.verify();
    });

    describe("with reference set by directive name attribute", function () {
      beforeEach(function () {
        template = '<div bs-loading-overlay="referenceId"></div>';
      });

      it("should not add overlay when reference is not active", function () {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should add overlay when reference is active", function () {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        var element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });
    });

    it("should not add overlay when reference templateUrl is false in global config and not set in directive", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
      defaultConfig.templateUrl = false;

      var element = getCompiledElement(template, scope);

      expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
      bsLoadingOverlayServiceMock.verify();
    });

    it("should reuse the same element on start stop and start again", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      var element = getCompiledElement(template, scope);

      element[0].querySelector('.bs-loading-overlay').testProperty = 1;

      $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
        referenceId: referenceId
      });

      $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
        referenceId: referenceId
      });

      expect(element[0].querySelector('.bs-loading-overlay').testProperty).toEqual(1);
      bsLoadingOverlayServiceMock.verify();
    });

    it("should add overlay element using provided templateUrl when reference is active", function () {
      $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
      template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';

      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      var element = getCompiledElement(template, scope);

      expect(element[0].querySelector('.from-template-url')).not.toBeNull();
      bsLoadingOverlayServiceMock.verify();
    });

    describe("with global config", function () {
      var globalConfig = {
        templateUrl: 'global-template-url.html',
        activeClass: 'globalActiveClass'
      };

      beforeEach(function () {
        bsLoadingOverlayServiceMock.restore();
        bsLoadingOverlayServiceMock = sinon.mock(bsLoadingOverlayService);
        bsLoadingOverlayServiceMock.expects('getGlobalConfig').once().returns(globalConfig);

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        $templateCache.put('global-template-url.html', '<div class="from-global-template-url"></div>');
      });

      it("should use templateUrl from global config if it is not provided directly into directive", function () {
        var element = getCompiledElement(template, scope);

        expect(element[0].querySelector('.from-global-template-url')).not.toBeNull();
      });

      it("should use active class from global config if it is not provided directly into directive", function () {
        var element = getCompiledElement(template, scope);

        expect(element.hasClass('globalActiveClass')).toBeTruthy();
      });

      it("should use delay from global config if it is not provided directly into directive", function () {
        globalConfig.delay = 1000;
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);
        scope.$apply(function () {
          $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
          });
        });

        expect(element[0].querySelector('.from-global-template-url')).not.toBeNull();
        $timeout.flush();
        expect(element[0].querySelector('.from-global-template-url')).toBeNull();
      });
    });

    describe("with delay", function () {
      it("should call timeout with correct args if delay is set", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });

        expect($timeout.withArgs(angular.noop, 5000).calledOnce).toBeTruthy();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should not remove overlay element until timer is triggered", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });

        expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should remove overlay element when timer is triggered", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });

        $timeout.flush();

        expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should not remove overlay element when timer is triggered, but overlay became active again", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        var element = getCompiledElement(template, scope);

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

      it("should not remove overlay element until timeout triggered on second stop", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

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

      it("should remove overlay element when timeout triggered on second stop", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-delay="5000" bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

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

      it("should not call timeout if delay is not set", function () {
        template = '<div bs-loading-overlay bs-loading-overlay-reference-id="referenceId">';
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

        var element = getCompiledElement(template, scope);

        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });

        expect($timeout.called).toBeFalsy();
        bsLoadingOverlayServiceMock.verify();
      });
    });

    describe("with two loader overlays", function () {
      it("should be able to render two loaders with different templates and references", function () {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        $templateCache.put('some-another-template.html', '<div class="from-another-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';
        var anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-another-template.html" bs-loading-overlay-reference-id="anotherreferenceId">';

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherreferenceId').returns(true);

        var element, anotherElement;

        var element = getCompiledElement(template, scope);
        var anotherElement = getCompiledElement(anotherTemplate, scope);

        expect(element[0].querySelector('.from-template-url')).not.toBeNull();
        expect(anotherElement[0].querySelector('.from-another-template-url')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should be able to render and show two loaders with same referenceId and template", function () {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';

        bsLoadingOverlayServiceMock.expects('isActive').twice().withArgs(referenceId).returns(true);

        var element = getCompiledElement(template, scope);
        var anotherElement = getCompiledElement(template, scope);

        expect(element[0].querySelector('.from-template-url')).not.toBeNull();
        expect(anotherElement[0].querySelector('.from-template-url')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should be able to render two loaders with same referenceId but different templates", function () {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        $templateCache.put('some-another-template.html', '<div class="from-another-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';
        var anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-another-template.html" bs-loading-overlay-reference-id="referenceId">';

        bsLoadingOverlayServiceMock.expects('isActive').twice().withArgs(referenceId).returns(true);

        var element = getCompiledElement(template, scope);
        var anotherElement = getCompiledElement(anotherTemplate, scope);

        expect(element[0].querySelector('.from-template-url')).not.toBeNull();
        expect(anotherElement[0].querySelector('.from-another-template-url')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should be able to render two loaders with different referenceId but same templates", function () {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';
        var anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="anotherreferenceId">';

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherreferenceId').returns(true);

        var element = getCompiledElement(template, scope);
        var anotherElement = getCompiledElement(anotherTemplate, scope);

        expect(element[0].querySelector('.from-template-url')).not.toBeNull();
        expect(anotherElement[0].querySelector('.from-template-url')).not.toBeNull();
        bsLoadingOverlayServiceMock.verify();
      });

      it("should be able to render two loaders with different referenceId and templates then hide and show first", function () {
        $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
        $templateCache.put('some-another-template.html', '<div class="from-another-template-url"></div>');
        template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';
        var anotherTemplate = '<div bs-loading-overlay bs-loading-overlay-template-url="some-another-template.html" bs-loading-overlay-reference-id="anotherreferenceId">';

        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs('anotherreferenceId').returns(true);

        var element = getCompiledElement(template, scope);
        var anotherElement = getCompiledElement(anotherTemplate, scope);

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

    it("should remove overlay with provided templateUrl class if reference became inactive and update event emitted", function () {
      $templateCache.put('some-template.html', '<div class="from-template-url"></div>');
      template = '<div bs-loading-overlay bs-loading-overlay-template-url="some-template.html" bs-loading-overlay-reference-id="referenceId">';

      bsLoadingOverlayServiceMock.expects('isActive')
        .twice()
        .withArgs(referenceId)
        .onFirstCall()
        .returns(true)
        .onSecondCall()
        .returns(false);

      var element = getCompiledElement(template, scope);

      scope.$apply(function () {
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });
      });

      expect(element[0].querySelector('.from-template-url')).toBeNull();
    });

    it("should add overlay class when reference is active", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      var element = getCompiledElement(template, scope);

      expect(element.hasClass('bs-loading-overlay--active')).toBeTruthy();
    });

    it("should add overlay class when reference is active event if templateUrl is false", function () {
      defaultConfig.templateUrl = false;
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      var element = getCompiledElement(template, scope);

      expect(element.hasClass('bs-loading-overlay--active')).toBeTruthy();
    });

    it("should not add overlay class when it is false in global config and not provided to directive", function () {
      defaultConfig.activeClass = false;
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      var element = getCompiledElement(template, scope);

      expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    it("should remove overlay class if reference became inactive and update event emitted", function () {
      bsLoadingOverlayServiceMock.expects('isActive')
        .twice()
        .withArgs(referenceId)
        .onFirstCall()
        .returns(true)
        .onSecondCall()
        .returns(false);

      var element = getCompiledElement(template, scope);

      scope.$apply(function () {
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });
      });

      expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    it("should remove overlay class if reference became inactive and update event emitted and templateUrl is false", function () {
      defaultConfig.templateUrl = false;
      bsLoadingOverlayServiceMock.expects('isActive')
        .twice()
        .withArgs(referenceId)
        .onFirstCall()
        .returns(true)
        .onSecondCall()
        .returns(false);

      var element = getCompiledElement(template, scope);

      scope.$apply(function () {
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });
      });

      expect(element.hasClass('bs-loading-overlay--active')).toBeFalsy();
    });

    describe("with custom class", function () {
      beforeEach(function () {
        template = '<div bs-loading-overlay bs-loading-overlay-active-class="some-active-class" bs-loading-overlay-reference-id="referenceId">';
      });

      it("should add overlay custom class when reference is active", function () {
        bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

        var element = getCompiledElement(template, scope);

        expect(element.hasClass('some-active-class')).toBeTruthy();
      });

      it("should remove overlay custom class if reference became inactive and update event emitted", function () {
        bsLoadingOverlayServiceMock.expects('isActive')
          .twice()
          .withArgs(referenceId)
          .onFirstCall()
          .returns(true)
          .onSecondCall()
          .returns(false);

        var element = getCompiledElement(template, scope);

        scope.$apply(function () {
          $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
          });
        });

        expect(element.hasClass('some-active-class')).toBeFalsy();
      });
    });

    it("should remove overlay if reference became inactive and update event emitted", function () {
      bsLoadingOverlayServiceMock.expects('isActive')
        .twice()
        .withArgs(referenceId)
        .onFirstCall()
        .returns(true)
        .onSecondCall()
        .returns(false);

      var element = getCompiledElement(template, scope);
      scope.$apply(function () {
        $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
          referenceId: referenceId
        });
      });

      expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
    });

    it("should not remove overlay if reference became inactive and update event is not emitted", function () {
      bsLoadingOverlayServiceMock.expects('isActive')
        .twice()
        .withArgs(referenceId)
        .onFirstCall()
        .returns(true);

      var element = getCompiledElement(template, scope);

      expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
    });

    it("should add overlay when rootScope event triggered and reference become active", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

      var element = getCompiledElement(template, scope);

      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);
      $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
        referenceId: referenceId
      });

      expect(element[0].querySelector('.bs-loading-overlay')).not.toBeNull();
      bsLoadingOverlayServiceMock.verify();
    });

    it("should not add overlay when reference become active but rootScope event is not triggered", function () {
      var element = getCompiledElement(template, scope);

      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(true);

      expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
    });

    it("should remove rootScope listener on overlay element removed", function () {
      var element = getCompiledElement(template, scope);

      scope.$apply(function () {
        element.remove();
      });

      expect($rootScope.$$listeners.bsLoadingOverlayUpdateEvent[0]).toBeNull();
    });

    it("should not add overlay when rootScope event triggered for another reference", function () {
      bsLoadingOverlayServiceMock.expects('isActive').once().withArgs(referenceId).returns(false);

      var element = getCompiledElement(template, scope);

      $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
        referenceId: 'another'
      });

      expect(element[0].querySelector('.bs-loading-overlay')).toBeNull();
      bsLoadingOverlayServiceMock.verify();
    });

  });
}());
