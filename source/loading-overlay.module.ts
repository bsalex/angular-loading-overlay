import {BsLoadingOverlayDirectiveFactory} from './loading-overlay.directive';
import BsLoadingOverlayService from './loading-overlay.service';

export default angular.module('bsLoadingOverlay', [])
    .directive('bsLoadingOverlay', BsLoadingOverlayDirectiveFactory)
    .factory('bsLoadingOverlayService', BsLoadingOverlayService);
