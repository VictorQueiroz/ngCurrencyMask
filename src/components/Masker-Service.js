(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Service/Masker', [])

		.factory('Masker', ['$currencyMask', function (defaults) {
			var addCurrency = function (value, currency) {
				if(!value) return value;

				/**
				 * Converts @value to a String instance, for Number
				 * instances doesn't have .replace() prototype.
				 */
				var newValue = value.toString();

				// Implements the currency at @newValue
				newValue = newValue.replace(/^/, (currency ? currency : defaults.currency) + ' ');

				return newValue;
			};

		  /**
		   * Mask @value matching it contents.
		   */
		  var maskValue = function (value, currency) {
		    var maskedValue = value ? value.toString() : '',
		    		matches = defaults.maskMatches;
		    
		    matches.forEach(function (key) {
		    	if(key.replace instanceof Function) {
		    		maskedValue = key.replace(maskedValue);
		    	} else {
		      	maskedValue = maskedValue.replace(key.replace, key.with);
		    	}
		    });

		    maskedValue = addCurrency(maskedValue, currency);

		    return maskedValue;
		  };
		  
		  /**
		   * Return @value to it real value.
		   */
		  var unmaskValue = function (value) {
		    var unmaskedValue = value ? value.toString() : '',
		    		matches = defaults.unmaskMatches;
		    
		    matches.forEach(function (key) {
		    	if(key.replace instanceof Function) {
		    		unmaskedValue = key.replace(unmaskedValue);
		    	} else {
		      	unmaskedValue = unmaskedValue.replace(key.replace, key.with);
		    	}
		    });
		    
		    return unmaskedValue;
		  };

			return {
				maskValue: maskValue,
				unmaskValue: unmaskValue
			};
		}]);
})();