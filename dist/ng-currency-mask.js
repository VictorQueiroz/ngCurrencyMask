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
	        switch (mode) {
	            case 'mask':
	                return 1;
	                break;
	            case 'unmask':
	                return 2;
	                break;
	        }
	    };

	    var digestCurrency = function (currency) {
	        if (currency === null || currency === 'default') {
	            return null;
	        } else {
	            return currency;
	        };
	    };

	    return function (input, mode, currency) {
	        if (!input) return '';

	        input = input.toString();

	        // If there is no 'mode' defined. Mask the input.
	        var mode = mode ? digestMode(mode) : digestMode('mask'),
			digestedCurrency = currency ? digestCurrency(currency) : digestCurrency(null);

	        if (mode === 1) {
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
				{ 'replace': /(\d{2})$/, 'with': ',$1' },// Converts XX to 0,XX
				{ 'replace': /,(\d{3,})$/, 'with': '$1,00' },// Converts X,XXX to X,XX
				{ 'replace': /^,(\d{2})$/, 'with': "0,$1" },// Converts ,XX to 0,XX
				{ 'replace': /(?:\,{2,})+/g, 'with': "," },// Converts all duplicated comma for just one
				{ 'replace': /[A-z{}\[\]_!\.]/g, 'with': "" },// Converts all non-digit numbers to ''
				{ 'replace': /(\d)(?=(\d{3})+(?!\d))/g, 'with': "$1." },// Converts XXXXXX to XXX.XXX				
	        ],

	        unmaskMatches: [
				{ 'replace': /\D/g, 'with': "" }, // Converts  all non-digit numbers to ''
				{ 'replace': /^(\d{1})$/, 'with': '0.0$1' }, // Converts X to X.0X
				{ 'replace': /(\d{2})$/, 'with': '.$1' }, // Converts XX to .XX
				{ 'replace': /(,00|\.00$)/g, 'with': '' }, // Converts all ,XX and .XX to nothing				
				{ 'replace': /^(0{1,})/, 'with': '' }, // Converts zeros at the start of the string to nothing
				{ 'replace': /^\.(\d{2})$/, 'with': "0.$1" }, // Converts .XX to 0.XX

				/**
				 * Clean the end of the string from
				 * unsignificant numbers converting
				 * XXX.30XXXX to XXX.30
				 */
				{
				    'replace': function (value) {
				        if (!value) return '';

				        var regex = new RegExp('\.(\d{3,})$'),
						match = value.match(regex);

				        if (match instanceof Array && match[1]) {
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

	        if (!value) {
	            match.replace = replace;
	        } else {
	            match.replace = replace;
	            match.with = value;
	        }

	        $maskerProvider.maskMatches.unshift(match);

	        return $maskerProvider;
	    };

	    this.$get = function () {
	        function $MaskerFactory() {
	            var $masker = {};

	            function addCurrency(value, currency) {
	                if (!value) return value;

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
	                    if (key.replace instanceof Function) {
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
	                    if (key.replace instanceof Function) {
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
	                if (!value || value.length < 1) { return; }

	                var maskedValue = maskValue(value);

	                if (maskedValue != value) {
	                    ngModel.$setViewValue(maskedValue);
	                    ngModel.$render();
	                }
	            });

	            element.on('keypress', function (evt) {
	                if (evt.which < 48 || evt.which > 57) {
	                    evt.preventDefault();
	                }
	            })

	            element.on('paste', function (evt) {
	                var pasteData = evt.originalEvent.clipboardData.getData('text')
	                if (isNaN(pasteData)) {
	                    evt.preventDefault();
	                }
	            })
	        }
	    };
	}]);
'use strict';

angular
	.module('ngCurrencyMask.providers', [
		'ngCurrencyMask.providers.masker'
	]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvY3VycmVuY3lNYXNrLmZpbHRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbWFza2VyLnByb3ZpZGVyLmpzIiwiY29tcG9uZW50cy9uZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL3Byb3ZpZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtDQUNDO0VBQ0M7RUFDQTtFQUNBO0NBQ0Q7QUNQRDs7QUFFQTtDQUNDOztDQUVBLFNBQVMsWUFBWSxHQUFHLFlBQUE7RUFDdkI7R0FDQztJQUNDO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7S0FDQTtHQUNGO0VBQ0Q7O0VBRUE7R0FDQztJQUNDO0dBQ0Q7SUFDQztHQUNEO0VBQ0Q7O0VBRUE7R0FDQzs7R0FFQTs7R0FFQTtHQUNBO0dBQ0E7O0dBRUE7SUFDQzs7SUFFQTtHQUNEO0lBQ0M7R0FDRDtFQUNEO0NBQ0QsQ0FBQyxDQUFBO0FDMUNGOztBQUVBO0NBQ0M7QUNIRDs7QUFFQTtDQUNDO0FDSEQ7O0FBRUE7Q0FDQzs7Q0FFQSxXQUFXLE9BQU87RUFDakI7O0VBRUE7R0FDQzs7R0FFQTtJQUNDO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtHQUNEOztHQUVBO0lBQ0M7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOztJQUVBO0tBQ0M7S0FDQTtLQUNBO0tBQ0E7SUFDRDtNQUNFOztNQUVBO01BQ0E7O01BRUE7T0FDQztNQUNEOztNQUVBO0tBQ0Q7SUFDRDtHQUNEO0VBQ0Q7O0VBRUE7R0FDQzs7R0FFQTtFQUNEOztFQUVBO0dBQ0M7R0FDQTtFQUNEO0dBQ0M7SUFDQztJQUNBO0dBQ0Q7O0dBRUE7RUFDRDs7RUFFQTtHQUNDO0dBQ0E7RUFDRDtHQUNDOztHQUVBO0lBQ0M7R0FDRDtJQUNDO0lBQ0E7R0FDRDs7R0FFQTs7R0FFQTtFQUNEOztFQUVBO0dBQ0M7SUFDQzs7SUFFQTtLQUNDOztLQUVBO01BQ0M7TUFDQTtNQUNBO0tBQ0Q7O0tBRUE7S0FDQTs7S0FFQTtJQUNEOztJQUVBO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7T0FDRTs7S0FFRjtNQUNDO09BQ0M7TUFDRDtPQUNDO01BQ0Q7S0FDRDs7S0FFQTs7S0FFQTtJQUNEOztJQUVBO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7T0FDRTs7S0FFRjtNQUNDO09BQ0M7TUFDRDtPQUNDO01BQ0Q7S0FDRDs7S0FFQTtJQUNEOztJQUVBO0dBQ0Q7O0dBRUE7RUFDRDtDQUNEO0FDdEpEOztBQUVBO0NBQ0M7O0NBRUEsWUFBWSxjQUFjLEdBQUcsWUFBQTtFQUM1QjtHQUNDO0dBQ0E7R0FDQTtJQUNDO01BQ0U7O0lBRUY7S0FDQztLQUNBO0lBQ0Q7S0FDQztJQUNEOztJQUVBO0tBQ0M7S0FDQTtJQUNEO0tBQ0M7SUFDRDs7SUFFQTtLQUNDO0tBQ0E7S0FDQTtJQUNEO0tBQ0M7SUFDRDs7SUFFQTs7SUFFQTtLQUNDO0tBQ0E7S0FDQTtLQUNBO0lBQ0Q7S0FDQzs7S0FFQTs7S0FFQTtNQUNDO01BQ0E7S0FDRDtJQUNEOztJQUVBO2lCQUNhO3FCQUNJO2lCQUNKO2FBQ0o7O2FBRUE7aUJBQ0k7aUJBQ0E7cUJBQ0k7aUJBQ0o7YUFDSjtHQUNWO0VBQ0Q7Q0FDRCxDQUFDLENBQUE7QUNuRUY7O0FBRUE7Q0FDQztFQUNDO0NBQ0QiLCJmaWxlIjoibmctY3VycmVuY3ktbWFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzaycsIFtcclxuXHRcdCduZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmVzJyxcclxuXHRcdCduZ0N1cnJlbmN5TWFzay5maWx0ZXJzJyxcclxuXHRcdCduZ0N1cnJlbmN5TWFzay5wcm92aWRlcnMnXHJcblx0XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMuY3VycmVuY3lNYXNrJywgW10pXHJcblxyXG5cdC5maWx0ZXIoJ2N1cnJlbmN5TWFzaycsIGZ1bmN0aW9uICgkbWFza2VyKSB7XHJcblx0XHR2YXIgZGlnZXN0TW9kZSA9IGZ1bmN0aW9uIChtb2RlKSB7XHJcblx0XHRcdHN3aXRjaChtb2RlKSB7XHJcblx0XHRcdFx0Y2FzZSAnbWFzayc6XHJcblx0XHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3VubWFzayc6XHJcblx0XHRcdFx0XHRyZXR1cm4gMjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBkaWdlc3RDdXJyZW5jeSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkge1xyXG5cdFx0XHRpZihjdXJyZW5jeSA9PT0gbnVsbCB8fCBjdXJyZW5jeSA9PT0gJ2RlZmF1bHQnKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGN1cnJlbmN5O1xyXG5cdFx0XHR9O1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBtb2RlLCBjdXJyZW5jeSkge1xyXG5cdFx0XHRpZighaW5wdXQpIHJldHVybiAnJztcclxuXHJcblx0XHRcdGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdC8vIElmIHRoZXJlIGlzIG5vICdtb2RlJyBkZWZpbmVkLiBNYXNrIHRoZSBpbnB1dC5cclxuXHRcdFx0dmFyIG1vZGUgPSBtb2RlID8gZGlnZXN0TW9kZShtb2RlKSA6IGRpZ2VzdE1vZGUoJ21hc2snKSxcclxuXHRcdFx0ZGlnZXN0ZWRDdXJyZW5jeSA9IGN1cnJlbmN5ID8gZGlnZXN0Q3VycmVuY3koY3VycmVuY3kpIDogZGlnZXN0Q3VycmVuY3kobnVsbCk7XHJcblxyXG5cdFx0XHRpZihtb2RlID09PSAxKSB7XHJcblx0XHRcdFx0dmFyIG1hc2tlZFZhbHVlID0gJG1hc2tlci5tYXNrVmFsdWUoaW5wdXQsIGRpZ2VzdGVkQ3VycmVuY3kpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gbWFza2VkVmFsdWU7XHJcblx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gMikge1xyXG5cdFx0XHRcdHJldHVybiAkbWFza2VyLnVubWFza1ZhbHVlKGlucHV0KTtcclxuXHRcdFx0fTtcclxuXHRcdH07XHJcblx0fSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmRpcmVjdGl2ZXMnLCBbJ25nQ3VycmVuY3lNYXNrLmRpcmVjdGl2ZXMubmdDdXJyZW5jeU1hc2snXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG5cdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMnLCBbJ25nQ3VycmVuY3lNYXNrLmZpbHRlcnMuY3VycmVuY3lNYXNrJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5wcm92aWRlcnMubWFza2VyJywgW10pXHJcblxyXG5cdC5wcm92aWRlcignJG1hc2tlcicsIGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciAkbWFza2VyUHJvdmlkZXIgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuZGVmYXVsdHMgPSB7XHJcblx0XHRcdGN1cnJlbmN5OiAnUiQnLFxyXG5cclxuXHRcdFx0bWFza01hdGNoZXM6IFtcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXC5bMC05XSkoPz1bMC05XXswfSQpL2csICd3aXRoJzogJyQxMCcgfSwvLyBDb252ZXJ0cyBYWFhYLlggdG8gWFhYWC5YMFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGQpKig/PShcXGR7MCx9KSQpL2csICd3aXRoJzogJyQmLDAwJyB9LC8vIENvbnZlcnRzIFhYWFggdG8gWFhYWCwwMFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGR7MX0pJC8sICd3aXRoJzogJzAsMCQxJyB9LC8vIENvbnZlcnRzIFggdG8gMCwwWFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZHsyfSkkLywgJ3dpdGgnOiAnLCQxJ30sLy8gQ29udmVydHMgWFggdG8gMCxYWFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvLChcXGR7Myx9KSQvLCAnd2l0aCc6ICckMSwwMCcgfSwvLyBDb252ZXJ0cyBYLFhYWCB0byBYLFhYXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eLChcXGR7Mn0pJC8sICd3aXRoJzogXCIwLCQxXCIgfSwvLyBDb252ZXJ0cyAsWFggdG8gMCxYWFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKD86XFwsezIsfSkrL2csICd3aXRoJzogXCIsXCIgfSwvLyBDb252ZXJ0cyBhbGwgZHVwbGljYXRlZCBjb21tYSBmb3IganVzdCBvbmVcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL1tBLXp7fVxcW1xcXV8hXFwuXS9nLCAnd2l0aCc6IFwiXCIgfSwvLyBDb252ZXJ0cyBhbGwgbm9uLWRpZ2l0IG51bWJlcnMgdG8gJydcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ3dpdGgnOiBcIiQxLlwiIH0sLy8gQ29udmVydHMgWFhYWFhYIHRvIFhYWC5YWFhcdFx0XHRcdFxyXG5cdFx0XHRdLFxyXG5cclxuXHRcdFx0dW5tYXNrTWF0Y2hlczogW1xyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXFxEL2csICd3aXRoJzogXCJcIiB9LCAvLyBDb252ZXJ0cyAgYWxsIG5vbi1kaWdpdCBudW1iZXJzIHRvICcnXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZHsxfSkkLywgJ3dpdGgnOiAnMC4wJDEnIH0sIC8vIENvbnZlcnRzIFggdG8gWC4wWFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZHsyfSkkLywgJ3dpdGgnOiAnLiQxJ30sIC8vIENvbnZlcnRzIFhYIHRvIC5YWFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKCwwMHxcXC4wMCQpL2csICd3aXRoJzogJycgfSwgLy8gQ29udmVydHMgYWxsICxYWCBhbmQgLlhYIHRvIG5vdGhpbmdcdFx0XHRcdFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXigwezEsfSkvLCAnd2l0aCc6ICcnIH0sIC8vIENvbnZlcnRzIHplcm9zIGF0IHRoZSBzdGFydCBvZiB0aGUgc3RyaW5nIHRvIG5vdGhpbmdcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL15cXC4oXFxkezJ9KSQvLCAnd2l0aCc6IFwiMC4kMVwiIH0sIC8vIENvbnZlcnRzIC5YWCB0byAwLlhYXHJcblxyXG5cdFx0XHRcdC8qKlxyXG5cdFx0XHRcdCAqIENsZWFuIHRoZSBlbmQgb2YgdGhlIHN0cmluZyBmcm9tXHJcblx0XHRcdFx0ICogdW5zaWduaWZpY2FudCBudW1iZXJzIGNvbnZlcnRpbmdcclxuXHRcdFx0XHQgKiBYWFguMzBYWFhYIHRvIFhYWC4zMFxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYoIXZhbHVlKSByZXR1cm4gJyc7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdcXC4oXFxkezMsfSkkJyksXHJcblx0XHRcdFx0XHRcdG1hdGNoID0gdmFsdWUubWF0Y2gocmVnZXgpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYobWF0Y2ggaW5zdGFuY2VvZiBBcnJheSAmJiBtYXRjaFsxXSkge1xyXG5cdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShtYXRjaCwgbWF0Y2gudG9TdHJpbmcoKS5zdWJzdHIoMCwgMikpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcclxuXHRcdFx0JG1hc2tlclByb3ZpZGVyLmN1cnJlbmN5ID0gY3VycmVuY3k7XHJcblxyXG5cdFx0XHRyZXR1cm4gJG1hc2tlclByb3ZpZGVyO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFkZCBhIG5ldyBtYXRjaCB0YXNrIHRvICRtYXNrZXIudW5tYXNrTWF0Y2hlcy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5hZGRVbm1hc2tNYXRjaCA9IGZ1bmN0aW9uIChyZXBsYWNlLCB2YWx1ZSkge1xyXG5cdFx0XHQkbWFza2VyUHJvdmlkZXIudW5tYXNrTWF0Y2hlcy51bnNoaWZ0KHtcclxuXHRcdFx0XHQncmVwbGFjZSc6IHJlcGxhY2UsXHJcblx0XHRcdFx0J3dpdGgnOiB2YWx1ZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiAkbWFza2VyUHJvdmlkZXI7XHJcblx0XHR9O1x0XHRcdFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJG1hc2tlci5tYXNrTWF0Y2hlcy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5hZGRNYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcclxuXHRcdFx0dmFyIG1hdGNoID0ge307XHJcblxyXG5cdFx0XHRpZighdmFsdWUpIHtcclxuXHRcdFx0XHRtYXRjaC5yZXBsYWNlID0gcmVwbGFjZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtYXRjaC5yZXBsYWNlID0gcmVwbGFjZTtcclxuXHRcdFx0XHRtYXRjaC53aXRoID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRtYXNrZXJQcm92aWRlci5tYXNrTWF0Y2hlcy51bnNoaWZ0KG1hdGNoKTtcclxuXHJcblx0XHRcdHJldHVybiAkbWFza2VyUHJvdmlkZXI7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuJGdldCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZnVuY3Rpb24gJE1hc2tlckZhY3RvcnkgKCkge1xyXG5cdFx0XHRcdHZhciAkbWFza2VyID0ge307XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGFkZEN1cnJlbmN5ICh2YWx1ZSwgY3VycmVuY3kpIHtcclxuXHRcdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xyXG5cclxuXHRcdFx0XHRcdC8qKlxyXG5cdFx0XHRcdFx0ICogQ29udmVydHMgQHZhbHVlIHRvIGEgU3RyaW5nIGluc3RhbmNlLCBmb3IgTnVtYmVyXHJcblx0XHRcdFx0XHQgKiBpbnN0YW5jZXMgZG9lc24ndCBoYXZlIC5yZXBsYWNlKCkgcHJvdG90eXBlLlxyXG5cdFx0XHRcdFx0ICovXHJcblx0XHRcdFx0XHR2YXIgbmV3VmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0XHRcdC8vIEltcGxlbWVudHMgdGhlIGN1cnJlbmN5IGF0IEBuZXdWYWx1ZVxyXG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBuZXdWYWx1ZS5yZXBsYWNlKC9eLywgKGN1cnJlbmN5ID8gY3VycmVuY3kgOiAkbWFza2VyUHJvdmlkZXIuZGVmYXVsdHMuY3VycmVuY3kpICsgJyAnKTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gbmV3VmFsdWU7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0LyoqXHJcblx0XHRcdFx0ICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0JG1hc2tlci5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIGN1cnJlbmN5KSB7XHJcblx0XHRcdFx0XHR2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRtYXRjaGVzID0gJG1hc2tlclByb3ZpZGVyLmRlZmF1bHRzLm1hc2tNYXRjaGVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRcdFx0XHRpZihrZXkucmVwbGFjZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0bWFza2VkVmFsdWUgPSBrZXkucmVwbGFjZShtYXNrZWRWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0bWFza2VkVmFsdWUgPSBtYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdG1hc2tlZFZhbHVlID0gYWRkQ3VycmVuY3kobWFza2VkVmFsdWUsIGN1cnJlbmN5KTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gbWFza2VkVmFsdWU7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0JG1hc2tlci51bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0dmFyIHVubWFza2VkVmFsdWUgPSB2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRtYXRjaGVzID0gJG1hc2tlclByb3ZpZGVyLmRlZmF1bHRzLnVubWFza01hdGNoZXM7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdFx0XHRcdGlmKGtleS5yZXBsYWNlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHRcdFx0XHRcdFx0XHR1bm1hc2tlZFZhbHVlID0ga2V5LnJlcGxhY2UodW5tYXNrZWRWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0cmV0dXJuIHVubWFza2VkVmFsdWU7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRtYXNrZXI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBuZXcgJE1hc2tlckZhY3Rvcnk7XHJcblx0XHR9O1xyXG5cdH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay5kaXJlY3RpdmVzLm5nQ3VycmVuY3lNYXNrJywgW10pXHJcblxyXG5cdC5kaXJlY3RpdmUoJ25nQ3VycmVuY3lNYXNrJywgZnVuY3Rpb24gKCRtYXNrZXIpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdHJlcXVpcmU6IFsnP25nTW9kZWwnXSxcclxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcclxuXHRcdFx0XHR2YXIgbmdNb2RlbCA9IGNvbnRyb2xsZXJzWzBdLFxyXG5cdFx0XHRcdFx0XHRjdXJyZW5jeSA9ICFhdHRycy5jdXJyZW5jeSA/IG51bGwgOiBhdHRycy5jdXJyZW5jeTtcclxuXHJcblx0XHRcdFx0LyoqXHJcblx0XHRcdFx0ICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0dmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICRtYXNrZXIubWFza1ZhbHVlKHZhbHVlLCBjdXJyZW5jeSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0dmFyIHVubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJG1hc2tlci51bm1hc2tWYWx1ZSh2YWx1ZSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBQYXJzZXIgd2hvIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgbmdNb2RlbFxyXG5cdFx0XHRcdCAqIGJlZm9yZSB0aGUgZ29lcyB0byBET00uIFRoYXQgaXMgdGhlIHJlYWwgbmdNb2RlbCB2YWx1ZS5cclxuXHRcdFx0XHQgKi9cclxuXHRcdFx0XHR2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdW5tYXNrVmFsdWUodmFsdWUpO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdG5nTW9kZWwuJHBhcnNlcnMucHVzaChwYXJzZXIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8qKlxyXG5cdFx0XHRcdCAqIEV2ZXJ5dGltZSB0aGUgaW5wdXQgc3VmZmVyIGEgY2hhbmdlLFxyXG5cdFx0XHRcdCAqIHRoZSBkaXJlY3RpdmUgd2lsbCB1cGRhdGUgaXQgYW5kIG1hc2tcclxuXHRcdFx0XHQgKiBhbGwgdGhlIHR5cGVkIGNvbnRlbnQuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0c2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0aWYoIXZhbHVlIHx8IHZhbHVlLmxlbmd0aCA8IDEpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYobWFza2VkVmFsdWUgIT0gdmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcclxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kcmVuZGVyKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGVsZW1lbnQub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoZXZ0LndoaWNoIDwgNDggfHwgZXZ0LndoaWNoID4gNTcpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfSlcclxuXHJcblx0ICAgICAgICAgICAgZWxlbWVudC5vbigncGFzdGUnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBwYXN0ZURhdGEgPSBldnQub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQnKVxyXG5cdCAgICAgICAgICAgICAgICBpZihpc05hTihwYXN0ZURhdGEpKXtcclxuXHQgICAgICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfSlcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2sucHJvdmlkZXJzJywgW1xyXG5cdFx0J25nQ3VycmVuY3lNYXNrLnByb3ZpZGVycy5tYXNrZXInXHJcblx0XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9