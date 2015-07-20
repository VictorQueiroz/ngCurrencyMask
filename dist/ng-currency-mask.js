function $MaskerProvider () {
	var defaults = this.defaults = {
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
		this.currency = currency;

		return this;
	};

	/**
	 * Add a new match task to $masker.unmaskMatches.
	 */
	this.addUnmaskMatch = function (replace, value) {
		this.unmaskMatches.unshift({
			'replace': replace,
			'with': value
		});

		return this;
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

		this.maskMatches.unshift(match);

		return this;
	};

	this.$get = ["$locale", function ($locale) {
		var $masker = {
			options: {}
		};

		var options = $masker.options = angular.extend({}, $masker.options, defaults);

		options.currency = options.currency || $locale.NUMBER_FORMATS.CURRENCY_SYM;

		function addCurrency (value, currency) {
			if(!value) return value;

			/**
			 * Converts @value to a String instance, for Number
			 * instances doesn't have .replace() prototype.
			 */
			var newValue = value.toString();

			// Implements the currency at @newValue
			newValue = newValue.replace(/^/, (currency ? currency : options.currency));

			return newValue;
		}

		/**
		 * Mask @value matching it contents.
		 */
		$masker.maskValue = function (value, currency) {
			var maskedValue = value ? value.toString() : '',
					matches = options.maskMatches;
			
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
					matches = options.unmaskMatches;
			
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
	}];
}

function CurrencyMaskFilter ($masker) {
	var getDigestMode = function (mode) {
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
		if(currency === null || currency === 'default') {
			return null;
		} else {
			return currency;
		};
	};

	return function (input, mode, currency) {
		if(!input) {
			return '';
		}

		input = input.toString();

		// If there is no 'mode' defined. Mask the input.
		var mode = mode ? getDigestMode(mode) : getDigestMode('mask'),
		digestedCurrency = currency ? digestCurrency(currency) : digestCurrency(null);

		if(mode === 1) {
			var maskedValue = $masker.maskValue(input, digestedCurrency);

			return maskedValue;
		} else if (mode === 2) {
			return $masker.unmaskValue(input);
		};
	};
}
CurrencyMaskFilter.$inject = ["$masker"];
function CurrencyMaskDirective ($masker) {
	return {
		restrict: 'A',
		require: ['?ngModel'],
		link: function (scope, element, attrs, controllers) {
			var ngModel = controllers[0],
					currency = !attrs.currency ? null : attrs.currency;

			/**
			 * Mask @value matching it contents.
			 */
			function maskValue (value) {
				return $masker.maskValue(value, currency);
			}
			
			/**
			 * Return @value to it real value.
			 */
			function unmaskValue (value) {
				return $masker.unmaskValue(value);
			}
			
			/**
			 * Parser who will be applied to the ngModel
			 * before the goes to DOM. That is the real ngModel value.
			 */
			ngModel.$parsers.push(function (value) {
				return unmaskValue(value);
			});
			
			/**
			 * Everytime the input suffer a change,
			 * the directive will update it and mask
			 * all the typed content.
			 */
			scope.$watch(attrs.ngModel, function (value) {
				if(!value || value.length < 1) {
					return;
				}

				var maskedValue = maskValue(value);
				
				if(maskedValue != value) {
					ngModel.$setViewValue(maskedValue);
					ngModel.$render();
				}
			});

			element.bind('paste', function (evt) {
				var clipboardData = evt.clipboardData || evt.originalEvent.clipboardData || window.clipboardData;
				var pastedData = clipboardData.getData('text');

				if (isNaN(pastedData)) {
					evt.preventDefault();
				}
			});

			element.bind('keypress', function (evt) {
				var charCode = evt.charCode;
				var keyCode = evt.which || evt.keyCode;

				if((evt.ctrlKey && keyCode == 118) || charCode == 0){
					return;
				}

				if (keyCode < 48 || keyCode > 57) {
					evt.preventDefault();
				}
			});
		}
	};
}
CurrencyMaskDirective.$inject = ["$masker"];

angular.module('ngCurrencyMask', [])
.directive('ngCurrencyMask', CurrencyMaskDirective)
.filter('currencyMask', CurrencyMaskFilter)
.provider('$masker', $MaskerProvider);