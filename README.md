ngCurrencyMask
==============

Format an entire input as a currency. Check this live [demo](http://plnkr.co/edit/zjJw8gfvaVFIUN9OIvea?p=preview) example.

### Usage
```
bower install ng-currency-mask --save
```

### Loading the module
```
<script>
	angular
	  .module('app', ['ngCurrencyMask']);
</script>
```

### Applying in the DOM
```
<form>
	<input type="text" ng-model="value" ng-currency-mask> <!-- Masked input -->
	{{ text }} <!-- Unmasked output -->
</form>
```

### Using 'currencyMask' filter
```
<form>
	<input type="text" ng-model="value"> <!-- Unmasked input -->
	{{ value | currencyMask:'mask':'USD' }} <!-- Masked output -->
	{{ value | currencyMask:'mask':'BRL' }} <!-- Masked output -->
	{{ value | currencyMask:'unmask' }} <!-- Unmasked output -->
</form>
```

### Configuring
```
<script>
	angular
	  .module('app', ['ngCurrencyMask'])

	  .config(['$currencyMaskProvider', function ($currencyMaskProvider) {
	  	$currencyMaskProvider.setCurrency('USD');

		  /**
		   * This is an example.
		   * It will replace all zeros with 8 numbers. TRY IT!
		   */
		   $currencyMaskProvider.addMaskMatch(/0/g, '8');
	  }]);
</script>
```