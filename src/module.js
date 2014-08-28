(function () {
  'use strict';
  
  angular
    .module('ngCurrencyMask', ['ngCurrencyMask/Directives'])

    .value('ngCurrencyMaskConfig', {
			// Matches who will be applied to the input content.
			matches: [
				{ 'replace': /[^\d]/g, 'with': "" },
				{ 'replace': /(\d{2})$/, 'with': ",$1" },
				{ 'replace': /,(\d{3,})$/, 'with': '$1,00' },
				{ 'replace': /^(0{1,})/, 'with': '' },
				{ 'replace': /^,(\d{2})$/, 'with': "0,$1" },
				{ 'replace': /(\d)(?=(\d{3})+(?!\d))/g, 'with': "$1." },
				{ 'replace': /^/, 'with': "R$ " }
			]
		});
})();
