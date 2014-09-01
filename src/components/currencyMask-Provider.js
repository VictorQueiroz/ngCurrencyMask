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
					{ 'replace': function (value) {
						return value.toString();
					} },
					{ 'replace': function (value) {
						/**
						 * Example: http://regex101.com/r/iW4qG0/1
						 */
						var match = /(\.[0-9])(?=[0-9]{0}$)/g;

						return value.replace(match, '$10');
					} },
					{ 'replace': function (value) {
						return value.replace(value[value.lastIndexOf('.')], ',');
					} },
					{ 'replace': function (value) {
						/**
						 * Example: http://regex101.com/r/lE0tN9/1
						 */
						if(value[value.length - 3] !== '.') {
							value = value.replace(/^(\d)*(?=(\d{0,})$)/g, '$&.00');
						}

						return value;
					} },
					{ 'replace': /[^\d]/g, 'with': "" },
					{ 'replace': /(\d{2})$/, 'with': ",$1" },
					{ 'replace': /,(\d{3,})$/, 'with': '$1,00' },
					{ 'replace': /^(0{1,})/, 'with': '' },
					{ 'replace': /^,(\d{2})$/, 'with': "0,$1" },
					{ 'replace': /(\d)(?=(\d{3})+(?!\d))/g, 'with': "$1." }
				],

				unmaskMatches: [
					{ 'replace': function (value) {
						return value;
					} },
					{ 'replace': function (value) {
						if(!value) return '';

						/**
						 * Example: http://regex101.com/r/dZ0rX7/1
						 */
						var match = (value.match(/(^[\d\D]{0,})(\,)/))[1];

						if(match) {
							value = value.replace(match, match.replace(/\D/g, ''));
						}
						
						value = value.replace(value[value.lastIndexOf(',')], '.');

						return value;
					} },
					{ replace: /^(\d{1})$/, with: '0.0$1'},
					{ 'replace': /(\d{2})$/, 'with': ".$1" },
					{ 'replace': /\.(\d{3,})$/, 'with': '$1.00' },
					{ 'replace': /^(0{1,})/, 'with': '' },
					{ 'replace': /^\.(\d{2})$/, 'with': "0.$1" },
					{ replace: function (value) {
						if(!value) return '';

						return parseFloat(value);
					} }
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
				var match = {};

				if(!value) {
					match.replace = replace;
				} else {
					match.replace = replace;
					match.with = value;
				}

				$currencyMask.maskMatches.unshift(match);

				return $self;
			};

			this.$get = function () {
				return $currencyMask;
			};
		});		
})();