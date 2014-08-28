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

			return function (input, mode) {
				// If there is no 'mode' defined. Mask the input.
				var mode = mode ? digestMode(mode) : digestMode('mask');

				if(mode === 1) {
					return Masker.maskValue(input);
				} else if (mode === 2) {
					return Masker.unmaskValue(input);
				};
			};
		}]);
})();