describe("LoadingOverlay", function () {
    "use strict";

    var LoadingOverlay;
    beforeEach(module('angularLoadingOverlay'));
    beforeEach(function () {
        inject(function ($injector) {
            LoadingOverlay = $injector.get("LoadingOverlay");
        });

        jasmine.addMatchers({
            toBeFunction: function () {
                return {
                    compare: function (actual) {
                        var result = {};
                        result.pass = angular.isFunction(actual);

                        return result;
                    }
                };
            }
        });
    });

    it("should not be instantiable", function () {
        expect(function () {
            var test = new LoadingOverlay();
        }).toThrowError();
    });

    describe("when mixed to object", function () {
        var target, anotherTarget;
        beforeEach(function () {
            target = {};
            anotherTarget = {};
            LoadingOverlay.mixin(target);
            LoadingOverlay.mixin(anotherTarget);
        });

        it("should mix in objects adding functions", function () {
            expect(target.showLoadingOverlay).toBeFunction();
            expect(target.hideLoadingOverlay).toBeFunction();
            expect(target.isLoadingOverlay).toBeFunction();
        });

        it("should indicate that overlay is showed", function () {
            target.showLoadingOverlay();

            expect(target.isLoadingOverlay()).toBeTruthy();
        });

        it("should not indicate that overlay is showed if it is not", function () {
            expect(target.isLoadingOverlay()).toBeFalsy();
        });

        it("should not indicate that overlay is showed for another object", function () {
            anotherTarget.showLoadingOverlay();
            expect(target.isLoadingOverlay()).toBeFalsy();
        });

        it("should not indicate that overlay is showed if overlay is hidden", function () {
            target.showLoadingOverlay();
            target.hideLoadingOverlay();

            expect(target.isLoadingOverlay()).toBeFalsy();
        });

        it("should not throw error if overlay is hidden without has been showed", function () {
            expect(function() {
                target.hideLoadingOverlay();
            }).not.toThrowError();
        });

        describe("and ids are used for overlays", function () {
            beforeEach(function () {
                target = {};
                anotherTarget = {};
                LoadingOverlay.mixin(target);
                LoadingOverlay.mixin(anotherTarget);
            });

            it("should indicate that overlay is showed", function () {
                target.showLoadingOverlay("theId");

                expect(target.isLoadingOverlay("theId")).toBeTruthy();
            });

            it("should not indicate that overlay is showed if it is not", function () {
                expect(target.isLoadingOverlay("theId")).toBeFalsy();
            });

            it("should not indicate that overlay is showed for another object", function () {
                anotherTarget.showLoadingOverlay("theId");
                expect(target.isLoadingOverlay("theId")).toBeFalsy();
            });

            it("should not indicate that overlay is showed if overlay is hidden", function () {
                target.showLoadingOverlay("theId");
                target.hideLoadingOverlay("theId");

                expect(target.isLoadingOverlay("theId")).toBeFalsy();
            });

            it("should not indicate that overlay is showed for another id", function () {
                target.showLoadingOverlay("anotherId");

                expect(target.isLoadingOverlay("theId")).toBeFalsy();
            });

            it("should not indicate that overlay has been hidden for another id", function () {
                target.showLoadingOverlay("theId");
                target.hideLoadingOverlay("anotherId");

                expect(target.isLoadingOverlay("theId")).toBeTruthy();
            });
        });

    });


});