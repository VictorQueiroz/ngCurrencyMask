(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Filter/currencyMask', [])

		.filter('currencyMask', ['Masker', function (Masker) {
			var digestMode = function (mode) {
				switch(mode) {
					case 'mask':
						return 1;
						break;
					case 'unmask':
						return 2;
						break;
				}
			};

			var digestCurrency = function (currency) {
				if(currency === null) {
					return null;
				} else {
					return currency;
				};
			};

			return function (input, mode, currency) {
				// If there is no 'mode' defined. Mask the input.
				var mode = mode ? digestMode(mode) : digestMode('mask'),
				digestedCurrency = currency ? digestCurrency(currency) : digestCurrency(null);

				if(mode === 1) {
					var maskedValue = Masker.maskValue(input, digestedCurrency);

					return maskedValue;
				} else if (mode === 2) {
					return Masker.unmaskValue(input);
				};
			};
		}]);
})();