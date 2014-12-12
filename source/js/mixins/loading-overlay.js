(function () {
    "use strict";

    angular.module("angularLoadingOverlay")
        .factory("LoadingOverlay", [function () {
            return {
                mixin: function (target) {
                    var activeOverlays = [];

                    target.showLoadingOverlay = function (key) {
                        activeOverlays.push(key);
                    };

                    target.hideLoadingOverlay = function (key) {
                        var position = activeOverlays.indexOf(key);

                        if (position !== -1) {
                            activeOverlays.splice(position, 1);
                        }
                    };

                    target.isLoadingOverlay = function (key) {
                        return activeOverlays.indexOf(key) !== -1;
                    };
                }
            };
        }]);
})();