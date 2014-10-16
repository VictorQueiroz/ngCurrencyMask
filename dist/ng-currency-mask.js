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
		.module('ngCurrencyMask.services.Masker', [])

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
		.module('ngCurrencyMask.filters.currencyMask', [])

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
		.module('ngCurrencyMask.providers.currencyMask', [])

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
		.module('ngCurrencyMask.directives', ['ngCurrencyMask.directives.ngCurrencyMask']);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Filters', ['ngCurrencyMask/Filter/currencyMask']);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask.directives.ngCurrencyMask', [])

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
		.module('ngCurrencyMask.providers', [
			'ngCurrencyMask.providers.currencyMask'
		]);
})();
(function () {
	'use strict';

	angular
		.module('ngCurrencyMask.services', ['ngCurrencyMask.services.Masker']);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLnNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay5maWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay5wcm92aWRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbmdDdXJyZW5jeU1hc2suZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9wcm92aWRlcnMuanMiLCJjb21wb25lbnRzL3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrJywgW1xuXHRcdFx0J25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlcnMnXG5cdFx0XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5zZXJ2aWNlcy5NYXNrZXInLCBbXSlcblxuXHRcdC5mYWN0b3J5KCdNYXNrZXInLCBbJyRjdXJyZW5jeU1hc2snLCBmdW5jdGlvbiAoZGVmYXVsdHMpIHtcblx0XHRcdHZhciBhZGRDdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVuY3kpIHtcblx0XHRcdFx0aWYoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG5cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIENvbnZlcnRzIEB2YWx1ZSB0byBhIFN0cmluZyBpbnN0YW5jZSwgZm9yIE51bWJlclxuXHRcdFx0XHQgKiBpbnN0YW5jZXMgZG9lc24ndCBoYXZlIC5yZXBsYWNlKCkgcHJvdG90eXBlLlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dmFyIG5ld1ZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcblxuXHRcdFx0XHQvLyBJbXBsZW1lbnRzIHRoZSBjdXJyZW5jeSBhdCBAbmV3VmFsdWVcblx0XHRcdFx0bmV3VmFsdWUgPSBuZXdWYWx1ZS5yZXBsYWNlKC9eLywgKGN1cnJlbmN5ID8gY3VycmVuY3kgOiBkZWZhdWx0cy5jdXJyZW5jeSkgKyAnICcpO1xuXG5cdFx0XHRcdHJldHVybiBuZXdWYWx1ZTtcblx0XHRcdH07XG5cblx0XHQgIC8qKlxuXHRcdCAgICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIGN1cnJlbmN5KSB7XG5cdFx0ICAgIHZhciBtYXNrZWRWYWx1ZSA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGRlZmF1bHRzLm1hc2tNYXRjaGVzO1xuXHRcdCAgICBcblx0XHQgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgXHRpZihrZXkucmVwbGFjZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG5cdFx0ICAgIFx0XHRtYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgXHR9IGVsc2Uge1xuXHRcdCAgICAgIFx0bWFza2VkVmFsdWUgPSBtYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KTtcblxuXHRcdCAgICBtYXNrZWRWYWx1ZSA9IGFkZEN1cnJlbmN5KG1hc2tlZFZhbHVlLCBjdXJyZW5jeSk7XG5cblx0XHQgICAgcmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblx0XHQgIFxuXHRcdCAgLyoqXG5cdFx0ICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgKi9cblx0XHQgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICB2YXIgdW5tYXNrZWRWYWx1ZSA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGRlZmF1bHRzLnVubWFza01hdGNoZXM7XG5cdFx0ICAgIFxuXHRcdCAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICBcdGlmKGtleS5yZXBsYWNlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0XHQgICAgXHRcdHVubWFza2VkVmFsdWUgPSBrZXkucmVwbGFjZSh1bm1hc2tlZFZhbHVlKTtcblx0XHQgICAgXHR9IGVsc2Uge1xuXHRcdCAgICAgIFx0dW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xuXHRcdCAgICBcdH1cblx0XHQgICAgfSk7XG5cdFx0ICAgIFxuXHRcdCAgICByZXR1cm4gdW5tYXNrZWRWYWx1ZTtcblx0XHQgIH07XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG1hc2tWYWx1ZTogbWFza1ZhbHVlLFxuXHRcdFx0XHR1bm1hc2tWYWx1ZTogdW5tYXNrVmFsdWVcblx0XHRcdH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMuY3VycmVuY3lNYXNrJywgW10pXG5cblx0XHQuZmlsdGVyKCdjdXJyZW5jeU1hc2snLCBbJ01hc2tlcicsIGZ1bmN0aW9uIChNYXNrZXIpIHtcblx0XHRcdHZhciBkaWdlc3RNb2RlID0gZnVuY3Rpb24gKG1vZGUpIHtcblx0XHRcdFx0c3dpdGNoKG1vZGUpIHtcblx0XHRcdFx0XHRjYXNlICdtYXNrJzpcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAndW5tYXNrJzpcblx0XHRcdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHZhciBkaWdlc3RDdXJyZW5jeSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkge1xuXHRcdFx0XHRpZihjdXJyZW5jeSA9PT0gbnVsbCB8fCBjdXJyZW5jeSA9PT0gJ2RlZmF1bHQnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGN1cnJlbmN5O1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSwgY3VycmVuY3kpIHtcblx0XHRcdFx0aWYoIWlucHV0KSByZXR1cm4gJyc7XG5cblx0XHRcdFx0aW5wdXQgPSBpbnB1dC50b1N0cmluZygpO1xuXG5cdFx0XHRcdC8vIElmIHRoZXJlIGlzIG5vICdtb2RlJyBkZWZpbmVkLiBNYXNrIHRoZSBpbnB1dC5cblx0XHRcdFx0dmFyIG1vZGUgPSBtb2RlID8gZGlnZXN0TW9kZShtb2RlKSA6IGRpZ2VzdE1vZGUoJ21hc2snKSxcblx0XHRcdFx0ZGlnZXN0ZWRDdXJyZW5jeSA9IGN1cnJlbmN5ID8gZGlnZXN0Q3VycmVuY3koY3VycmVuY3kpIDogZGlnZXN0Q3VycmVuY3kobnVsbCk7XG5cblx0XHRcdFx0aWYobW9kZSA9PT0gMSkge1xuXHRcdFx0XHRcdHZhciBtYXNrZWRWYWx1ZSA9IE1hc2tlci5tYXNrVmFsdWUoaW5wdXQsIGRpZ2VzdGVkQ3VycmVuY3kpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG1vZGUgPT09IDIpIHtcblx0XHRcdFx0XHRyZXR1cm4gTWFza2VyLnVubWFza1ZhbHVlKGlucHV0KTtcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLnByb3ZpZGVycy5jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5wcm92aWRlcignJGN1cnJlbmN5TWFzaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBtYXNrTWF0Y2hlcyA9IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFwuWzAtOV0pKD89WzAtOV17MH0kKS9nLCAnd2l0aCc6ICckMTAnIH0sLy8gQ29udmVydHMgWFhYWC5YIHRvIFhYWFguWDBcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZCkqKD89KFxcZHswLH0pJCkvZywgJ3dpdGgnOiAnJCYsMDAnIH0sLy8gQ29udmVydHMgWFhYWCB0byBYWFhYLDAwXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGR7MX0pJC8sICd3aXRoJzogJzAsMCQxJyB9LC8vIENvbnZlcnRzIFggdG8gMCwwWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJywkMSd9LC8vIENvbnZlcnRzIFhYIHRvIDAsWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8sKFxcZHszLH0pJC8sICd3aXRoJzogJyQxLDAwJyB9LC8vIENvbnZlcnRzIFgsWFhYIHRvIFgsWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eLChcXGR7Mn0pJC8sICd3aXRoJzogXCIwLCQxXCIgfSwvLyBDb252ZXJ0cyAsWFggdG8gMCxYWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyg/OlxcLHsyLH0pKy9nLCAnd2l0aCc6IFwiLFwiIH0sLy8gQ29udmVydHMgYWxsIGR1cGxpY2F0ZWQgY29tbWEgZm9yIGp1c3Qgb25lXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvW0Etent9XFxbXFxdXyFcXC5dL2csICd3aXRoJzogXCJcIiB9LC8vIENvbnZlcnRzIGFsbCBub24tZGlnaXQgbnVtYmVycyB0byAnJ1xuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ3dpdGgnOiBcIiQxLlwiIH0sLy8gQ29udmVydHMgWFhYWFhYIHRvIFhYWC5YWFhcdFx0XHRcdFxuXHRcdFx0XSxcblxuXHRcdFx0dW5tYXNrTWF0Y2hlcyA9IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9cXEQvZywgJ3dpdGgnOiBcIlwiIH0sIC8vIENvbnZlcnRzICBhbGwgbm9uLWRpZ2l0IG51bWJlcnMgdG8gJydcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZHsxfSkkLywgJ3dpdGgnOiAnMC4wJDEnIH0sIC8vIENvbnZlcnRzIFggdG8gWC4wWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJy4kMSd9LCAvLyBDb252ZXJ0cyBYWCB0byAuWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oLDAwfFxcLjAwJCkvZywgJ3dpdGgnOiAnJyB9LCAvLyBDb252ZXJ0cyBhbGwgLFhYIGFuZCAuWFggdG8gbm90aGluZ1x0XHRcdFx0XG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXigwezEsfSkvLCAnd2l0aCc6ICcnIH0sIC8vIENvbnZlcnRzIHplcm9zIGF0IHRoZSBzdGFydCBvZiB0aGUgc3RyaW5nIHRvIG5vdGhpbmdcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eXFwuKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAuJDFcIiB9LCAvLyBDb252ZXJ0cyAuWFggdG8gMC5YWFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBDbGVhbiB0aGUgZW5kIG9mIHRoZSBzdHJpbmcgZnJvbVxuXHRcdFx0XHQgKiB1bnNpZ25pZmljYW50IG51bWJlcnMgY29udmVydGluZ1xuXHRcdFx0XHQgKiBYWFguMzBYWFhYIHRvIFhYWC4zMFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0eyAncmVwbGFjZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYoIXZhbHVlKSByZXR1cm4gJyc7XG5cblx0XHRcdFx0XHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1xcLihcXGR7Myx9KSQnKSxcblx0XHRcdFx0XHRcdG1hdGNoID0gdmFsdWUubWF0Y2gocmVnZXgpO1xuXG5cdFx0XHRcdFx0XHRpZihtYXRjaCBpbnN0YW5jZW9mIEFycmF5ICYmIG1hdGNoWzFdKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShtYXRjaCwgbWF0Y2gudG9TdHJpbmcoKS5zdWJzdHIoMCwgMikpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXG5cdFx0XHR2YXIgJHNlbGYgPSB0aGlzLFxuXHRcdFx0JGN1cnJlbmN5TWFzayA9IHtcblx0XHRcdFx0Y3VycmVuY3k6ICdSJCcsXG5cblx0XHRcdFx0Ly8gTWF0Y2hlcyB3aG8gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBjb250ZW50LlxuXHRcdFx0XHRtYXNrTWF0Y2hlczogbWFza01hdGNoZXMsXG5cblx0XHRcdFx0dW5tYXNrTWF0Y2hlczogdW5tYXNrTWF0Y2hlc1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5zZXRDdXJyZW5jeSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkge1xuXHRcdFx0XHQkY3VycmVuY3lNYXNrLmN1cnJlbmN5ID0gY3VycmVuY3k7XG5cblx0XHRcdFx0cmV0dXJuICRzZWxmO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGQgYSBuZXcgbWF0Y2ggdGFzayB0byAkY3VycmVuY3lNYXNrLnVubWFza01hdGNoZXMuXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuYWRkVW5tYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdFx0JGN1cnJlbmN5TWFzay51bm1hc2tNYXRjaGVzLnVuc2hpZnQoe1xuXHRcdFx0XHRcdCdyZXBsYWNlJzogcmVwbGFjZSxcblx0XHRcdFx0XHQnd2l0aCc6IHZhbHVlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiAkc2VsZjtcblx0XHRcdH07XHRcdFx0XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJGN1cnJlbmN5TWFzay5tYXNrTWF0Y2hlcy5cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5hZGRNYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIG1hdGNoID0ge307XG5cblx0XHRcdFx0aWYoIXZhbHVlKSB7XG5cdFx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdFx0bWF0Y2gud2l0aCA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGN1cnJlbmN5TWFzay5tYXNrTWF0Y2hlcy51bnNoaWZ0KG1hdGNoKTtcblxuXHRcdFx0XHRyZXR1cm4gJHNlbGY7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiAkY3VycmVuY3lNYXNrO1xuXHRcdFx0fTtcblx0XHR9KTtcdFx0XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2suZGlyZWN0aXZlcycsIFsnbmdDdXJyZW5jeU1hc2suZGlyZWN0aXZlcy5uZ0N1cnJlbmN5TWFzayddKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJywgWyduZ0N1cnJlbmN5TWFzay9GaWx0ZXIvY3VycmVuY3lNYXNrJ10pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmRpcmVjdGl2ZXMubmdDdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5kaXJlY3RpdmUoJ25nQ3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XG5cdFx0ICByZXR1cm4ge1xuXHRcdCAgICByZXN0cmljdDogJ0EnLFxuXHRcdCAgICByZXF1aXJlOiBbJz9uZ01vZGVsJ10sXG5cdFx0ICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSB7XG5cdFx0ICAgIFx0dmFyIG5nTW9kZWwgPSBjb250cm9sbGVyc1swXSxcblx0XHQgICAgICBcdFx0Y3VycmVuY3kgPSAhYXR0cnMuY3VycmVuY3kgPyBudWxsIDogYXR0cnMuY3VycmVuY3k7XG5cblx0XHQgICAgXHQvKipcblx0XHQgICAgXHQgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cblx0XHQgICAgXHQgKi9cblx0XHQgICAgICB2YXIgbWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgICByZXR1cm4gTWFza2VyLm1hc2tWYWx1ZSh2YWx1ZSwgY3VycmVuY3kpO1xuXHRcdCAgICAgIH07XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogUmV0dXJuIEB2YWx1ZSB0byBpdCByZWFsIHZhbHVlLlxuXHRcdCAgICAgICAqL1xuXHRcdCAgICAgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0ICAgICAgfTtcblx0XHQgICAgICBcblx0XHQgICAgICAvKipcblx0XHQgICAgICAgKiBQYXJzZXIgd2hvIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgbmdNb2RlbFxuXHRcdCAgICAgICAqIGJlZm9yZSB0aGUgZ29lcyB0byBET00uIFRoYXQgaXMgdGhlIHJlYWwgbmdNb2RlbCB2YWx1ZS5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgICByZXR1cm4gdW5tYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgIH07XG5cblx0XHQgICAgICBuZ01vZGVsLiRwYXJzZXJzLnB1c2gocGFyc2VyKTtcblx0XHQgICAgICBcblx0XHQgICAgICAvKipcblx0XHQgICAgICAgKiBFdmVyeXRpbWUgdGhlIGlucHV0IHN1ZmZlciBhIGNoYW5nZSxcblx0XHQgICAgICAgKiB0aGUgZGlyZWN0aXZlIHdpbGwgdXBkYXRlIGl0IGFuZCBtYXNrXG5cdFx0ICAgICAgICogYWxsIHRoZSB0eXBlZCBjb250ZW50LlxuXHRcdCAgICAgICAqL1xuXHRcdCAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5uZ01vZGVsLCBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICBcdGlmKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxuXG5cdFx0ICAgICAgICB2YXIgbWFza2VkVmFsdWUgPSBtYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgICAgXG5cdFx0ICAgICAgICBpZihtYXNrZWRWYWx1ZSAhPSB2YWx1ZSkge1xuXHRcdCAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobWFza2VkVmFsdWUpO1xuXHRcdCAgICAgICAgICBuZ01vZGVsLiRyZW5kZXIoKTtcblx0XHQgICAgICAgIH1cblx0XHQgICAgICB9KTtcblx0XHQgICAgfVxuXHRcdCAgfTtcblx0XHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2sucHJvdmlkZXJzJywgW1xuXHRcdFx0J25nQ3VycmVuY3lNYXNrLnByb3ZpZGVycy5jdXJyZW5jeU1hc2snXG5cdFx0XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2suc2VydmljZXMnLCBbJ25nQ3VycmVuY3lNYXNrLnNlcnZpY2VzLk1hc2tlciddKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9