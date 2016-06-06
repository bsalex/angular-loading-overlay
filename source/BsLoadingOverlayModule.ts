import {BsLoadingOverlayDirectiveFactory} from './BsLoadingOverlayDirective';
import BsLoadingOverlayService from './BsLoadingOverlayService';

export default angular.module('bsLoadingOverlay', [])
    .directive('bsLoadingOverlay', BsLoadingOverlayDirectiveFactory)
    .factory('bsLoadingOverlayService', BsLoadingOverlayService);
