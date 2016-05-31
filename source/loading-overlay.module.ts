/// <reference path="./loading-overlay.directive.ts"/>
/// <reference path="./loading-overlay.service.ts"/>

module BsLoadingOverlay {

    export const bsLoadingOverlayModule: ng.IModule = angular.module('bsLoadingOverlay', [])
        .directive('bsLoadingOverlay', BsLoadingOverlayDirectiveFactory)
        .factory('bsLoadingOverlayService', BsLoadingOverlayService);
}
