(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Service/Masker', [])

		.factory('Masker', ['ngCurrencyMaskConfig', function (config) {
		  /**
		   * Mask @value matching it contents.
		   */
		  var maskValue = function (value) {
		    var maskedValue = value.toString(),
		    		matches = config.matches;
		    
		    matches.forEach(function (key) {
		      maskedValue = maskedValue.replace(key.replace, key.with);
		    });
		    
		    return maskedValue;
		  };
		  
		  /**
		   * Return @value to it real value.
		   */
		  var unmaskValue = function (value) {
		  	var unmaskedValue = maskValue(value).replace(/\D/g, '');

		    return unmaskedValue;
		  };

			return {
				maskValue: maskValue,
				unmaskValue: unmaskValue
			};
		}]);
})();