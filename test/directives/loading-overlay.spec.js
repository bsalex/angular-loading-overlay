describe("Loading overlay directive", function () {
    "use strict";

    var $compile,
        $scope,
        LoadingOverlay;

    beforeEach(module('angularLoadingOverlay'));
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, _LoadingOverlay_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        LoadingOverlay = _LoadingOverlay_;
    }));

    it("should not throw error if mixin is not applied to the scope", function () {
        $compile("<div loading-overlay></div>")($scope);
        $scope.$digest();
    });

    describe("when mixin is applied to scope", function() {
        beforeEach(function () {
            LoadingOverlay.mixin($scope);
        });

        it("should be applicable", function () {
            $compile("<div loading-overlay></div>")($scope);
            $scope.$digest();
        });

        it("should add a div inside a container", function () {
            var element = $compile("<div loading-overlay><div id='anotherDiv'></div></div>")($scope);
            $scope.$digest();

            expect(element[0].querySelector(".loading-overlay")).not.toBeNull();
            expect(element[0].querySelector("#anotherDiv")).not.toBeNull();
        });

        it("should hide the overlay by default", function () {
            var element = $compile("<div loading-overlay><div id='anotherDiv'></div></div>")($scope);

            $scope.$digest();

            var overlay = angular.element(element[0].querySelector(".loading-overlay"));

            expect(overlay.hasClass("ng-hide")).toBeTruthy();
        });

        it("should show the overlay", function () {
            var element = $compile("<div loading-overlay><div id='anotherDiv'></div></div>")($scope);

            $scope.$digest();

            $scope.$apply(function () {
                $scope.showLoadingOverlay();
            });

            var overlay = angular.element(element[0].querySelector(".loading-overlay"));

            expect(overlay.hasClass("ng-hide")).toBeFalsy();
        });

        it("should hide the overlay after it has been showed", function () {
            var element = $compile("<div loading-overlay><div id='anotherDiv'></div></div>")($scope);

            $scope.$digest();

            $scope.$apply(function () {
                $scope.showLoadingOverlay();
            });

            $scope.$apply(function () {
                $scope.hideLoadingOverlay();
            });

            var overlay = angular.element(element[0].querySelector(".loading-overlay"));

            expect(overlay.hasClass("ng-hide")).toBeTruthy();
        });

        describe("With id attribute set", function () {
            it("should hide the overlay by default", function () {
                var element = $compile("<div loading-overlay=\"theId\"><div id='anotherDiv'></div></div>")($scope);

                $scope.$digest();

                var overlay = angular.element(element[0].querySelector(".loading-overlay"));

                expect(overlay.hasClass("ng-hide")).toBeTruthy();
            });

            it("should show the overlay", function () {
                var element = $compile("<div loading-overlay=\"theId\"><div id='anotherDiv'></div></div>")($scope);

                $scope.$digest();

                $scope.$apply(function () {
                    $scope.showLoadingOverlay("theId");
                });

                var overlay = angular.element(element[0].querySelector(".loading-overlay"));

                expect(overlay.hasClass("ng-hide")).toBeFalsy();
            });

            it("should be applicable with several ids", function () {
                $compile("<div loading-overlay=\"theId, anotherId\"><div id='anotherDiv'></div></div>")($scope);

                $scope.$digest();
            });

            it("should show overlay if even one id is active", function () {
                var element = $compile("<div loading-overlay=\"theId, anotherId\"><div id='anotherDiv'></div></div>")($scope);

                $scope.$digest();

                $scope.$apply(function () {
                    $scope.showLoadingOverlay("anotherId");
                });

                var overlay = angular.element(element[0].querySelector(".loading-overlay"));

                expect(overlay.hasClass("ng-hide")).toBeFalsy();
            });

            it("should hide overlay if none of ids is active", function () {
                var element = $compile("<div loading-overlay=\"theId, anotherId\"><div id='anotherDiv'></div></div>")($scope);

                $scope.$digest();

                $scope.$apply(function () {
                    $scope.showLoadingOverlay("anotherId");
                    $scope.showLoadingOverlay("theId");

                    $scope.hideLoadingOverlay("anotherId");
                    $scope.hideLoadingOverlay("theId");
                });

                var overlay = angular.element(element[0].querySelector(".loading-overlay"));

                expect(overlay.hasClass("ng-hide")).toBeTruthy();
            });

            it("should hide the overlay after it has been showed", function () {
                var element = $compile("<div loading-overlay=\"theId\"><div id='anotherDiv'></div></div>")($scope);

                $scope.$digest();

                $scope.$apply(function () {
                    $scope.showLoadingOverlay("theId");
                });

                $scope.$apply(function () {
                    $scope.hideLoadingOverlay("theId");
                });

                var overlay = angular.element(element[0].querySelector(".loading-overlay"));

                expect(overlay.hasClass("ng-hide")).toBeTruthy();
            });
        });
    });
});
