(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Provider/currencyMask', [])

		.provider('$currencyMask', function () {
			var maskMatches = [
				{ 'replace': /(\.[0-9])(?=[0-9]{0}$)/g, 'with': '$10' },// Converts XXXX.X to XXXX.X0
				{ 'replace': /^(\d)*(?=(\d{0,})$)/g, 'with': '$&,00' },// Converts XXXX to XXXX,00
				{ 'replace': /^(\d{1})$/, 'with': '0,0$1' },// Converts X to 0,0X
				{ 'replace': /(\d{2})$/, 'with': ',$1'},// Converts XX to 0,XX
				{ 'replace': /,(\d{3,})$/, 'with': '$1,00' },// Converts X,XXX to X,XX
				{ 'replace': /^,(\d{2})$/, 'with': "0,$1" },// Converts ,XX to 0,XX
				{ 'replace': /(?:\,{2,})+/g, 'with': "," },// Converts all duplicated comma for just one
				{ 'replace': /[A-z{}\[\]_!\.]/g, 'with': "" },// Converts all non-digit numbers to ''
				{ 'replace': /(\d)(?=(\d{3})+(?!\d))/g, 'with': "$1." },// Converts XXXXXX to XXX.XXX				
			],

			unmaskMatches = [
				{ 'replace': /\D/g, 'with': "" }, // Converts  all non-digit numbers to ''
				{ 'replace': /^(\d{1})$/, 'with': '0.0$1' }, // Converts X to X.0X
				{ 'replace': /(\d{2})$/, 'with': '.$1'}, // Converts XX to .XX
				{ 'replace': /(,00|\.00$)/g, 'with': '' }, // Converts all ,XX and .XX to nothing				
				{ 'replace': /^(0{1,})/, 'with': '' }, // Converts zeros at the start of the string to nothing
				{ 'replace': /^\.(\d{2})$/, 'with': "0.$1" }, // Converts .XX to 0.XX

				/**
				 * Clean the end of the string from
				 * unsignificant numbers converting
				 * XXX.30XXXX to XXX.30
				 */
				{ 'replace': function (value) {
						if(!value) return '';

						var regex = new RegExp('\.(\d{3,})$'),
						match = value.match(regex);

						if(match instanceof Array && match[1]) {
							value = value.replace(match, match.toString().substr(0, 2));
						}

						return value;
					}
				}
			];

			var $self = this,
			$currencyMask = {
				currency: 'R$',

				// Matches who will be applied to the input content.
				maskMatches: maskMatches,

				unmaskMatches: unmaskMatches
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