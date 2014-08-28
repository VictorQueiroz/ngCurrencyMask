(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Service/Masker', [])

		.factory('Masker', ['ngCurrencyMaskConfig', function (config) {
			var addCurrency = function (value, currency) {
				if(!value) return value;

				var newValue = value.toString();

				newValue = newValue.replace(/^/, currency ? currency + ' ' : config.currency);

				return newValue;
			};

		  /**
		   * Mask @value matching it contents.
		   */
		  var maskValue = function (value, currency) {
		    var maskedValue = value.toString(),
		    		matches = config.maskMatches;
		    
		    matches.forEach(function (key) {
		      maskedValue = maskedValue.replace(key.replace, key.with);
		    });

		    maskedValue = addCurrency(maskedValue, currency);

		    return maskedValue;
		  };
		  
		  /**
		   * Return @value to it real value.
		   */
		  var unmaskValue = function (value) {
		    var unmaskedValue = value.toString(),
		    		matches = config.unmaskMatches;
		    
		    matches.forEach(function (key) {
		      unmaskedValue = unmaskedValue.replace(key.replace, key.with);
		    });
		    
		    return unmaskedValue;
		  };

			return {
				maskValue: maskValue,
				unmaskValue: unmaskValue
			};
		}]);
})();