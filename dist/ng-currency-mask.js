(function() {
    "use strict";
    angular.module("ngCurrencyMask", [ "ngCurrencyMask/Services", "ngCurrencyMask/Directives", "ngCurrencyMask/Filters" ]).value("ngCurrencyMaskConfig", {
        matches: [ {
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
        }, {
            replace: /^/,
            "with": "R$ "
        } ]
    });
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Service/Masker", []).factory("Masker", [ "ngCurrencyMaskConfig", function(r) {
        var n = function(n) {
            var a = n.toString(), e = r.matches;
            e.forEach(function(r) {
                a = a.replace(r.replace, r.with);
            });
            return a;
        };
        var a = function(r) {
            var a = n(r).replace(/\D/g, "");
            return a;
        };
        return {
            maskValue: n,
            unmaskValue: a
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2RpcmVjdGl2ZXMuanMiLCJjb21wb25lbnRzL2ZpbHRlcnMuanMiLCJjb21wb25lbnRzL25nQ3VycmVuY3lNYXNrLURpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvc2VydmljZXMuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsInZhbHVlIiwibWF0Y2hlcyIsInJlcGxhY2UiLCJ3aXRoIiwiZmFjdG9yeSIsImNvbmZpZyIsIm1hc2tWYWx1ZSIsIm1hc2tlZFZhbHVlIiwidG9TdHJpbmciLCJmb3JFYWNoIiwia2V5IiwidW5tYXNrVmFsdWUiLCJ1bm1hc2tlZFZhbHVlIiwiZmlsdGVyIiwiTWFza2VyIiwiZGlnZXN0TW9kZSIsIm1vZGUiLCJpbnB1dCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwicmVxdWlyZSIsImxpbmsiLCJzY29wZSIsImVsZW1lbnQiLCJhdHRycyIsImNvbnRyb2xsZXJzIiwibmdNb2RlbCIsInBhcnNlciIsIiRwYXJzZXJzIiwicHVzaCIsIiR3YXRjaCIsImxlbmd0aCIsIiRzZXRWaWV3VmFsdWUiLCIkcmVuZGVyIl0sIm1hcHBpbmdzIjoiQ0FBQTtJQUNFO0lBRUFBLFFBQ0dDLE9BQU8sb0JBQ1AsMkJBQ0EsNkJBQ0EsNEJBR0FDLE1BQU07UUFFUkM7WUFDR0MsU0FBVztZQUFVQyxRQUFROztZQUM3QkQsU0FBVztZQUFZQyxRQUFROztZQUMvQkQsU0FBVztZQUFjQyxRQUFROztZQUNqQ0QsU0FBVztZQUFZQyxRQUFROztZQUMvQkQsU0FBVztZQUFjQyxRQUFROztZQUNqQ0QsU0FBVztZQUEyQkMsUUFBUTs7WUFDOUNELFNBQVc7WUFBS0MsUUFBUTs7OztDQ25COUI7SUFDQztJQUVBTCxRQUNFQyxPQUFPLHFDQUVQSyxRQUFRLFlBQVcsd0JBQXdCLFNBQVVDO1FBSXBELElBQUlDLElBQVksU0FBVU47WUFDeEIsSUFBSU8sSUFBY1AsRUFBTVEsWUFDdEJQLElBQVVJLEVBQU9KO1lBRW5CQSxFQUFRUSxRQUFRLFNBQVVDO2dCQUN4QkgsSUFBY0EsRUFBWUwsUUFBUVEsRUFBSVIsU0FBU1EsRUFBSVA7O1lBR3JELE9BQU9JOztRQU1ULElBQUlJLElBQWMsU0FBVVg7WUFDM0IsSUFBSVksSUFBZ0JOLEVBQVVOLEdBQU9FLFFBQVEsT0FBTztZQUVuRCxPQUFPVTs7UUFHVjtZQUNDTixXQUFXQTtZQUNYSyxhQUFhQTs7OztDQ2hDakI7SUFDQztJQUVBYixRQUNFQyxPQUFPLDBDQUVQYyxPQUFPLGtCQUFpQixVQUFVLFNBQVVDO1FBQzVDLElBQUlDLElBQWEsU0FBVUM7WUFDMUIsUUFBT0E7Y0FDTixLQUFLO2dCQUNKLE9BQU87Z0JBQ1A7O2NBQ0QsS0FBSztnQkFDSixPQUFPO2dCQUNQOzs7UUFJSCxPQUFPLFNBQVVDLEdBQU9EO1lBRXZCLElBQUlBLElBQU9BLElBQU9ELEVBQVdDLEtBQVFELEVBQVc7WUFFaEQsSUFBR0MsTUFBUyxHQUFHO2dCQUNkLE9BQU9GLEVBQU9SLFVBQVVXO21CQUNsQixJQUFJRCxNQUFTLEdBQUc7Z0JBQ3RCLE9BQU9GLEVBQU9ILFlBQVlNOzs7OztDQ3pCL0I7SUFDQztJQUVBbkIsUUFDRUMsT0FBTywrQkFBOEI7O0NDSnhDO0lBQ0M7SUFFQUQsUUFDRUMsT0FBTyw0QkFBMkI7O0NDSnJDO0lBQ0M7SUFFQUQsUUFDRUMsT0FBTywrQ0FFUG1CLFVBQVUsb0JBQW1CLFVBQVUsU0FBVUo7UUFDaEQ7WUFDRUssVUFBVTtZQUNWQyxXQUFVO1lBQ1ZDLE1BQU0sU0FBVUMsR0FBT0MsR0FBU0MsR0FBT0M7Z0JBQ3RDLElBQUlDLElBQVVELEVBQVk7Z0JBS3pCLElBQUluQixJQUFZLFNBQVVOO29CQUN4QixPQUFPYyxFQUFPUixVQUFVTjs7Z0JBTTFCLElBQUlXLElBQWMsU0FBVVg7b0JBQzFCLE9BQU9jLEVBQU9ILFlBQVlYOztnQkFPNUIsSUFBSTJCLElBQVMsU0FBVTNCO29CQUNyQixPQUFPVyxFQUFZWDs7Z0JBR3JCMEIsRUFBUUUsU0FBU0MsS0FBS0Y7Z0JBT3RCTCxFQUFNUSxPQUFPTixFQUFNRSxTQUFTLFNBQVUxQjtvQkFDckMsS0FBSUEsS0FBU0EsRUFBTStCLFNBQVMsR0FBRzt3QkFBRTs7b0JBRWhDLElBQUl4QixJQUFjRCxFQUFVTjtvQkFFNUIsSUFBR08sS0FBZVAsR0FBTzt3QkFDdkIwQixFQUFRTSxjQUFjekI7d0JBQ3RCbUIsRUFBUU87Ozs7Ozs7Q0NqRHBCO0lBQ0M7SUFFQW5DLFFBQ0VDLE9BQU8sNkJBQTRCIiwiZmlsZSI6Im5nLWN1cnJlbmN5LW1hc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG4gIFxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnbmdDdXJyZW5jeU1hc2snLCBbXG4gICAgXHQnbmdDdXJyZW5jeU1hc2svU2VydmljZXMnLFxuICAgIFx0J25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZXMnLFxuICAgIFx0J25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnICAgIFx0XG4gICAgXSlcblxuICAgIC52YWx1ZSgnbmdDdXJyZW5jeU1hc2tDb25maWcnLCB7XG5cdFx0XHQvLyBNYXRjaGVzIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGNvbnRlbnQuXG5cdFx0XHRtYXRjaGVzOiBbXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvW15cXGRdL2csICd3aXRoJzogXCJcIiB9LFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogXCIsJDFcIiB9LFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLywoXFxkezMsfSkkLywgJ3dpdGgnOiAnJDEsMDAnIH0sXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXigwezEsfSkvLCAnd2l0aCc6ICcnIH0sXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXiwoXFxkezJ9KSQvLCAnd2l0aCc6IFwiMCwkMVwiIH0sXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnd2l0aCc6IFwiJDEuXCIgfSxcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eLywgJ3dpdGgnOiBcIlIkIFwiIH1cblx0XHRcdF1cblx0XHR9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2UvTWFza2VyJywgW10pXG5cblx0XHQuZmFjdG9yeSgnTWFza2VyJywgWyduZ0N1cnJlbmN5TWFza0NvbmZpZycsIGZ1bmN0aW9uIChjb25maWcpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgdmFyIG1hc2tlZFZhbHVlID0gdmFsdWUudG9TdHJpbmcoKSxcblx0XHQgICAgXHRcdG1hdGNoZXMgPSBjb25maWcubWF0Y2hlcztcblx0XHQgICAgXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgICAgbWFza2VkVmFsdWUgPSBtYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIH0pO1xuXHRcdCAgICBcblx0XHQgICAgcmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblx0XHQgIFxuXHRcdCAgLyoqXG5cdFx0ICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgKi9cblx0XHQgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgXHR2YXIgdW5tYXNrZWRWYWx1ZSA9IG1hc2tWYWx1ZSh2YWx1ZSkucmVwbGFjZSgvXFxEL2csICcnKTtcblxuXHRcdCAgICByZXR1cm4gdW5tYXNrZWRWYWx1ZTtcblx0XHQgIH07XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG1hc2tWYWx1ZTogbWFza1ZhbHVlLFxuXHRcdFx0XHR1bm1hc2tWYWx1ZTogdW5tYXNrVmFsdWVcblx0XHRcdH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5maWx0ZXIoJ2N1cnJlbmN5TWFzaycsIFsnTWFza2VyJywgZnVuY3Rpb24gKE1hc2tlcikge1xuXHRcdFx0dmFyIGRpZ2VzdE1vZGUgPSBmdW5jdGlvbiAobW9kZSkge1xuXHRcdFx0XHRzd2l0Y2gobW9kZSkge1xuXHRcdFx0XHRcdGNhc2UgJ21hc2snOlxuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICd1bm1hc2snOlxuXHRcdFx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSkge1xuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXG5cdFx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyk7XG5cblx0XHRcdFx0aWYobW9kZSA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiBNYXNrZXIubWFza1ZhbHVlKGlucHV0KTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSAyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJywgWyduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmUvbmdDdXJyZW5jeU1hc2snXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRmlsdGVycycsIFsnbmdDdXJyZW5jeU1hc2svRmlsdGVyL2N1cnJlbmN5TWFzayddKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmUvbmdDdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5kaXJlY3RpdmUoJ25nQ3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XG5cdFx0ICByZXR1cm4ge1xuXHRcdCAgICByZXN0cmljdDogJ0EnLFxuXHRcdCAgICByZXF1aXJlOiBbJz9uZ01vZGVsJ10sXG5cdFx0ICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSB7XG5cdFx0ICAgIFx0dmFyIG5nTW9kZWwgPSBjb250cm9sbGVyc1swXTtcblxuXHRcdCAgICBcdC8qKlxuXHRcdCAgICBcdCAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxuXHRcdCAgICBcdCAqL1xuXHRcdCAgICAgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcdFx0ICAgICAgICBcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgIH07XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcblx0XHQgICAgICAgKiBiZWZvcmUgdGhlIGdvZXMgdG8gRE9NLiBUaGF0IGlzIHRoZSByZWFsIG5nTW9kZWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIHVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXG5cdFx0ICAgICAgbmdNb2RlbC4kcGFyc2Vycy5wdXNoKHBhcnNlcik7XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogRXZlcnl0aW1lIHRoZSBpbnB1dCBzdWZmZXIgYSBjaGFuZ2UsXG5cdFx0ICAgICAgICogdGhlIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdCBhbmQgbWFza1xuXHRcdCAgICAgICAqIGFsbCB0aGUgdHlwZWQgY29udGVudC5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgXHRpZighdmFsdWUgfHwgdmFsdWUubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cblxuXHRcdCAgICAgICAgdmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICAgIFxuXHRcdCAgICAgICAgaWYobWFza2VkVmFsdWUgIT0gdmFsdWUpIHtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgfSk7XG5cdFx0ICAgIH1cblx0XHQgIH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJywgWyduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlciddKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9