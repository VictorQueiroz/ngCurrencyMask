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
	});