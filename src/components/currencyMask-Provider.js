(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Provider/currencyMask', [])

		.provider('$currencyMask', function () {
			var $self = this,
			$currencyMask = {
				currency: 'R$',

				// Matches who will be applied to the input content.
				maskMatches: [
					{ 'replace': /[^\d]/g, 'with': "" },
					{ 'replace': /(\d{2})$/, 'with': ",$1" },
					{ 'replace': /,(\d{3,})$/, 'with': '$1,00' },
					{ 'replace': /^(0{1,})/, 'with': '' },
					{ 'replace': /^,(\d{2})$/, 'with': "0,$1" },
					{ 'replace': /(\d)(?=(\d{3})+(?!\d))/g, 'with': "$1." }
				],

				unmaskMatches: [
					{ 'replace': /\D/g, 'with': '' }
				]
			};

			this.setCurrency = function (currency) {
				$currencyMask.currency = currency;

				return $self;
			};

			/**
			 * Add a new match task to $currencyMask.unmaskMatches.
			 */
			this.addUnmaskMatch = function (replace, value) {
				$currencyMask.unmaskMatches.unshift({
					'replace': replace,
					'with': value
				});

				return $self;
			};			

			/**
			 * Add a new match task to $currencyMask.maskMatches.
			 */
			this.addMaskMatch = function (replace, value) {
				$currencyMask.maskMatches.unshift({
					'replace': replace,
					'with': value
				});

				return $self;
			};

			this.$get = function () {
				var currencyMask;

				angular.copy($currencyMask, currencyMask);

				return $currencyMask;
			};
		});		
})();