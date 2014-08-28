(function () {
	'use strict';

	var MODULE_NAME = 'ngCurrencyMask/Directive/ngCurrencyMask',
	MODULE_DEPENDENCIES = [
		'ngCurrencyMask'
	],
	MODULE_CONTROLLERS = [],
	MODULE_DIRECTIVES = [
		'ngCurrencyMask'
	];

	describe(MODULE_NAME + ' module', function () {
		beforeEach(module(MODULE_NAME));

		MODULE_DEPENDENCIES.forEach(function (dependency) {
			beforeEach(module(dependency));
		});

		describe('Directives', function () {
			var $rootScope, $compile, scope, element;

			beforeEach(inject(function ($injector) {
				$rootScope = $injector.get('$rootScope');
				$compile = $injector.get('$compile');
				scope = $rootScope.$new();
				scope.currency = 1000000;
			}));

			describe('ngCurrencyMask directive', function () {
				beforeEach(function () {
					element = '<form>' +
						'<input type="text" ng-model="currency" ng-currency-mask>' +
						'<input type="text" ng-model="currency" class="clean-of-mask">'
					'</form>';
					element = $compile(element)(scope);
					scope.$digest();
				});
			});
		});
	});
})();