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

	.filter('currencyMask', ["$masker", function ($masker) {
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
	}]);
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

	.directive('ngCurrencyMask', ["$masker", function ($masker) {
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

				element.bind('paste', function (evt) {
	                var clipboardData = evt.clipboardData || evt.originalEvent.clipboardData || window.clipboardData;
	                var pastedData = clipboardData.getData('text');
	                if (isNaN(pastedData)) {
	                    evt.preventDefault();
	                }
	            });

	            element.bind('keypress', function (evt) {
	                var charCode = evt.charCode;
	                var keyCode = evt.which ? evt.which : evt.keyCode;

	                if(evt.ctrlKey && keyCode == 118){
	                    return;
	                }

	                if (charCode == 0)
	                    return;

	                if (keyCode < 48 || keyCode > 57) {
	                    evt.preventDefault();
	                }

	            });
			}
		};
	}]);
'use strict';

angular
	.module('ngCurrencyMask.providers', [
		'ngCurrencyMask.providers.masker'
	]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvY3VycmVuY3lNYXNrLmZpbHRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbWFza2VyLnByb3ZpZGVyLmpzIiwiY29tcG9uZW50cy9uZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL3Byb3ZpZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtDQUNDO0VBQ0M7RUFDQTtFQUNBO0NBQ0Q7QUNQRDs7QUFFQTtDQUNDOztDQUVBLFNBQVMsWUFBWSxHQUFHLFlBQUE7RUFDdkI7R0FDQztJQUNDO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7S0FDQTtHQUNGO0VBQ0Q7O0VBRUE7R0FDQztJQUNDO0dBQ0Q7SUFDQztHQUNEO0VBQ0Q7O0VBRUE7R0FDQzs7R0FFQTs7R0FFQTtHQUNBO0dBQ0E7O0dBRUE7SUFDQzs7SUFFQTtHQUNEO0lBQ0M7R0FDRDtFQUNEO0NBQ0QsQ0FBQyxDQUFBO0FDMUNGOztBQUVBO0NBQ0M7QUNIRDs7QUFFQTtDQUNDO0FDSEQ7O0FBRUE7Q0FDQzs7Q0FFQSxXQUFXLE9BQU87RUFDakI7O0VBRUE7R0FDQzs7R0FFQTtJQUNDO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtHQUNEOztHQUVBO0lBQ0M7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOztJQUVBO0tBQ0M7S0FDQTtLQUNBO0tBQ0E7SUFDRDtNQUNFOztNQUVBO01BQ0E7O01BRUE7T0FDQztNQUNEOztNQUVBO0tBQ0Q7SUFDRDtHQUNEO0VBQ0Q7O0VBRUE7R0FDQzs7R0FFQTtFQUNEOztFQUVBO0dBQ0M7R0FDQTtFQUNEO0dBQ0M7SUFDQztJQUNBO0dBQ0Q7O0dBRUE7RUFDRDs7RUFFQTtHQUNDO0dBQ0E7RUFDRDtHQUNDOztHQUVBO0lBQ0M7R0FDRDtJQUNDO0lBQ0E7R0FDRDs7R0FFQTs7R0FFQTtFQUNEOztFQUVBO0dBQ0M7SUFDQzs7SUFFQTtLQUNDOztLQUVBO01BQ0M7TUFDQTtNQUNBO0tBQ0Q7O0tBRUE7S0FDQTs7S0FFQTtJQUNEOztJQUVBO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7T0FDRTs7S0FFRjtNQUNDO09BQ0M7TUFDRDtPQUNDO01BQ0Q7S0FDRDs7S0FFQTs7S0FFQTtJQUNEOztJQUVBO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7T0FDRTs7S0FFRjtNQUNDO09BQ0M7TUFDRDtPQUNDO01BQ0Q7S0FDRDs7S0FFQTtJQUNEOztJQUVBO0dBQ0Q7O0dBRUE7RUFDRDtDQUNEO0FDdEpEOztBQUVBO0NBQ0M7O0NBRUEsWUFBWSxjQUFjLEdBQUcsWUFBQTtFQUM1QjtHQUNDO0dBQ0E7R0FDQTtJQUNDO01BQ0U7O0lBRUY7S0FDQztLQUNBO0lBQ0Q7S0FDQztJQUNEOztJQUVBO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7SUFDRDs7SUFFQTtLQUNDO0tBQ0E7S0FDQTtJQUNEO0tBQ0M7SUFDRDs7SUFFQTs7SUFFQTtLQUNDO0tBQ0E7S0FDQTtLQUNBO0lBQ0Q7S0FDQzs7S0FFQTs7S0FFQTtNQUNDO01BQ0E7S0FDRDtJQUNEOztJQUVBO2lCQUNhO2lCQUNBO2lCQUNBO3FCQUNJO2lCQUNKO2FBQ0o7O2FBRUE7aUJBQ0k7aUJBQ0E7O2lCQUVBO3FCQUNJO2lCQUNKOztpQkFFQTtxQkFDSTs7aUJBRUo7cUJBQ0k7aUJBQ0o7O2FBRUo7R0FDVjtFQUNEO0NBQ0QsQ0FBQyxDQUFBO0FDL0VGOztBQUVBO0NBQ0M7RUFDQztDQUNEIiwiZmlsZSI6Im5nLWN1cnJlbmN5LW1hc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2snLCBbXHJcblx0XHQnbmdDdXJyZW5jeU1hc2suZGlyZWN0aXZlcycsXHJcblx0XHQnbmdDdXJyZW5jeU1hc2suZmlsdGVycycsXHJcblx0XHQnbmdDdXJyZW5jeU1hc2sucHJvdmlkZXJzJ1xyXG5cdF0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5maWx0ZXJzLmN1cnJlbmN5TWFzaycsIFtdKVxyXG5cclxuXHQuZmlsdGVyKCdjdXJyZW5jeU1hc2snLCBmdW5jdGlvbiAoJG1hc2tlcikge1xyXG5cdFx0dmFyIGRpZ2VzdE1vZGUgPSBmdW5jdGlvbiAobW9kZSkge1xyXG5cdFx0XHRzd2l0Y2gobW9kZSkge1xyXG5cdFx0XHRcdGNhc2UgJ21hc2snOlxyXG5cdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd1bm1hc2snOlxyXG5cdFx0XHRcdFx0cmV0dXJuIDI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZGlnZXN0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcclxuXHRcdFx0aWYoY3VycmVuY3kgPT09IG51bGwgfHwgY3VycmVuY3kgPT09ICdkZWZhdWx0Jykge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBjdXJyZW5jeTtcclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSwgY3VycmVuY3kpIHtcclxuXHRcdFx0aWYoIWlucHV0KSByZXR1cm4gJyc7XHJcblxyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXHJcblx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyksXHJcblx0XHRcdGRpZ2VzdGVkQ3VycmVuY3kgPSBjdXJyZW5jeSA/IGRpZ2VzdEN1cnJlbmN5KGN1cnJlbmN5KSA6IGRpZ2VzdEN1cnJlbmN5KG51bGwpO1xyXG5cclxuXHRcdFx0aWYobW9kZSA9PT0gMSkge1xyXG5cdFx0XHRcdHZhciBtYXNrZWRWYWx1ZSA9ICRtYXNrZXIubWFza1ZhbHVlKGlucHV0LCBkaWdlc3RlZEN1cnJlbmN5KTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIG1hc2tlZFZhbHVlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKG1vZGUgPT09IDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gJG1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XHJcblx0XHRcdH07XHJcblx0XHR9O1xyXG5cdH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmVzJywgWyduZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmVzLm5nQ3VycmVuY3lNYXNrJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5maWx0ZXJzJywgWyduZ0N1cnJlbmN5TWFzay5maWx0ZXJzLmN1cnJlbmN5TWFzayddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2sucHJvdmlkZXJzLm1hc2tlcicsIFtdKVxyXG5cclxuXHQucHJvdmlkZXIoJyRtYXNrZXInLCBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgJG1hc2tlclByb3ZpZGVyID0gdGhpcztcclxuXHJcblx0XHR0aGlzLmRlZmF1bHRzID0ge1xyXG5cdFx0XHRjdXJyZW5jeTogJ1IkJyxcclxuXHJcblx0XHRcdG1hc2tNYXRjaGVzOiBbXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFwuWzAtOV0pKD89WzAtOV17MH0kKS9nLCAnd2l0aCc6ICckMTAnIH0sLy8gQ29udmVydHMgWFhYWC5YIHRvIFhYWFguWDBcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oXFxkKSooPz0oXFxkezAsfSkkKS9nLCAnd2l0aCc6ICckJiwwMCcgfSwvLyBDb252ZXJ0cyBYWFhYIHRvIFhYWFgsMDBcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oXFxkezF9KSQvLCAnd2l0aCc6ICcwLDAkMScgfSwvLyBDb252ZXJ0cyBYIHRvIDAsMFhcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJywkMSd9LC8vIENvbnZlcnRzIFhYIHRvIDAsWFhcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLywoXFxkezMsfSkkLywgJ3dpdGgnOiAnJDEsMDAnIH0sLy8gQ29udmVydHMgWCxYWFggdG8gWCxYWFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXiwoXFxkezJ9KSQvLCAnd2l0aCc6IFwiMCwkMVwiIH0sLy8gQ29udmVydHMgLFhYIHRvIDAsWFhcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyg/OlxcLHsyLH0pKy9nLCAnd2l0aCc6IFwiLFwiIH0sLy8gQ29udmVydHMgYWxsIGR1cGxpY2F0ZWQgY29tbWEgZm9yIGp1c3Qgb25lXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9bQS16e31cXFtcXF1fIVxcLl0vZywgJ3dpdGgnOiBcIlwiIH0sLy8gQ29udmVydHMgYWxsIG5vbi1kaWdpdCBudW1iZXJzIHRvICcnXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICd3aXRoJzogXCIkMS5cIiB9LC8vIENvbnZlcnRzIFhYWFhYWCB0byBYWFguWFhYXHRcdFx0XHRcclxuXHRcdFx0XSxcclxuXHJcblx0XHRcdHVubWFza01hdGNoZXM6IFtcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL1xcRC9nLCAnd2l0aCc6IFwiXCIgfSwgLy8gQ29udmVydHMgIGFsbCBub24tZGlnaXQgbnVtYmVycyB0byAnJ1xyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGR7MX0pJC8sICd3aXRoJzogJzAuMCQxJyB9LCAvLyBDb252ZXJ0cyBYIHRvIFguMFhcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJy4kMSd9LCAvLyBDb252ZXJ0cyBYWCB0byAuWFhcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLygsMDB8XFwuMDAkKS9nLCAnd2l0aCc6ICcnIH0sIC8vIENvbnZlcnRzIGFsbCAsWFggYW5kIC5YWCB0byBub3RoaW5nXHRcdFx0XHRcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oMHsxLH0pLywgJ3dpdGgnOiAnJyB9LCAvLyBDb252ZXJ0cyB6ZXJvcyBhdCB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZyB0byBub3RoaW5nXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eXFwuKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAuJDFcIiB9LCAvLyBDb252ZXJ0cyAuWFggdG8gMC5YWFxyXG5cclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBDbGVhbiB0aGUgZW5kIG9mIHRoZSBzdHJpbmcgZnJvbVxyXG5cdFx0XHRcdCAqIHVuc2lnbmlmaWNhbnQgbnVtYmVycyBjb252ZXJ0aW5nXHJcblx0XHRcdFx0ICogWFhYLjMwWFhYWCB0byBYWFguMzBcclxuXHRcdFx0XHQgKi9cclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFwuKFxcZHszLH0pJCcpLFxyXG5cdFx0XHRcdFx0XHRtYXRjaCA9IHZhbHVlLm1hdGNoKHJlZ2V4KTtcclxuXHJcblx0XHRcdFx0XHRcdGlmKG1hdGNoIGluc3RhbmNlb2YgQXJyYXkgJiYgbWF0Y2hbMV0pIHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UobWF0Y2gsIG1hdGNoLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNldEN1cnJlbmN5ID0gZnVuY3Rpb24gKGN1cnJlbmN5KSB7XHJcblx0XHRcdCRtYXNrZXJQcm92aWRlci5jdXJyZW5jeSA9IGN1cnJlbmN5O1xyXG5cclxuXHRcdFx0cmV0dXJuICRtYXNrZXJQcm92aWRlcjtcclxuXHRcdH07XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBZGQgYSBuZXcgbWF0Y2ggdGFzayB0byAkbWFza2VyLnVubWFza01hdGNoZXMuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuYWRkVW5tYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcclxuXHRcdFx0JG1hc2tlclByb3ZpZGVyLnVubWFza01hdGNoZXMudW5zaGlmdCh7XHJcblx0XHRcdFx0J3JlcGxhY2UnOiByZXBsYWNlLFxyXG5cdFx0XHRcdCd3aXRoJzogdmFsdWVcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gJG1hc2tlclByb3ZpZGVyO1xyXG5cdFx0fTtcdFx0XHRcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFkZCBhIG5ldyBtYXRjaCB0YXNrIHRvICRtYXNrZXIubWFza01hdGNoZXMuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuYWRkTWFza01hdGNoID0gZnVuY3Rpb24gKHJlcGxhY2UsIHZhbHVlKSB7XHJcblx0XHRcdHZhciBtYXRjaCA9IHt9O1xyXG5cclxuXHRcdFx0aWYoIXZhbHVlKSB7XHJcblx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XHJcblx0XHRcdFx0bWF0Y2gud2l0aCA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkbWFza2VyUHJvdmlkZXIubWFza01hdGNoZXMudW5zaGlmdChtYXRjaCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gJG1hc2tlclByb3ZpZGVyO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZ1bmN0aW9uICRNYXNrZXJGYWN0b3J5ICgpIHtcclxuXHRcdFx0XHR2YXIgJG1hc2tlciA9IHt9O1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBhZGRDdXJyZW5jeSAodmFsdWUsIGN1cnJlbmN5KSB7XHJcblx0XHRcdFx0XHRpZighdmFsdWUpIHJldHVybiB2YWx1ZTtcclxuXHJcblx0XHRcdFx0XHQvKipcclxuXHRcdFx0XHRcdCAqIENvbnZlcnRzIEB2YWx1ZSB0byBhIFN0cmluZyBpbnN0YW5jZSwgZm9yIE51bWJlclxyXG5cdFx0XHRcdFx0ICogaW5zdGFuY2VzIGRvZXNuJ3QgaGF2ZSAucmVwbGFjZSgpIHByb3RvdHlwZS5cclxuXHRcdFx0XHRcdCAqL1xyXG5cdFx0XHRcdFx0dmFyIG5ld1ZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFx0XHQvLyBJbXBsZW1lbnRzIHRoZSBjdXJyZW5jeSBhdCBAbmV3VmFsdWVcclxuXHRcdFx0XHRcdG5ld1ZhbHVlID0gbmV3VmFsdWUucmVwbGFjZSgvXi8sIChjdXJyZW5jeSA/IGN1cnJlbmN5IDogJG1hc2tlclByb3ZpZGVyLmRlZmF1bHRzLmN1cnJlbmN5KSArICcgJyk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIG5ld1ZhbHVlO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdC8qKlxyXG5cdFx0XHRcdCAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdCRtYXNrZXIubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xyXG5cdFx0XHRcdFx0dmFyIG1hc2tlZFZhbHVlID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJycsXHJcblx0XHRcdFx0XHRcdFx0bWF0Y2hlcyA9ICRtYXNrZXJQcm92aWRlci5kZWZhdWx0cy5tYXNrTWF0Y2hlcztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0XHRcdFx0aWYoa2V5LnJlcGxhY2UgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG5cdFx0XHRcdFx0XHRcdG1hc2tlZFZhbHVlID0ga2V5LnJlcGxhY2UobWFza2VkVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG1hc2tlZFZhbHVlID0gbWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRtYXNrZWRWYWx1ZSA9IGFkZEN1cnJlbmN5KG1hc2tlZFZhbHVlLCBjdXJyZW5jeSk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIG1hc2tlZFZhbHVlO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0LyoqXHJcblx0XHRcdFx0ICogUmV0dXJuIEB2YWx1ZSB0byBpdCByZWFsIHZhbHVlLlxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdCRtYXNrZXIudW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdHZhciB1bm1hc2tlZFZhbHVlID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJycsXHJcblx0XHRcdFx0XHRcdFx0bWF0Y2hlcyA9ICRtYXNrZXJQcm92aWRlci5kZWZhdWx0cy51bm1hc2tNYXRjaGVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRcdFx0XHRpZihrZXkucmVwbGFjZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0dW5tYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKHVubWFza2VkVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHVubWFza2VkVmFsdWUgPSB1bm1hc2tlZFZhbHVlLnJlcGxhY2Uoa2V5LnJlcGxhY2UsIGtleS53aXRoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHJldHVybiB1bm1hc2tlZFZhbHVlO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHJldHVybiAkbWFza2VyO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gbmV3ICRNYXNrZXJGYWN0b3J5O1xyXG5cdFx0fTtcclxuXHR9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2suZGlyZWN0aXZlcy5uZ0N1cnJlbmN5TWFzaycsIFtdKVxyXG5cclxuXHQuZGlyZWN0aXZlKCduZ0N1cnJlbmN5TWFzaycsIGZ1bmN0aW9uICgkbWFza2VyKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0XHRyZXF1aXJlOiBbJz9uZ01vZGVsJ10sXHJcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0dmFyIG5nTW9kZWwgPSBjb250cm9sbGVyc1swXSxcclxuXHRcdFx0XHRcdFx0Y3VycmVuY3kgPSAhYXR0cnMuY3VycmVuY3kgPyBudWxsIDogYXR0cnMuY3VycmVuY3k7XHJcblxyXG5cdFx0XHRcdC8qKlxyXG5cdFx0XHRcdCAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiAkbWFza2VyLm1hc2tWYWx1ZSh2YWx1ZSwgY3VycmVuY3kpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0LyoqXHJcblx0XHRcdFx0ICogUmV0dXJuIEB2YWx1ZSB0byBpdCByZWFsIHZhbHVlLlxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICRtYXNrZXIudW5tYXNrVmFsdWUodmFsdWUpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0LyoqXHJcblx0XHRcdFx0ICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcclxuXHRcdFx0XHQgKiBiZWZvcmUgdGhlIGdvZXMgdG8gRE9NLiBUaGF0IGlzIHRoZSByZWFsIG5nTW9kZWwgdmFsdWUuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0dmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHVubWFza1ZhbHVlKHZhbHVlKTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRuZ01vZGVsLiRwYXJzZXJzLnB1c2gocGFyc2VyKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBFdmVyeXRpbWUgdGhlIGlucHV0IHN1ZmZlciBhIGNoYW5nZSxcclxuXHRcdFx0XHQgKiB0aGUgZGlyZWN0aXZlIHdpbGwgdXBkYXRlIGl0IGFuZCBtYXNrXHJcblx0XHRcdFx0ICogYWxsIHRoZSB0eXBlZCBjb250ZW50LlxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdHNjb3BlLiR3YXRjaChhdHRycy5uZ01vZGVsLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdGlmKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdFx0XHRcdHZhciBtYXNrZWRWYWx1ZSA9IG1hc2tWYWx1ZSh2YWx1ZSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKG1hc2tlZFZhbHVlICE9IHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZpZXdWYWx1ZShtYXNrZWRWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHJlbmRlcigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRlbGVtZW50LmJpbmQoJ3Bhc3RlJywgZnVuY3Rpb24gKGV2dCkge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgY2xpcGJvYXJkRGF0YSA9IGV2dC5jbGlwYm9hcmREYXRhIHx8IGV2dC5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEgfHwgd2luZG93LmNsaXBib2FyZERhdGE7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBwYXN0ZWREYXRhID0gY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0Jyk7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChpc05hTihwYXN0ZWREYXRhKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9KTtcclxuXHJcblx0ICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChldnQpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGNoYXJDb2RlID0gZXZ0LmNoYXJDb2RlO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIga2V5Q29kZSA9IGV2dC53aGljaCA/IGV2dC53aGljaCA6IGV2dC5rZXlDb2RlO1xyXG5cclxuXHQgICAgICAgICAgICAgICAgaWYoZXZ0LmN0cmxLZXkgJiYga2V5Q29kZSA9PSAxMTgpe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblxyXG5cdCAgICAgICAgICAgICAgICBpZiAoY2hhckNvZGUgPT0gMClcclxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcblx0ICAgICAgICAgICAgICAgIGlmIChrZXlDb2RlIDwgNDggfHwga2V5Q29kZSA+IDU3KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cclxuXHQgICAgICAgICAgICB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2sucHJvdmlkZXJzJywgW1xyXG5cdFx0J25nQ3VycmVuY3lNYXNrLnByb3ZpZGVycy5tYXNrZXInXHJcblx0XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9