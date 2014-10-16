'use strict';

describe('ngCurrencyMask.filters.currencyMask', function () {
	var MODULE_NAME = 'ngCurrencyMask.filters.currencyMask',
	MODULE_DEPENDENCIES = [
		'ngCurrencyMask'
	],
	MODULE_CONTROLLERS = [],
	MODULE_DIRECTIVES = [],
	MODULE_FILTERS = [
		'currencyMask'
	];

	beforeEach(module(MODULE_NAME));

	MODULE_DEPENDENCIES.forEach(function (dependency) {
		beforeEach(module(dependency));
	});

	describe('filters', function () {
		describe('currencyMask', function () {
			var $filter, currencyMaskFilter;

			beforeEach(inject(function ($injector) {
				$filter = $injector.get('$filter');
				currencyMaskFilter = $filter('currencyMask');
			}));

			it('should mask the input', function () {
				var maskedValue = currencyMaskFilter('10.00', 'mask');

				expect(maskedValue).toBe('R$ 10,00');
			});

			it('should unmask the input', function () {
				var unmaskedValue = currencyMaskFilter('R$ 10,00', 'unmask');
				unmaskedValue = parseFloat(unmaskedValue);

				expect(unmaskedValue).toBe(10);
			});

			it('should insert a custom currency', function () {
				var maskedValue = currencyMaskFilter(1000.00, 'mask', 'US');

				expect(maskedValue).toBe('US 1.000,00');
			});

			it('should keep default currency if the value of third filter field is null', function () {
				var maskedValue = currencyMaskFilter(1000000.00, 'mask', 'ANY CURRENCY');

				expect(maskedValue).toBe('ANY CURRENCY 1.000.000,00');

				var maskedValue = currencyMaskFilter(0.10, 'mask', null);

				expect(maskedValue).toBe('R$ 0,10');					
			});

			it('should mask and unmask the input', function () {
				var maskedValue = currencyMaskFilter(10.0, 'mask');

				expect(maskedValue).toBe('R$ 10,00');

				var unmaskedValue = currencyMaskFilter(maskedValue, 'unmask');
				unmaskedValue = parseFloat(unmaskedValue);

				expect(unmaskedValue).toBe(10);
			});

			it('should use the default currency', function () {
				var maskedValue = currencyMaskFilter(5.0, 'mask', 'default');

				expect(maskedValue).toBe('R$ 5,00');

				var unmaskedValue = parseFloat(currencyMaskFilter(maskedValue, 'unmask', 'default'));

				expect(unmaskedValue).toBe(5.00);					
			});
		});
	});
});