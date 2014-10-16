# ngCurrencyMask
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/VictorQueiroz/ngCurrencyMask?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/VictorQueiroz/ngCurrencyMask)
[![Build Status](http://img.shields.io/travis/VictorQueiroz/ngCurrencyMask.svg?style=flat)](https://travis-ci.org/VictorQueiroz/ngCurrencyMask)

==============

Format an entire input as a currency. Check this live [demo](http://plnkr.co/edit/zjJw8gfvaVFIUN9OIvea?p=preview) example.

## Usage
```
bower install ng-currency-mask --save
```

## Loading the module
```js
	angular
	  .module('app', ['ngCurrencyMask']);
```

## Applying in the DOM
```html
<form>
	<input type="text" ng-model="value" ng-currency-mask> <!-- Masked input -->
	{{ text }} <!-- Unmasked output -->
</form>
```

## Using 'currencyMask' filter

In the DOM:
```html
<form>
	<input type="text" ng-model="value"> <!-- Unmasked input -->
	{{ value | currencyMask:'mask':'USD' }} <!-- Masked output -->
	{{ value | currencyMask:'mask':'BRL' }} <!-- Masked output -->
	{{ value | currencyMask:'mask':'default' }} <!-- Masked output -->
	{{ value | currencyMask:'unmask' }} <!-- Unmasked output -->
</form>
```

On your controller, through `$filter`:
```js
	angular
		.module('app', ['ngCurrencyMask'])

		.controller('ProductCreateCtrl', function ($filter, Product) {
			var myCurrency = 'USD',
			currencyMaskFilter = $filter('currencyMask');

			$scope.product = new Product;

			$scope.saveProduct = function (product) {
				$scope.product.price = currencyMaskFilter('unmask', myCurrency);
			}
		});
```

## Configuring
```js
	angular
	  .module('app', ['ngCurrencyMask'])

	  .config(['$maskerProvider', function ($maskerProvider) {
	  	// $maskerProvider.setCurrency('USD');
	  	// $maskerProvider.setCurrency('BRL');
	  	$maskerProvider.setCurrency('MyAnotherCurrency');

	  	$maskerProvider.addMaskMatch(function (value) {
	  		return value;
	  	});
	  }]);
```

### $maskerProvider

- `setCurrency(currency)`
	- `currency` - The `currency` which will be used all time for directives, filters.

- `addMaskMatch(replace, value)`
	- `replace` {String|RegExp|Function} - The value/regular expression which will be used to match the searched value in the input content.
		- `Function` (value) - It should return the value with the changes which you want, see the example below.
	- `value` - The value which will replace the found string at the input content.

- `addUnmaskMatch(replace, value)` It will be used when your field is getting unserialized and all the commas and dots are getting removed.
