(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Directive/ngCurrencyMask', [])

		.directive('ngCurrencyMask', ['ngCurrencyMaskConfig', function (config) {
		  return {
		    restrict: 'A',
		    require: '?ngModel',
		    link: function (scope, element, attrs, ngModel) {
		    	/**
		    	 * Mask @value matching it contents.
		    	 */
		      var maskValue = function (value) {
		        var maskedValue = value,
		        		matches = config.matches;
		        
		        matches.forEach(function (key) {
		          maskedValue = maskedValue.replace(key.replace, key.with);
		        });
		        
		        return maskedValue;
		      };
		      
		      /**
		       * Return @value to it real value.
		       */
		      var unmaskValue = function (value) {
		        return value.replace(/\D/g, '');
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