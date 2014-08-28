ngCurrencyMask
==============

Format an entire input as a currency. Check this live [demo](http://plnkr.co/edit/zjJw8gfvaVFIUN9OIvea?p=preview) example.

## Usage
```
bower install ng-currency-mask --save
```

## Loading the module
```
<script>
	angular
	  .module('app', ['ngCurrencyMask']);
</script>
```

## Applying in the DOM
```
<form>
	<input type="text" ng-model="value" ng-currency-mask> <!-- Masked input -->
	{{ text }} <!-- Unmasked output -->
</form>
```

## Using 'currencyMask' filter
```
<form>
	<input type="text" ng-model="value"> <!-- Unmasked input -->
	{{ value | currencyMask:'mask':'USD' }} <!-- Masked output -->
	{{ value | currencyMask:'mask':'BRL' }} <!-- Masked output -->
	{{ value | currencyMask:'unmask' }} <!-- Unmasked output -->
</form>
```

## Configuring
```
<script>
	angular
	  .module('app', ['ngCurrencyMask'])

	  .config(['$currencyMaskProvider', function ($currencyMaskProvider) {
	  	$currencyMaskProvider.setCurrency('USD');
	  }]);
</script>
```

### $currencyMaskProvider

- `setCurrency(currency)`
	- `currency` - The `currency` which will be used all time for directives, filters.

- `addMaskMatch(replace, value)`
	- `replace` - The value/regular expression which will be used to match the searched value in the input content.
	- `value` - The value which will replace the found string at the input content.

- `addUnmaskMatch(replace, value)` It will be used when your field is getting unserialized and all the commas and dots are getting removed.