(function() {
    "use strict";
    angular.module("ngCurrencyMask", [ "ngCurrencyMask/Services", "ngCurrencyMask/Directives", "ngCurrencyMask/Filters" ]).value("ngCurrencyMaskConfig", {
        currency: "R$ ",
        maskMatches: [ {
            replace: /[^\d]/g,
            "with": ""
        }, {
            replace: /(\d{2})$/,
            "with": ",$1"
        }, {
            replace: /,(\d{3,})$/,
            "with": "$1,00"
        }, {
            replace: /^(0{1,})/,
            "with": ""
        }, {
            replace: /^,(\d{2})$/,
            "with": "0,$1"
        }, {
            replace: /(\d)(?=(\d{3})+(?!\d))/g,
            "with": "$1."
        } ],
        unmaskMatches: [ {
            replace: /\D/g,
            "with": ""
        } ]
    });
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Service/Masker", []).factory("Masker", [ "ngCurrencyMaskConfig", function(r) {
        var n = function(n, a) {
            var e = n.toString(), a = a ? a : r.currency;
            e = e.replace(/^/, a);
            return e;
        };
        var a = function(a) {
            var e = a.toString(), t = r.maskMatches;
            t.forEach(function(r) {
                e = e.replace(r.replace, r.with);
            });
            e = n(e);
            return e;
        };
        var e = function(n) {
            var a = n.toString(), e = r.unmaskMatches;
            e.forEach(function(r) {
                a = a.replace(r.replace, r.with);
            });
            return a;
        };
        return {
            maskValue: a,
            unmaskValue: e
        };
    } ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Filter/currencyMask", []).filter("currencyMask", [ "Masker", function(r) {
        var e = function(r) {
            switch (r) {
              case "mask":
                return 1;
                break;

              case "unmask":
                return 2;
                break;
            }
        };
        return function(n, a) {
            var a = a ? e(a) : e("mask");
            if (a === 1) {
                return r.maskValue(n);
            } else if (a === 2) {
                return r.unmaskValue(n);
            }
        };
    } ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Directives", [ "ngCurrencyMask/Directive/ngCurrencyMask" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Filters", [ "ngCurrencyMask/Filter/currencyMask" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Directive/ngCurrencyMask", []).directive("ngCurrencyMask", [ "Masker", function(r) {
        return {
            restrict: "A",
            require: [ "?ngModel" ],
            link: function(n, e, u, t) {
                var a = t[0];
                var i = function(n) {
                    return r.maskValue(n);
                };
                var c = function(n) {
                    return r.unmaskValue(n);
                };
                var s = function(r) {
                    return c(r);
                };
                a.$parsers.push(s);
                n.$watch(u.ngModel, function(r) {
                    if (!r || r.length < 1) {
                        return;
                    }
                    var n = i(r);
                    if (n != r) {
                        a.$setViewValue(n);
                        a.$render();
                    }
                });
            }
        };
    } ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Services", [ "ngCurrencyMask/Service/Masker" ]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2RpcmVjdGl2ZXMuanMiLCJjb21wb25lbnRzL2ZpbHRlcnMuanMiLCJjb21wb25lbnRzL25nQ3VycmVuY3lNYXNrLURpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvc2VydmljZXMuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsInZhbHVlIiwiY3VycmVuY3kiLCJtYXNrTWF0Y2hlcyIsInJlcGxhY2UiLCJ3aXRoIiwidW5tYXNrTWF0Y2hlcyIsImZhY3RvcnkiLCJjb25maWciLCJjaGFuZ2VDdXJyZW5jeSIsIm5ld1ZhbHVlIiwidG9TdHJpbmciLCJtYXNrVmFsdWUiLCJtYXNrZWRWYWx1ZSIsIm1hdGNoZXMiLCJmb3JFYWNoIiwia2V5IiwidW5tYXNrVmFsdWUiLCJ1bm1hc2tlZFZhbHVlIiwiZmlsdGVyIiwiTWFza2VyIiwiZGlnZXN0TW9kZSIsIm1vZGUiLCJpbnB1dCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwicmVxdWlyZSIsImxpbmsiLCJzY29wZSIsImVsZW1lbnQiLCJhdHRycyIsImNvbnRyb2xsZXJzIiwibmdNb2RlbCIsInBhcnNlciIsIiRwYXJzZXJzIiwicHVzaCIsIiR3YXRjaCIsImxlbmd0aCIsIiRzZXRWaWV3VmFsdWUiLCIkcmVuZGVyIl0sIm1hcHBpbmdzIjoiQ0FBQTtJQUNFO0lBRUFBLFFBQ0dDLE9BQU8sb0JBQ1AsMkJBQ0EsNkJBQ0EsNEJBR0FDLE1BQU07UUFDTkMsVUFBVTtRQUdaQztZQUNHQyxTQUFXO1lBQVVDLFFBQVE7O1lBQzdCRCxTQUFXO1lBQVlDLFFBQVE7O1lBQy9CRCxTQUFXO1lBQWNDLFFBQVE7O1lBQ2pDRCxTQUFXO1lBQVlDLFFBQVE7O1lBQy9CRCxTQUFXO1lBQWNDLFFBQVE7O1lBQ2pDRCxTQUFXO1lBQTJCQyxRQUFROztRQUdqREM7WUFDR0YsU0FBVztZQUFPQyxRQUFNOzs7O0NDeEI5QjtJQUNDO0lBRUFOLFFBQ0VDLE9BQU8scUNBRVBPLFFBQVEsWUFBVyx3QkFBd0IsU0FBVUM7UUFDckQsSUFBSUMsSUFBaUIsU0FBVVIsR0FBT0M7WUFDckMsSUFBSVEsSUFBV1QsRUFBTVUsWUFDbkJULElBQVdBLElBQVdBLElBQVdNLEVBQU9OO1lBRTFDUSxJQUFXQSxFQUFTTixRQUFRLEtBQUtGO1lBRWpDLE9BQU9ROztRQU1QLElBQUlFLElBQVksU0FBVVg7WUFDeEIsSUFBSVksSUFBY1osRUFBTVUsWUFDdEJHLElBQVVOLEVBQU9MO1lBRW5CVyxFQUFRQyxRQUFRLFNBQVVDO2dCQUN4QkgsSUFBY0EsRUFBWVQsUUFBUVksRUFBSVosU0FBU1ksRUFBSVg7O1lBR3JEUSxJQUFjSixFQUFlSTtZQUU3QixPQUFPQTs7UUFNVCxJQUFJSSxJQUFjLFNBQVVoQjtZQUMxQixJQUFJaUIsSUFBZ0JqQixFQUFNVSxZQUN4QkcsSUFBVU4sRUFBT0Y7WUFFbkJRLEVBQVFDLFFBQVEsU0FBVUM7Z0JBQ3hCRSxJQUFnQkEsRUFBY2QsUUFBUVksRUFBSVosU0FBU1ksRUFBSVg7O1lBR3pELE9BQU9hOztRQUdWO1lBQ0NOLFdBQVdBO1lBQ1hLLGFBQWFBOzs7O0NDaERqQjtJQUNDO0lBRUFsQixRQUNFQyxPQUFPLDBDQUVQbUIsT0FBTyxrQkFBaUIsVUFBVSxTQUFVQztRQUM1QyxJQUFJQyxJQUFhLFNBQVVDO1lBQzFCLFFBQU9BO2NBQ04sS0FBSztnQkFDSixPQUFPO2dCQUNQOztjQUNELEtBQUs7Z0JBQ0osT0FBTztnQkFDUDs7O1FBSUgsT0FBTyxTQUFVQyxHQUFPRDtZQUV2QixJQUFJQSxJQUFPQSxJQUFPRCxFQUFXQyxLQUFRRCxFQUFXO1lBRWhELElBQUdDLE1BQVMsR0FBRztnQkFDZCxPQUFPRixFQUFPUixVQUFVVzttQkFDbEIsSUFBSUQsTUFBUyxHQUFHO2dCQUN0QixPQUFPRixFQUFPSCxZQUFZTTs7Ozs7Q0N6Qi9CO0lBQ0M7SUFFQXhCLFFBQ0VDLE9BQU8sK0JBQThCOztDQ0p4QztJQUNDO0lBRUFELFFBQ0VDLE9BQU8sNEJBQTJCOztDQ0pyQztJQUNDO0lBRUFELFFBQ0VDLE9BQU8sK0NBRVB3QixVQUFVLG9CQUFtQixVQUFVLFNBQVVKO1FBQ2hEO1lBQ0VLLFVBQVU7WUFDVkMsV0FBVTtZQUNWQyxNQUFNLFNBQVVDLEdBQU9DLEdBQVNDLEdBQU9DO2dCQUN0QyxJQUFJQyxJQUFVRCxFQUFZO2dCQUt6QixJQUFJbkIsSUFBWSxTQUFVWDtvQkFDeEIsT0FBT21CLEVBQU9SLFVBQVVYOztnQkFNMUIsSUFBSWdCLElBQWMsU0FBVWhCO29CQUMxQixPQUFPbUIsRUFBT0gsWUFBWWhCOztnQkFPNUIsSUFBSWdDLElBQVMsU0FBVWhDO29CQUNyQixPQUFPZ0IsRUFBWWhCOztnQkFHckIrQixFQUFRRSxTQUFTQyxLQUFLRjtnQkFPdEJMLEVBQU1RLE9BQU9OLEVBQU1FLFNBQVMsU0FBVS9CO29CQUNyQyxLQUFJQSxLQUFTQSxFQUFNb0MsU0FBUyxHQUFHO3dCQUFFOztvQkFFaEMsSUFBSXhCLElBQWNELEVBQVVYO29CQUU1QixJQUFHWSxLQUFlWixHQUFPO3dCQUN2QitCLEVBQVFNLGNBQWN6Qjt3QkFDdEJtQixFQUFRTzs7Ozs7OztDQ2pEcEI7SUFDQztJQUVBeEMsUUFDRUMsT0FBTyw2QkFBNEIiLCJmaWxlIjoibmctY3VycmVuY3ktbWFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZ0N1cnJlbmN5TWFzaycsIFtcbiAgICBcdCduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlcycsXG4gICAgXHQnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlcycsXG4gICAgXHQnbmdDdXJyZW5jeU1hc2svRmlsdGVycycgICAgXHRcbiAgICBdKVxuXG4gICAgLnZhbHVlKCduZ0N1cnJlbmN5TWFza0NvbmZpZycsIHtcbiAgICBcdGN1cnJlbmN5OiAnUiQgJyxcblxuXHRcdFx0Ly8gTWF0Y2hlcyB3aG8gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBjb250ZW50LlxuXHRcdFx0bWFza01hdGNoZXM6IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9bXlxcZF0vZywgJ3dpdGgnOiBcIlwiIH0sXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZHsyfSkkLywgJ3dpdGgnOiBcIiwkMVwiIH0sXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvLChcXGR7Myx9KSQvLCAnd2l0aCc6ICckMSwwMCcgfSxcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKDB7MSx9KS8sICd3aXRoJzogJycgfSxcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eLChcXGR7Mn0pJC8sICd3aXRoJzogXCIwLCQxXCIgfSxcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICd3aXRoJzogXCIkMS5cIiB9XG5cdFx0XHRdLFxuXG5cdFx0XHR1bm1hc2tNYXRjaGVzOiBbXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXFxEL2csIHdpdGg6ICcnIH1cblx0XHRcdF1cblx0XHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2UvTWFza2VyJywgW10pXG5cblx0XHQuZmFjdG9yeSgnTWFza2VyJywgWyduZ0N1cnJlbmN5TWFza0NvbmZpZycsIGZ1bmN0aW9uIChjb25maWcpIHtcblx0XHRcdHZhciBjaGFuZ2VDdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVuY3kpIHtcblx0XHRcdFx0dmFyIG5ld1ZhbHVlID0gdmFsdWUudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRcdGN1cnJlbmN5ID0gY3VycmVuY3kgPyBjdXJyZW5jeSA6IGNvbmZpZy5jdXJyZW5jeTtcblxuXHRcdFx0XHRuZXdWYWx1ZSA9IG5ld1ZhbHVlLnJlcGxhY2UoL14vLCBjdXJyZW5jeSk7XG5cblx0XHRcdFx0cmV0dXJuIG5ld1ZhbHVlO1xuXHRcdFx0fTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cblx0XHQgICAqL1xuXHRcdCAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICB2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGNvbmZpZy5tYXNrTWF0Y2hlcztcblx0XHQgICAgXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgbWFza2VkVmFsdWUgPSBtYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIH0pO1xuXHRcdCAgICBcblx0XHQgICAgbWFza2VkVmFsdWUgPSBjaGFuZ2VDdXJyZW5jeShtYXNrZWRWYWx1ZSk7XG5cblx0XHQgICAgcmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblx0XHQgIFxuXHRcdCAgLyoqXG5cdFx0ICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgKi9cblx0XHQgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICB2YXIgdW5tYXNrZWRWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCksXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gY29uZmlnLnVubWFza01hdGNoZXM7XG5cdFx0ICAgIFxuXHRcdCAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICAgIHVubWFza2VkVmFsdWUgPSB1bm1hc2tlZFZhbHVlLnJlcGxhY2Uoa2V5LnJlcGxhY2UsIGtleS53aXRoKTtcblx0XHQgICAgfSk7XG5cdFx0ICAgIFxuXHRcdCAgICByZXR1cm4gdW5tYXNrZWRWYWx1ZTtcblx0XHQgIH07XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG1hc2tWYWx1ZTogbWFza1ZhbHVlLFxuXHRcdFx0XHR1bm1hc2tWYWx1ZTogdW5tYXNrVmFsdWVcblx0XHRcdH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5maWx0ZXIoJ2N1cnJlbmN5TWFzaycsIFsnTWFza2VyJywgZnVuY3Rpb24gKE1hc2tlcikge1xuXHRcdFx0dmFyIGRpZ2VzdE1vZGUgPSBmdW5jdGlvbiAobW9kZSkge1xuXHRcdFx0XHRzd2l0Y2gobW9kZSkge1xuXHRcdFx0XHRcdGNhc2UgJ21hc2snOlxuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICd1bm1hc2snOlxuXHRcdFx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSkge1xuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXG5cdFx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyk7XG5cblx0XHRcdFx0aWYobW9kZSA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiBNYXNrZXIubWFza1ZhbHVlKGlucHV0KTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSAyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJywgWyduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmUvbmdDdXJyZW5jeU1hc2snXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRmlsdGVycycsIFsnbmdDdXJyZW5jeU1hc2svRmlsdGVyL2N1cnJlbmN5TWFzayddKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmUvbmdDdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5kaXJlY3RpdmUoJ25nQ3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XG5cdFx0ICByZXR1cm4ge1xuXHRcdCAgICByZXN0cmljdDogJ0EnLFxuXHRcdCAgICByZXF1aXJlOiBbJz9uZ01vZGVsJ10sXG5cdFx0ICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSB7XG5cdFx0ICAgIFx0dmFyIG5nTW9kZWwgPSBjb250cm9sbGVyc1swXTtcblxuXHRcdCAgICBcdC8qKlxuXHRcdCAgICBcdCAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxuXHRcdCAgICBcdCAqL1xuXHRcdCAgICAgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcdFx0ICAgICAgICBcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgIH07XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcblx0XHQgICAgICAgKiBiZWZvcmUgdGhlIGdvZXMgdG8gRE9NLiBUaGF0IGlzIHRoZSByZWFsIG5nTW9kZWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIHVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXG5cdFx0ICAgICAgbmdNb2RlbC4kcGFyc2Vycy5wdXNoKHBhcnNlcik7XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogRXZlcnl0aW1lIHRoZSBpbnB1dCBzdWZmZXIgYSBjaGFuZ2UsXG5cdFx0ICAgICAgICogdGhlIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdCBhbmQgbWFza1xuXHRcdCAgICAgICAqIGFsbCB0aGUgdHlwZWQgY29udGVudC5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgXHRpZighdmFsdWUgfHwgdmFsdWUubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cblxuXHRcdCAgICAgICAgdmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICAgIFxuXHRcdCAgICAgICAgaWYobWFza2VkVmFsdWUgIT0gdmFsdWUpIHtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgfSk7XG5cdFx0ICAgIH1cblx0XHQgIH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJywgWyduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlciddKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9