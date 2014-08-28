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