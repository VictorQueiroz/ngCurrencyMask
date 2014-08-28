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

		describe('directives', function () {
			var $rootScope, $compile, scope, element, form;

			beforeEach(inject(function ($injector) {
				$rootScope = $injector.get('$rootScope');
				$compile = $injector.get('$compile');
				scope = $rootScope.$new();
				scope.currency = 100000;
			}));

			describe('ngCurrencyMask directive', function () {
				beforeEach(function () {
					element = angular.element('<form name="form">' +
						'<input type="text" name="masked" ng-model="currency" ng-currency-mask>' +
						'<input type="text" name="unmasked" ng-model="currency" class="clean-of-mask">' +
					'</form>');
					element = $compile(element)(scope);
					form = scope.form;
					scope.$digest();
				});

				it('should have masked content', function () {
					expect(form.masked.$viewValue).toBe('R$ 1.000,00');
				});

				it('should have unmasked content', function () {
					var $viewValue = Number(form.unmasked.$viewValue);
					expect($viewValue).toBe(100000);
				});

				it('should change the masked input', function () {
					scope.currency = 1020;
					scope.$digest();

					expect(form.masked.$viewValue).toBe('R$ 10,20');
				});

				it('should change the unmasked input', function () {
					scope.currency = 1020;
					scope.$digest();

					var $viewValue = Number(form.unmasked.$viewValue);

					expect($viewValue).toBe(1020);
				});
			});
		});
	});
})();