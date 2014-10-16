'use strict';

angular
	.module('ngCurrencyMask', [
		'ngCurrencyMask.directives',
		'ngCurrencyMask.filters',
		'ngCurrencyMask.providers'
	]);
'use strict';

angular
	.module('ngCurrencyMask.filters.currencyMask', [])

	.filter('currencyMask', function ($masker) {
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
				var maskedValue = $masker.maskValue(input, digestedCurrency);

				return maskedValue;
			} else if (mode === 2) {
				return $masker.unmaskValue(input);
			};
		};
	});
'use strict';

angular
	.module('ngCurrencyMask.directives', ['ngCurrencyMask.directives.ngCurrencyMask']);
'use strict';

angular
	.module('ngCurrencyMask.filters', ['ngCurrencyMask.filters.currencyMask']);
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
'use strict';

angular
	.module('ngCurrencyMask.directives.ngCurrencyMask', [])

	.directive('ngCurrencyMask', function ($masker) {
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
					return $masker.maskValue(value, currency);
				};
				
				/**
				 * Return @value to it real value.
				 */
				var unmaskValue = function (value) {
					return $masker.unmaskValue(value);
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
	});
'use strict';

angular
	.module('ngCurrencyMask.providers', [
		'ngCurrencyMask.providers.masker'
	]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvY3VycmVuY3lNYXNrLmZpbHRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbWFza2VyLnByb3ZpZGVyLmpzIiwiY29tcG9uZW50cy9uZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL3Byb3ZpZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrJywgW1xuXHRcdCduZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmVzJyxcblx0XHQnbmdDdXJyZW5jeU1hc2suZmlsdGVycycsXG5cdFx0J25nQ3VycmVuY3lNYXNrLnByb3ZpZGVycydcblx0XSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMuY3VycmVuY3lNYXNrJywgW10pXG5cblx0LmZpbHRlcignY3VycmVuY3lNYXNrJywgZnVuY3Rpb24gKCRtYXNrZXIpIHtcblx0XHR2YXIgZGlnZXN0TW9kZSA9IGZ1bmN0aW9uIChtb2RlKSB7XG5cdFx0XHRzd2l0Y2gobW9kZSkge1xuXHRcdFx0XHRjYXNlICdtYXNrJzpcblx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAndW5tYXNrJzpcblx0XHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIGRpZ2VzdEN1cnJlbmN5ID0gZnVuY3Rpb24gKGN1cnJlbmN5KSB7XG5cdFx0XHRpZihjdXJyZW5jeSA9PT0gbnVsbCB8fCBjdXJyZW5jeSA9PT0gJ2RlZmF1bHQnKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbmN5O1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSwgY3VycmVuY3kpIHtcblx0XHRcdGlmKCFpbnB1dCkgcmV0dXJuICcnO1xuXG5cdFx0XHRpbnB1dCA9IGlucHV0LnRvU3RyaW5nKCk7XG5cblx0XHRcdC8vIElmIHRoZXJlIGlzIG5vICdtb2RlJyBkZWZpbmVkLiBNYXNrIHRoZSBpbnB1dC5cblx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyksXG5cdFx0XHRkaWdlc3RlZEN1cnJlbmN5ID0gY3VycmVuY3kgPyBkaWdlc3RDdXJyZW5jeShjdXJyZW5jeSkgOiBkaWdlc3RDdXJyZW5jeShudWxsKTtcblxuXHRcdFx0aWYobW9kZSA9PT0gMSkge1xuXHRcdFx0XHR2YXIgbWFza2VkVmFsdWUgPSAkbWFza2VyLm1hc2tWYWx1ZShpbnB1dCwgZGlnZXN0ZWRDdXJyZW5jeSk7XG5cblx0XHRcdFx0cmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSAyKSB7XG5cdFx0XHRcdHJldHVybiAkbWFza2VyLnVubWFza1ZhbHVlKGlucHV0KTtcblx0XHRcdH07XG5cdFx0fTtcblx0fSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmRpcmVjdGl2ZXMnLCBbJ25nQ3VycmVuY3lNYXNrLmRpcmVjdGl2ZXMubmdDdXJyZW5jeU1hc2snXSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMnLCBbJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMuY3VycmVuY3lNYXNrJ10pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5wcm92aWRlcnMubWFza2VyJywgW10pXG5cblx0LnByb3ZpZGVyKCckbWFza2VyJywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciAkbWFza2VyUHJvdmlkZXIgPSB0aGlzO1xuXG5cdFx0dGhpcy5kZWZhdWx0cyA9IHtcblx0XHRcdGN1cnJlbmN5OiAnUiQnLFxuXG5cdFx0XHRtYXNrTWF0Y2hlczogW1xuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXC5bMC05XSkoPz1bMC05XXswfSQpL2csICd3aXRoJzogJyQxMCcgfSwvLyBDb252ZXJ0cyBYWFhYLlggdG8gWFhYWC5YMFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oXFxkKSooPz0oXFxkezAsfSkkKS9nLCAnd2l0aCc6ICckJiwwMCcgfSwvLyBDb252ZXJ0cyBYWFhYIHRvIFhYWFgsMDBcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZHsxfSkkLywgJ3dpdGgnOiAnMCwwJDEnIH0sLy8gQ29udmVydHMgWCB0byAwLDBYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZHsyfSkkLywgJ3dpdGgnOiAnLCQxJ30sLy8gQ29udmVydHMgWFggdG8gMCxYWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLywoXFxkezMsfSkkLywgJ3dpdGgnOiAnJDEsMDAnIH0sLy8gQ29udmVydHMgWCxYWFggdG8gWCxYWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14sKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAsJDFcIiB9LC8vIENvbnZlcnRzICxYWCB0byAwLFhYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKD86XFwsezIsfSkrL2csICd3aXRoJzogXCIsXCIgfSwvLyBDb252ZXJ0cyBhbGwgZHVwbGljYXRlZCBjb21tYSBmb3IganVzdCBvbmVcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9bQS16e31cXFtcXF1fIVxcLl0vZywgJ3dpdGgnOiBcIlwiIH0sLy8gQ29udmVydHMgYWxsIG5vbi1kaWdpdCBudW1iZXJzIHRvICcnXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnd2l0aCc6IFwiJDEuXCIgfSwvLyBDb252ZXJ0cyBYWFhYWFggdG8gWFhYLlhYWFx0XHRcdFx0XG5cdFx0XHRdLFxuXG5cdFx0XHR1bm1hc2tNYXRjaGVzOiBbXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXFxEL2csICd3aXRoJzogXCJcIiB9LCAvLyBDb252ZXJ0cyAgYWxsIG5vbi1kaWdpdCBudW1iZXJzIHRvICcnXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGR7MX0pJC8sICd3aXRoJzogJzAuMCQxJyB9LCAvLyBDb252ZXJ0cyBYIHRvIFguMFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkezJ9KSQvLCAnd2l0aCc6ICcuJDEnfSwgLy8gQ29udmVydHMgWFggdG8gLlhYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKCwwMHxcXC4wMCQpL2csICd3aXRoJzogJycgfSwgLy8gQ29udmVydHMgYWxsICxYWCBhbmQgLlhYIHRvIG5vdGhpbmdcdFx0XHRcdFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oMHsxLH0pLywgJ3dpdGgnOiAnJyB9LCAvLyBDb252ZXJ0cyB6ZXJvcyBhdCB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZyB0byBub3RoaW5nXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXlxcLihcXGR7Mn0pJC8sICd3aXRoJzogXCIwLiQxXCIgfSwgLy8gQ29udmVydHMgLlhYIHRvIDAuWFhcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogQ2xlYW4gdGhlIGVuZCBvZiB0aGUgc3RyaW5nIGZyb21cblx0XHRcdFx0ICogdW5zaWduaWZpY2FudCBudW1iZXJzIGNvbnZlcnRpbmdcblx0XHRcdFx0ICogWFhYLjMwWFhYWCB0byBYWFguMzBcblx0XHRcdFx0ICovXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuICcnO1xuXG5cdFx0XHRcdFx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdcXC4oXFxkezMsfSkkJyksXG5cdFx0XHRcdFx0XHRtYXRjaCA9IHZhbHVlLm1hdGNoKHJlZ2V4KTtcblxuXHRcdFx0XHRcdFx0aWYobWF0Y2ggaW5zdGFuY2VvZiBBcnJheSAmJiBtYXRjaFsxXSkge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UobWF0Y2gsIG1hdGNoLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH07XG5cblx0XHR0aGlzLnNldEN1cnJlbmN5ID0gZnVuY3Rpb24gKGN1cnJlbmN5KSB7XG5cdFx0XHQkbWFza2VyUHJvdmlkZXIuY3VycmVuY3kgPSBjdXJyZW5jeTtcblxuXHRcdFx0cmV0dXJuICRtYXNrZXJQcm92aWRlcjtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJG1hc2tlci51bm1hc2tNYXRjaGVzLlxuXHRcdCAqL1xuXHRcdHRoaXMuYWRkVW5tYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdCRtYXNrZXJQcm92aWRlci51bm1hc2tNYXRjaGVzLnVuc2hpZnQoe1xuXHRcdFx0XHQncmVwbGFjZSc6IHJlcGxhY2UsXG5cdFx0XHRcdCd3aXRoJzogdmFsdWVcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gJG1hc2tlclByb3ZpZGVyO1xuXHRcdH07XHRcdFx0XG5cblx0XHQvKipcblx0XHQgKiBBZGQgYSBuZXcgbWF0Y2ggdGFzayB0byAkbWFza2VyLm1hc2tNYXRjaGVzLlxuXHRcdCAqL1xuXHRcdHRoaXMuYWRkTWFza01hdGNoID0gZnVuY3Rpb24gKHJlcGxhY2UsIHZhbHVlKSB7XG5cdFx0XHR2YXIgbWF0Y2ggPSB7fTtcblxuXHRcdFx0aWYoIXZhbHVlKSB7XG5cdFx0XHRcdG1hdGNoLnJlcGxhY2UgPSByZXBsYWNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdG1hdGNoLndpdGggPSB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0JG1hc2tlclByb3ZpZGVyLm1hc2tNYXRjaGVzLnVuc2hpZnQobWF0Y2gpO1xuXG5cdFx0XHRyZXR1cm4gJG1hc2tlclByb3ZpZGVyO1xuXHRcdH07XG5cblx0XHR0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRmdW5jdGlvbiAkTWFza2VyRmFjdG9yeSAoKSB7XG5cdFx0XHRcdHZhciAkbWFza2VyID0ge307XG5cblx0XHRcdFx0ZnVuY3Rpb24gYWRkQ3VycmVuY3kgKHZhbHVlLCBjdXJyZW5jeSkge1xuXHRcdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogQ29udmVydHMgQHZhbHVlIHRvIGEgU3RyaW5nIGluc3RhbmNlLCBmb3IgTnVtYmVyXG5cdFx0XHRcdFx0ICogaW5zdGFuY2VzIGRvZXNuJ3QgaGF2ZSAucmVwbGFjZSgpIHByb3RvdHlwZS5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR2YXIgbmV3VmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuXG5cdFx0XHRcdFx0Ly8gSW1wbGVtZW50cyB0aGUgY3VycmVuY3kgYXQgQG5ld1ZhbHVlXG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBuZXdWYWx1ZS5yZXBsYWNlKC9eLywgKGN1cnJlbmN5ID8gY3VycmVuY3kgOiAkbWFza2VyUHJvdmlkZXIuZGVmYXVsdHMuY3VycmVuY3kpICsgJyAnKTtcblxuXHRcdFx0XHRcdHJldHVybiBuZXdWYWx1ZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHQkbWFza2VyLm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVuY3kpIHtcblx0XHRcdFx0XHR2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnJyxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlcyA9ICRtYXNrZXJQcm92aWRlci5kZWZhdWx0cy5tYXNrTWF0Y2hlcztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdFx0aWYoa2V5LnJlcGxhY2UgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0XHRcdFx0XHRtYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKG1hc2tlZFZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG1hc2tlZFZhbHVlID0gbWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0bWFza2VkVmFsdWUgPSBhZGRDdXJyZW5jeShtYXNrZWRWYWx1ZSwgY3VycmVuY3kpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdCRtYXNrZXIudW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgdW5tYXNrZWRWYWx1ZSA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnLFxuXHRcdFx0XHRcdFx0XHRtYXRjaGVzID0gJG1hc2tlclByb3ZpZGVyLmRlZmF1bHRzLnVubWFza01hdGNoZXM7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0bWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdGlmKGtleS5yZXBsYWNlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0XHRcdFx0XHRcdFx0dW5tYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKHVubWFza2VkVmFsdWUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiB1bm1hc2tlZFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJldHVybiAkbWFza2VyO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbmV3ICRNYXNrZXJGYWN0b3J5O1xuXHRcdH07XG5cdH0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmVzLm5nQ3VycmVuY3lNYXNrJywgW10pXG5cblx0LmRpcmVjdGl2ZSgnbmdDdXJyZW5jeU1hc2snLCBmdW5jdGlvbiAoJG1hc2tlcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0cmVxdWlyZTogWyc/bmdNb2RlbCddLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcblx0XHRcdFx0dmFyIG5nTW9kZWwgPSBjb250cm9sbGVyc1swXSxcblx0XHRcdFx0XHRcdGN1cnJlbmN5ID0gIWF0dHJzLmN1cnJlbmN5ID8gbnVsbCA6IGF0dHJzLmN1cnJlbmN5O1xuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cblx0XHRcdFx0ICovXG5cdFx0XHRcdHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJG1hc2tlci5tYXNrVmFsdWUodmFsdWUsIGN1cnJlbmN5KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJG1hc2tlci51bm1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdFxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcblx0XHRcdFx0ICogYmVmb3JlIHRoZSBnb2VzIHRvIERPTS4gVGhhdCBpcyB0aGUgcmVhbCBuZ01vZGVsIHZhbHVlLlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdHJldHVybiB1bm1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bmdNb2RlbC4kcGFyc2Vycy5wdXNoKHBhcnNlcik7XG5cdFx0XHRcdFxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogRXZlcnl0aW1lIHRoZSBpbnB1dCBzdWZmZXIgYSBjaGFuZ2UsXG5cdFx0XHRcdCAqIHRoZSBkaXJlY3RpdmUgd2lsbCB1cGRhdGUgaXQgYW5kIG1hc2tcblx0XHRcdFx0ICogYWxsIHRoZSB0eXBlZCBjb250ZW50LlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0c2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdGlmKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0dmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZihtYXNrZWRWYWx1ZSAhPSB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLnByb3ZpZGVycycsIFtcblx0XHQnbmdDdXJyZW5jeU1hc2sucHJvdmlkZXJzLm1hc2tlcidcblx0XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9