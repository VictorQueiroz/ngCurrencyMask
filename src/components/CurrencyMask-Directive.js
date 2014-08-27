(function () {
	'use strict';

	angular
		.module('ngCurrencyMask/Directive/currencyMask', [])

		.directive('currencyMask', [function () {
		  return {
		    restrict: 'A',
		    require: '?ngModel',
		    link: function (scope, element, attrs, ngModel) {
		      if(!ngModel) return;
		      
		      scope.$watch(attrs.ngModel, function (value) {
		        var $viewValue = value
		          .replace(/[^\d]/g, '')
		          .replace(/(\d{2})$/, ',$1')
		          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

		        ngModel.$setViewValue($viewValue);
		        ngModel.$render();
		      });
		    }
		  };
		}]);
})();