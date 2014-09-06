(function () {
	'use strict';
	
	angular
		.module('ngCurrencyMask', [
			'ngCurrencyMask/Services',
			'ngCurrencyMask/Directives',
			'ngCurrencyMask/Filters',
			'ngCurrencyMask/Providers'
		]);
})();

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
				if(currency === null || currency === 'default') {
					return null;
				} else {
					return currency;
				};
			};

			return function (input, mode, currency) {
				if(!input) return '';

				input = input.toString();

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
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Directives', ['ngCurrencyMask/Directive/ngCurrencyMask']);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Filters', ['ngCurrencyMask/Filter/currencyMask']);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Directive/ngCurrencyMask', [])

		.directive('ngCurrencyMask', ['Masker', function (Masker) {
		  return {
		    restrict: 'A',
		    require: ['?ngModel'],
		    link: function (scope, element, attrs, controllers) {
		    	var ngModel = controllers[0],
		      		currency = !attrs.currency ? null : attrs.currency;

		    	/**
		    	 * Mask @value matching it contents.
		    	 */
		      var maskValue = function (value) {
		        return Masker.maskValue(value, currency);
		      };
		      
		      /**
		       * Return @value to it real value.
		       */
		      var unmaskValue = function (value) {
		        return Masker.unmaskValue(value);
		      };
		      
		      /**
		       * Parser who will be applied to the ngModel
		       * before the goes to DOM. That is the real ngModel value.
		       */
		      var parser = function (value) {
		        return unmaskValue(value);
		      };

		      ngModel.$parsers.push(parser);
		      
		      /**
		       * Everytime the input suffer a change,
		       * the directive will update it and mask
		       * all the typed content.
		       */
		      scope.$watch(attrs.ngModel, function (value) {
		      	if(!value || value.length < 1) { return; }

		        var maskedValue = maskValue(value);
		        
		        if(maskedValue != value) {
		          ngModel.$setViewValue(maskedValue);
		          ngModel.$render();
		        }
		      });
		    }
		  };
		}]);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Providers', [
			'ngCurrencyMask/Provider/currencyMask'
		]);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Services', ['ngCurrencyMask/Service/Masker']);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1Qcm92aWRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbmdDdXJyZW5jeU1hc2stRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9wcm92aWRlcnMuanMiLCJjb21wb25lbnRzL3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrJywgW1xuXHRcdFx0J25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlcnMnXG5cdFx0XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlcicsIFtdKVxuXG5cdFx0LmZhY3RvcnkoJ01hc2tlcicsIFsnJGN1cnJlbmN5TWFzaycsIGZ1bmN0aW9uIChkZWZhdWx0cykge1xuXHRcdFx0dmFyIGFkZEN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xuXHRcdFx0XHRpZighdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogQ29udmVydHMgQHZhbHVlIHRvIGEgU3RyaW5nIGluc3RhbmNlLCBmb3IgTnVtYmVyXG5cdFx0XHRcdCAqIGluc3RhbmNlcyBkb2Vzbid0IGhhdmUgLnJlcGxhY2UoKSBwcm90b3R5cGUuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR2YXIgbmV3VmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuXG5cdFx0XHRcdC8vIEltcGxlbWVudHMgdGhlIGN1cnJlbmN5IGF0IEBuZXdWYWx1ZVxuXHRcdFx0XHRuZXdWYWx1ZSA9IG5ld1ZhbHVlLnJlcGxhY2UoL14vLCAoY3VycmVuY3kgPyBjdXJyZW5jeSA6IGRlZmF1bHRzLmN1cnJlbmN5KSArICcgJyk7XG5cblx0XHRcdFx0cmV0dXJuIG5ld1ZhbHVlO1xuXHRcdFx0fTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cblx0XHQgICAqL1xuXHRcdCAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVuY3kpIHtcblx0XHQgICAgdmFyIG1hc2tlZFZhbHVlID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJycsXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gZGVmYXVsdHMubWFza01hdGNoZXM7XG5cdFx0ICAgIFxuXHRcdCAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICBcdGlmKGtleS5yZXBsYWNlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0XHQgICAgXHRcdG1hc2tlZFZhbHVlID0ga2V5LnJlcGxhY2UobWFza2VkVmFsdWUpO1xuXHRcdCAgICBcdH0gZWxzZSB7XG5cdFx0ICAgICAgXHRtYXNrZWRWYWx1ZSA9IG1hc2tlZFZhbHVlLnJlcGxhY2Uoa2V5LnJlcGxhY2UsIGtleS53aXRoKTtcblx0XHQgICAgXHR9XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIG1hc2tlZFZhbHVlID0gYWRkQ3VycmVuY3kobWFza2VkVmFsdWUsIGN1cnJlbmN5KTtcblxuXHRcdCAgICByZXR1cm4gbWFza2VkVmFsdWU7XG5cdFx0ICB9O1xuXHRcdCAgXG5cdFx0ICAvKipcblx0XHQgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHQgICAqL1xuXHRcdCAgdmFyIHVubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgIHZhciB1bm1hc2tlZFZhbHVlID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJycsXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gZGVmYXVsdHMudW5tYXNrTWF0Y2hlcztcblx0XHQgICAgXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgIFx0aWYoa2V5LnJlcGxhY2UgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdCAgICBcdFx0dW5tYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKHVubWFza2VkVmFsdWUpO1xuXHRcdCAgICBcdH0gZWxzZSB7XG5cdFx0ICAgICAgXHR1bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KTtcblx0XHQgICAgXG5cdFx0ICAgIHJldHVybiB1bm1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bWFza1ZhbHVlOiBtYXNrVmFsdWUsXG5cdFx0XHRcdHVubWFza1ZhbHVlOiB1bm1hc2tWYWx1ZVxuXHRcdFx0fTtcblx0XHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRmlsdGVyL2N1cnJlbmN5TWFzaycsIFtdKVxuXG5cdFx0LmZpbHRlcignY3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XG5cdFx0XHR2YXIgZGlnZXN0TW9kZSA9IGZ1bmN0aW9uIChtb2RlKSB7XG5cdFx0XHRcdHN3aXRjaChtb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSAnbWFzayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3VubWFzayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZGlnZXN0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcblx0XHRcdFx0aWYoY3VycmVuY3kgPT09IG51bGwgfHwgY3VycmVuY3kgPT09ICdkZWZhdWx0Jykge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBjdXJyZW5jeTtcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIG1vZGUsIGN1cnJlbmN5KSB7XG5cdFx0XHRcdGlmKCFpbnB1dCkgcmV0dXJuICcnO1xuXG5cdFx0XHRcdGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcblxuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXG5cdFx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyksXG5cdFx0XHRcdGRpZ2VzdGVkQ3VycmVuY3kgPSBjdXJyZW5jeSA/IGRpZ2VzdEN1cnJlbmN5KGN1cnJlbmN5KSA6IGRpZ2VzdEN1cnJlbmN5KG51bGwpO1xuXG5cdFx0XHRcdGlmKG1vZGUgPT09IDEpIHtcblx0XHRcdFx0XHR2YXIgbWFza2VkVmFsdWUgPSBNYXNrZXIubWFza1ZhbHVlKGlucHV0LCBkaWdlc3RlZEN1cnJlbmN5KTtcblxuXHRcdFx0XHRcdHJldHVybiBtYXNrZWRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSAyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlci9jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5wcm92aWRlcignJGN1cnJlbmN5TWFzaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBtYXNrTWF0Y2hlcyA9IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFwuWzAtOV0pKD89WzAtOV17MH0kKS9nLCAnd2l0aCc6ICckMTAnIH0sLy8gQ29udmVydHMgWFhYWC5YIHRvIFhYWFguWDBcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZCkqKD89KFxcZHswLH0pJCkvZywgJ3dpdGgnOiAnJCYsMDAnIH0sLy8gQ29udmVydHMgWFhYWCB0byBYWFhYLDAwXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGR7MX0pJC8sICd3aXRoJzogJzAsMCQxJyB9LC8vIENvbnZlcnRzIFggdG8gMCwwWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJywkMSd9LC8vIENvbnZlcnRzIFhYIHRvIDAsWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8sKFxcZHszLH0pJC8sICd3aXRoJzogJyQxLDAwJyB9LC8vIENvbnZlcnRzIFgsWFhYIHRvIFgsWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eLChcXGR7Mn0pJC8sICd3aXRoJzogXCIwLCQxXCIgfSwvLyBDb252ZXJ0cyAsWFggdG8gMCxYWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyg/OlxcLHsyLH0pKy9nLCAnd2l0aCc6IFwiLFwiIH0sLy8gQ29udmVydHMgYWxsIGR1cGxpY2F0ZWQgY29tbWEgZm9yIGp1c3Qgb25lXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvW0Etent9XFxbXFxdXyFcXC5dL2csICd3aXRoJzogXCJcIiB9LC8vIENvbnZlcnRzIGFsbCBub24tZGlnaXQgbnVtYmVycyB0byAnJ1xuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ3dpdGgnOiBcIiQxLlwiIH0sLy8gQ29udmVydHMgWFhYWFhYIHRvIFhYWC5YWFhcdFx0XHRcdFxuXHRcdFx0XSxcblxuXHRcdFx0dW5tYXNrTWF0Y2hlcyA9IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9cXEQvZywgJ3dpdGgnOiBcIlwiIH0sIC8vIENvbnZlcnRzICBhbGwgbm9uLWRpZ2l0IG51bWJlcnMgdG8gJydcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZHsxfSkkLywgJ3dpdGgnOiAnMC4wJDEnIH0sIC8vIENvbnZlcnRzIFggdG8gWC4wWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJy4kMSd9LCAvLyBDb252ZXJ0cyBYWCB0byAuWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oLDAwfFxcLjAwJCkvZywgJ3dpdGgnOiAnJyB9LCAvLyBDb252ZXJ0cyBhbGwgLFhYIGFuZCAuWFggdG8gbm90aGluZ1x0XHRcdFx0XG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXigwezEsfSkvLCAnd2l0aCc6ICcnIH0sIC8vIENvbnZlcnRzIHplcm9zIGF0IHRoZSBzdGFydCBvZiB0aGUgc3RyaW5nIHRvIG5vdGhpbmdcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eXFwuKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAuJDFcIiB9LCAvLyBDb252ZXJ0cyAuWFggdG8gMC5YWFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBDbGVhbiB0aGUgZW5kIG9mIHRoZSBzdHJpbmcgZnJvbVxuXHRcdFx0XHQgKiB1bnNpZ25pZmljYW50IG51bWJlcnMgY29udmVydGluZ1xuXHRcdFx0XHQgKiBYWFguMzBYWFhYIHRvIFhYWC4zMFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0eyAncmVwbGFjZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYoIXZhbHVlKSByZXR1cm4gJyc7XG5cblx0XHRcdFx0XHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1xcLihcXGR7Myx9KSQnKSxcblx0XHRcdFx0XHRcdG1hdGNoID0gdmFsdWUubWF0Y2gocmVnZXgpO1xuXG5cdFx0XHRcdFx0XHRpZihtYXRjaCBpbnN0YW5jZW9mIEFycmF5ICYmIG1hdGNoWzFdKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShtYXRjaCwgbWF0Y2gudG9TdHJpbmcoKS5zdWJzdHIoMCwgMikpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXG5cdFx0XHR2YXIgJHNlbGYgPSB0aGlzLFxuXHRcdFx0JGN1cnJlbmN5TWFzayA9IHtcblx0XHRcdFx0Y3VycmVuY3k6ICdSJCcsXG5cblx0XHRcdFx0Ly8gTWF0Y2hlcyB3aG8gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBjb250ZW50LlxuXHRcdFx0XHRtYXNrTWF0Y2hlczogbWFza01hdGNoZXMsXG5cblx0XHRcdFx0dW5tYXNrTWF0Y2hlczogdW5tYXNrTWF0Y2hlc1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5zZXRDdXJyZW5jeSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkge1xuXHRcdFx0XHQkY3VycmVuY3lNYXNrLmN1cnJlbmN5ID0gY3VycmVuY3k7XG5cblx0XHRcdFx0cmV0dXJuICRzZWxmO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGQgYSBuZXcgbWF0Y2ggdGFzayB0byAkY3VycmVuY3lNYXNrLnVubWFza01hdGNoZXMuXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuYWRkVW5tYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdFx0JGN1cnJlbmN5TWFzay51bm1hc2tNYXRjaGVzLnVuc2hpZnQoe1xuXHRcdFx0XHRcdCdyZXBsYWNlJzogcmVwbGFjZSxcblx0XHRcdFx0XHQnd2l0aCc6IHZhbHVlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiAkc2VsZjtcblx0XHRcdH07XHRcdFx0XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJGN1cnJlbmN5TWFzay5tYXNrTWF0Y2hlcy5cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5hZGRNYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIG1hdGNoID0ge307XG5cblx0XHRcdFx0aWYoIXZhbHVlKSB7XG5cdFx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdFx0bWF0Y2gud2l0aCA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGN1cnJlbmN5TWFzay5tYXNrTWF0Y2hlcy51bnNoaWZ0KG1hdGNoKTtcblxuXHRcdFx0XHRyZXR1cm4gJHNlbGY7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiAkY3VycmVuY3lNYXNrO1xuXHRcdFx0fTtcblx0XHR9KTtcdFx0XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlcycsIFsnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJ10pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLCBbJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJywgW10pXG5cblx0XHQuZGlyZWN0aXZlKCduZ0N1cnJlbmN5TWFzaycsIFsnTWFza2VyJywgZnVuY3Rpb24gKE1hc2tlcikge1xuXHRcdCAgcmV0dXJuIHtcblx0XHQgICAgcmVzdHJpY3Q6ICdBJyxcblx0XHQgICAgcmVxdWlyZTogWyc/bmdNb2RlbCddLFxuXHRcdCAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykge1xuXHRcdCAgICBcdHZhciBuZ01vZGVsID0gY29udHJvbGxlcnNbMF0sXG5cdFx0ICAgICAgXHRcdGN1cnJlbmN5ID0gIWF0dHJzLmN1cnJlbmN5ID8gbnVsbCA6IGF0dHJzLmN1cnJlbmN5O1xuXG5cdFx0ICAgIFx0LyoqXG5cdFx0ICAgIFx0ICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0ICAgIFx0ICovXG5cdFx0ICAgICAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIE1hc2tlci5tYXNrVmFsdWUodmFsdWUsIGN1cnJlbmN5KTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgIH07XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcblx0XHQgICAgICAgKiBiZWZvcmUgdGhlIGdvZXMgdG8gRE9NLiBUaGF0IGlzIHRoZSByZWFsIG5nTW9kZWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIHVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXG5cdFx0ICAgICAgbmdNb2RlbC4kcGFyc2Vycy5wdXNoKHBhcnNlcik7XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogRXZlcnl0aW1lIHRoZSBpbnB1dCBzdWZmZXIgYSBjaGFuZ2UsXG5cdFx0ICAgICAgICogdGhlIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdCBhbmQgbWFza1xuXHRcdCAgICAgICAqIGFsbCB0aGUgdHlwZWQgY29udGVudC5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgXHRpZighdmFsdWUgfHwgdmFsdWUubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cblxuXHRcdCAgICAgICAgdmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICAgIFxuXHRcdCAgICAgICAgaWYobWFza2VkVmFsdWUgIT0gdmFsdWUpIHtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgfSk7XG5cdFx0ICAgIH1cblx0XHQgIH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1Byb3ZpZGVycycsIFtcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlci9jdXJyZW5jeU1hc2snXG5cdFx0XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svU2VydmljZXMnLCBbJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2UvTWFza2VyJ10pO1xufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=