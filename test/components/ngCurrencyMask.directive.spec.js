'use strict';

describe('ngCurrencyMask.directives.ngCurrencyMask', function () {
	var MODULE_NAME = 'ngCurrencyMask.directives.ngCurrencyMask',
	MODULE_DEPENDENCIES = [
		'ngCurrencyMask'
	],
	MODULE_CONTROLLERS = [],
	MODULE_DIRECTIVES = [
		'ngCurrencyMask'
	];

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
			scope.currency = 1000.00;
		}));

		describe('ngCurrencyMask directive', function () {
			beforeEach(function () {
				element = angular.element('<form name="form">' +
					'<input type="text" name="masked" ng-model="currency" data-currency="R$" ng-currency-mask>' +
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
				expect($viewValue).toBe(1000.00);
			});

			it('should change the masked input', function () {
				scope.currency = 10.20;
				scope.$digest();

				expect(form.masked.$viewValue).toBe('R$ 10,20');
			});

			it('should change the unmasked input', function () {
				scope.currency = 10.20;
				scope.$digest();

				var $viewValue = Number(form.unmasked.$viewValue);

				expect($viewValue).toBe(10.20);
			});

			it('should not accept non-digit characters', function () {
				scope.currency = 'This is a phrase.';
				scope.$digest();

				expect(form.unmasked.$viewValue).toBe('');
			});

			it('should accept digit characters', function () {
				scope.currency = 250.00;
				scope.$digest();

				var unmaskedViewValue = Number(form.unmasked.$viewValue);

				expect(unmaskedViewValue).toBe(250.00);
				expect(form.masked.$viewValue).toBe('R$ 250,00');
			});

			it('should exclude non-digit characters', function () {
				scope.currency = 'Th1s 1s 4 phr4s3.';
				scope.$digest();

				var $viewValue = Number(form.unmasked.$viewValue);

				expect($viewValue).toBe(114.43);
			});

			it('should include a zero when the user have digited only two characters', function () {
				scope.currency = 0.12;
				scope.$digest();

				expect(form.masked.$viewValue).toBe('R$ 0,12');
			});

			it('should not include a zero when the number have more than two characters', function () {
				scope.currency = 1.12;
				scope.$digest();

				expect(form.masked.$viewValue).toBe('R$ 1,12');
			});

			it('should remove the zero at the start of the string', function () {
				scope.currency = '0001.12';
				scope.$digest();

				expect(form.masked.$viewValue).toBe('R$ 1,12');

				// another test
				scope.currency = '000000000000000000000250.00';
				scope.$digest();

				var unmaskedViewValue = Number(form.unmasked.$viewValue);

				expect(unmaskedViewValue).toBe(250.00);
				expect(form.masked.$viewValue).toBe('R$ 250,00');					
			});

			it('should add cents even if we have more than one zero at the start of the string', function () {
				scope.currency = '0000000112.50';

				scope.$digest();
				expect(form.masked.$viewValue).toBe('R$ 112,50');
			});
		});
	});
});