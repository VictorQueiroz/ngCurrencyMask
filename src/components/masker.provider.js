'use strict';

angular
	.module('ngCurrencyMask.providers.masker', [])

	.provider('$masker', function () {
		var $maskerProvider = this;

		this.defaults = {
			currency: 'R$',

			maskMatches: [
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

			unmaskMatches: [
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
			]
		};

		this.setCurrency = function (currency) {
			$maskerProvider.currency = currency;

			return $maskerProvider;
		};

		/**
		 * Add a new match task to $masker.unmaskMatches.
		 */
		this.addUnmaskMatch = function (replace, value) {
			$maskerProvider.unmaskMatches.unshift({
				'replace': replace,
				'with': value
			});

			return $maskerProvider;
		};			

		/**
		 * Add a new match task to $masker.maskMatches.
		 */
		this.addMaskMatch = function (replace, value) {
			var match = {};

			if(!value) {
				match.replace = replace;
			} else {
				match.replace = replace;
				match.with = value;
			}

			$maskerProvider.maskMatches.unshift(match);

			return $maskerProvider;
		};

		this.$get = function () {
			function $MaskerFactory () {
				var $masker = {};

				function addCurrency (value, currency) {
					if(!value) return value;

					/**
					 * Converts @value to a String instance, for Number
					 * instances doesn't have .replace() prototype.
					 */
					var newValue = value.toString();

					// Implements the currency at @newValue
					newValue = newValue.replace(/^/, (currency ? currency : $maskerProvider.defaults.currency) + ' ');

					return newValue;
				};

				/**
				 * Mask @value matching it contents.
				 */
				$masker.maskValue = function (value, currency) {
					var maskedValue = value ? value.toString() : '',
							matches = $maskerProvider.defaults.maskMatches;
					
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
				$masker.unmaskValue = function (value) {
					var unmaskedValue = value ? value.toString() : '',
							matches = $maskerProvider.defaults.unmaskMatches;
					
					matches.forEach(function (key) {
						if(key.replace instanceof Function) {
							unmaskedValue = key.replace(unmaskedValue);
						} else {
							unmaskedValue = unmaskedValue.replace(key.replace, key.with);
						}
					});
					
					return unmaskedValue;
				};

				return $masker;
			}

			return new $MaskerFactory;
		};
	});