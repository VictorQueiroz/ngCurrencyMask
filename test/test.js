'use strict';

import angular from 'angular';
import ngCurrencyMask from '../src/module';
import 'angular-mocks';
import 'angular-i18n/angular-locale_pt-br';

angular.module('testModule', [
    ngCurrencyMask.name
]);

describe('ngCurrencyMask', function () {
	var $rootScope, $compile;

	beforeEach(angular.mock.module('testModule'));

	beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
	}));

	describe('ngCurrencyMask filter', function () {
		var $filter, currencyMaskFilter;

		beforeEach(angular.mock.inject(function (_$filter_) {
			$filter = _$filter_;

			currencyMaskFilter = $filter('currencyMask');
		}));

		it('should mask the input', function () {
			var maskedValue = currencyMaskFilter('10.00', 'mask');

			expect(maskedValue).toBe('R$10,00');
		});

		it('should unmask the input', function () {
			var unmaskedValue = currencyMaskFilter('R$10,00', 'unmask');
			unmaskedValue = parseFloat(unmaskedValue);

			expect(unmaskedValue).toBe(10);
		});

		it('should insert a custom currency', function () {
			var maskedValue = currencyMaskFilter(1000.00, 'mask', 'US');

			expect(maskedValue).toBe('US1.000,00');
		});

		it('should keep default currency if the value of third filter field is null', function () {
			var maskedValue = currencyMaskFilter(1000000.00, 'mask', 'ANY CURRENCY ');

			expect(maskedValue).toBe('ANY CURRENCY 1.000.000,00');

			var maskedValue = currencyMaskFilter(0.10, 'mask', null);

			expect(maskedValue).toBe('R$0,10');					
		});

		it('should mask and unmask the input', function () {
			var maskedValue = currencyMaskFilter(10.0, 'mask');

			expect(maskedValue).toBe('R$10,00');

			var unmaskedValue = currencyMaskFilter(maskedValue, 'unmask');
			unmaskedValue = parseFloat(unmaskedValue);

			expect(unmaskedValue).toBe(10);
		});

		it('should use the default currency', function () {
			var maskedValue = currencyMaskFilter(5.0, 'mask', 'default');

			expect(maskedValue).toBe('R$5,00');

			var unmaskedValue = parseFloat(currencyMaskFilter(maskedValue, 'unmask', 'default'));

			expect(unmaskedValue).toBe(5.00);					
		});
	});
	describe('ngCurrencyMask directive', function () {
		var scope, element, form;

		beforeEach(angular.mock.inject(function ($injector) {
			scope = $rootScope.$new();
			scope.currency = 1000.00;
		}));

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
			expect(form.masked.$viewValue).toBe('R$1.000,00');
		});

		it('should have unmasked content', function () {
			var $viewValue = Number(form.unmasked.$viewValue);
			expect($viewValue).toBe(1000.00);
		});

		it('should change the masked input', function () {
			scope.currency = 10.20;
			scope.$digest();

			expect(form.masked.$viewValue).toBe('R$10,20');
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
			expect(form.masked.$viewValue).toBe('R$250,00');
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

			expect(form.masked.$viewValue).toBe('R$0,12');
		});

		it('should not include a zero when the number have more than two characters', function () {
			scope.currency = 1.12;
			scope.$digest();

			expect(form.masked.$viewValue).toBe('R$1,12');
		});

		it('should remove the zero at the start of the string', function () {
			scope.currency = '0001.12';
			scope.$digest();

			expect(form.masked.$viewValue).toBe('R$1,12');

			// another test
			scope.currency = '000000000000000000000250.00';
			scope.$digest();

			var unmaskedViewValue = Number(form.unmasked.$viewValue);

			expect(unmaskedViewValue).toBe(250.00);
			expect(form.masked.$viewValue).toBe('R$250,00');					
		});

		it('should add cents even if we have more than one zero at the start of the string', function () {
			scope.currency = '0000000112.50';

			scope.$digest();
			expect(form.masked.$viewValue).toBe('R$112,50');
		});
	});
});