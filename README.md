# Angular loading overlay

[![Build Status](https://travis-ci.org/bsalex/angular-loading-overlay.svg?branch=master)](https://travis-ci.org/bsalex/angular-loading-overlay)
[![Code Climate](https://codeclimate.com/github/bsalex/angular-loading-overlay/badges/gpa.svg)](https://codeclimate.com/github/bsalex/angular-loading-overlay)
[![Test Coverage](https://codeclimate.com/github/bsalex/angular-loading-overlay/badges/coverage.svg)](https://codeclimate.com/github/bsalex/angular-loading-overlay/coverage)  
[![Package Quality](http://npm.packagequality.com/badge/angular-loading-overlay.png)](http://packagequality.com/#?package=angular-loading-overlay)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8310c436284d4919876a1f8e7ac6e0c0)](https://www.codacy.com/app/bs-alex-mail/angular-loading-overlay?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bsalex/angular-loading-overlay&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/bsalex/angular-loading-overlay](https://badges.gitter.im/bsalex/angular-loading-overlay.svg)](https://gitter.im/bsalex/angular-loading-overlay?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Join the chat at https://gitter.im/bsalex/angular-loading-overlay](https://badges.gitter.im/bsalex/angular-loading-overlay.svg)](https://gitter.im/bsalex/angular-loading-overlay?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The module provides your app with overlays (like "Loading...") that could be shown on async operations.  
It supports multiple independent named overlays on one page.  
It also allows you to create preconfigured handlers and wrap promises to show and hide overlays on promise work started and finished.

## <a href="http://bsalex.github.io/angular-loading-overlay/_site/" target="_blank">Docs & Examples</a>

## Installation
`bower install --save angular-loading-overlay`  
or  
`npm install --save angular-loading-overlay`

## Usage

### In javascript
````javascript
angular.module("your nodule name", [
  "bsLoadingOverlay"
]);


angular.module("your nodule name")
  .controller(function ($timeout, bsLoadingOverlayService) {

    bsLoadingOverlayService.start();

    $timeout(bsLoadingOverlayService.stop, 5000);

  });
````
### In html
````html
<div bs-loading-overlay>
  loaded data usage here
</div>
````
# License

Copyright (c) 2016 Oleksandr Beshchuk <[bs.alex.mail@gmail.com](mailto:bs.alex.mail@gmail.com)>  
Licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
