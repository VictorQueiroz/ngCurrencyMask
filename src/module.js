import * as angular from 'angular';
import MaskerProvider from './masker-provider';
import CurrencyMaskFilter from './currency-mask-filter';
import CurrencyMaskDirective from './currency-mask-directive';

export default angular.module('ngCurrencyMask', [])
                .directive('ngCurrencyMask', CurrencyMaskDirective)
                .filter('currencyMask', CurrencyMaskFilter)
                .provider('$masker', MaskerProvider);