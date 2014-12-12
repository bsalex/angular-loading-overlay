[![Build Status](https://travis-ci.org/bsalex/angular-loading-overlay.svg?branch=master)](https://travis-ci.org/bsalex/angular-loading-overlay)

#Angular loading overlay

A directive and mixin to show "Loading..." overlay.

##How to use it?
1. Specify the module in you app module dependencies ("angularLoadingOverlay");
2. Inject "LoadingOverlay" into a controller;
3. Add "LoadingOverlay.mixin(this);" or "LoadingOverlay.mixin($scope)" before you use any loading overlay function;
4. Add 'loading-overlay[="id"]' attribute to the container where you want to show overlay;
5. Use "$scope.showLoadingOverlay([id])" or "this.showLoadingOverlay([id])" to show overlay;
6. Use "$scope.hideLoadingOverlay([id])" or "this.hideLoadingOverlay([id])" to hide overlay.
