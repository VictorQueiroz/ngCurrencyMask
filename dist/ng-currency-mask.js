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
            if (!n) return n;
            var e = n.toString();
            e = e.replace(/^/, a ? a + " " : r.currency);
            return e;
        };
        var a = function(a, e) {
            var t = a.toString(), c = r.maskMatches;
            c.forEach(function(r) {
                t = t.replace(r.replace, r.with);
            });
            t = n(t, e);
            return t;
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
                var c = t[0], a = !u.currency ? null : u.currency;
                var i = function(n) {
                    return r.maskValue(n, a);
                };
                var s = function(n) {
                    return r.unmaskValue(n);
                };
                var l = function(r) {
                    return s(r);
                };
                c.$parsers.push(l);
                n.$watch(u.ngModel, function(r) {
                    if (!r || r.length < 1) {
                        return;
                    }
                    var n = i(r);
                    if (n != r) {
                        c.$setViewValue(n);
                        c.$render();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2RpcmVjdGl2ZXMuanMiLCJjb21wb25lbnRzL2ZpbHRlcnMuanMiLCJjb21wb25lbnRzL25nQ3VycmVuY3lNYXNrLURpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvc2VydmljZXMuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsInZhbHVlIiwiY3VycmVuY3kiLCJtYXNrTWF0Y2hlcyIsInJlcGxhY2UiLCJ3aXRoIiwidW5tYXNrTWF0Y2hlcyIsImZhY3RvcnkiLCJjb25maWciLCJhZGRDdXJyZW5jeSIsIm5ld1ZhbHVlIiwidG9TdHJpbmciLCJtYXNrVmFsdWUiLCJtYXNrZWRWYWx1ZSIsIm1hdGNoZXMiLCJmb3JFYWNoIiwia2V5IiwidW5tYXNrVmFsdWUiLCJ1bm1hc2tlZFZhbHVlIiwiZmlsdGVyIiwiTWFza2VyIiwiZGlnZXN0TW9kZSIsIm1vZGUiLCJpbnB1dCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwicmVxdWlyZSIsImxpbmsiLCJzY29wZSIsImVsZW1lbnQiLCJhdHRycyIsImNvbnRyb2xsZXJzIiwibmdNb2RlbCIsInBhcnNlciIsIiRwYXJzZXJzIiwicHVzaCIsIiR3YXRjaCIsImxlbmd0aCIsIiRzZXRWaWV3VmFsdWUiLCIkcmVuZGVyIl0sIm1hcHBpbmdzIjoiQ0FBQTtJQUNFO0lBRUFBLFFBQ0dDLE9BQU8sb0JBQ1AsMkJBQ0EsNkJBQ0EsNEJBR0FDLE1BQU07UUFDTkMsVUFBVTtRQUdaQztZQUNHQyxTQUFXO1lBQVVDLFFBQVE7O1lBQzdCRCxTQUFXO1lBQVlDLFFBQVE7O1lBQy9CRCxTQUFXO1lBQWNDLFFBQVE7O1lBQ2pDRCxTQUFXO1lBQVlDLFFBQVE7O1lBQy9CRCxTQUFXO1lBQWNDLFFBQVE7O1lBQ2pDRCxTQUFXO1lBQTJCQyxRQUFROztRQUdqREM7WUFDR0YsU0FBVztZQUFPQyxRQUFNOzs7O0NDeEI5QjtJQUNDO0lBRUFOLFFBQ0VDLE9BQU8scUNBRVBPLFFBQVEsWUFBVyx3QkFBd0IsU0FBVUM7UUFDckQsSUFBSUMsSUFBYyxTQUFVUixHQUFPQztZQUNsQyxLQUFJRCxHQUFPLE9BQU9BO1lBRWxCLElBQUlTLElBQVdULEVBQU1VO1lBRXJCRCxJQUFXQSxFQUFTTixRQUFRLEtBQUtGLElBQVdBLElBQVcsTUFBTU0sRUFBT047WUFFcEUsT0FBT1E7O1FBTVAsSUFBSUUsSUFBWSxTQUFVWCxHQUFPQztZQUMvQixJQUFJVyxJQUFjWixFQUFNVSxZQUN0QkcsSUFBVU4sRUFBT0w7WUFFbkJXLEVBQVFDLFFBQVEsU0FBVUM7Z0JBQ3hCSCxJQUFjQSxFQUFZVCxRQUFRWSxFQUFJWixTQUFTWSxFQUFJWDs7WUFHckRRLElBQWNKLEVBQVlJLEdBQWFYO1lBRXZDLE9BQU9XOztRQU1ULElBQUlJLElBQWMsU0FBVWhCO1lBQzFCLElBQUlpQixJQUFnQmpCLEVBQU1VLFlBQ3hCRyxJQUFVTixFQUFPRjtZQUVuQlEsRUFBUUMsUUFBUSxTQUFVQztnQkFDeEJFLElBQWdCQSxFQUFjZCxRQUFRWSxFQUFJWixTQUFTWSxFQUFJWDs7WUFHekQsT0FBT2E7O1FBR1Y7WUFDQ04sV0FBV0E7WUFDWEssYUFBYUE7Ozs7Q0NqRGpCO0lBQ0M7SUFFQWxCLFFBQ0VDLE9BQU8sMENBRVBtQixPQUFPLGtCQUFpQixVQUFVLFNBQVVDO1FBQzVDLElBQUlDLElBQWEsU0FBVUM7WUFDMUIsUUFBT0E7Y0FDTixLQUFLO2dCQUNKLE9BQU87Z0JBQ1A7O2NBQ0QsS0FBSztnQkFDSixPQUFPO2dCQUNQOzs7UUFJSCxPQUFPLFNBQVVDLEdBQU9EO1lBRXZCLElBQUlBLElBQU9BLElBQU9ELEVBQVdDLEtBQVFELEVBQVc7WUFFaEQsSUFBR0MsTUFBUyxHQUFHO2dCQUNkLE9BQU9GLEVBQU9SLFVBQVVXO21CQUNsQixJQUFJRCxNQUFTLEdBQUc7Z0JBQ3RCLE9BQU9GLEVBQU9ILFlBQVlNOzs7OztDQ3pCL0I7SUFDQztJQUVBeEIsUUFDRUMsT0FBTywrQkFBOEI7O0NDSnhDO0lBQ0M7SUFFQUQsUUFDRUMsT0FBTyw0QkFBMkI7O0NDSnJDO0lBQ0M7SUFFQUQsUUFDRUMsT0FBTywrQ0FFUHdCLFVBQVUsb0JBQW1CLFVBQVUsU0FBVUo7UUFDaEQ7WUFDRUssVUFBVTtZQUNWQyxXQUFVO1lBQ1ZDLE1BQU0sU0FBVUMsR0FBT0MsR0FBU0MsR0FBT0M7Z0JBQ3RDLElBQUlDLElBQVVELEVBQVksSUFDdkI3QixLQUFZNEIsRUFBTTVCLFdBQVcsT0FBTzRCLEVBQU01QjtnQkFLNUMsSUFBSVUsSUFBWSxTQUFVWDtvQkFDeEIsT0FBT21CLEVBQU9SLFVBQVVYLEdBQU9DOztnQkFNakMsSUFBSWUsSUFBYyxTQUFVaEI7b0JBQzFCLE9BQU9tQixFQUFPSCxZQUFZaEI7O2dCQU81QixJQUFJZ0MsSUFBUyxTQUFVaEM7b0JBQ3JCLE9BQU9nQixFQUFZaEI7O2dCQUdyQitCLEVBQVFFLFNBQVNDLEtBQUtGO2dCQU90QkwsRUFBTVEsT0FBT04sRUFBTUUsU0FBUyxTQUFVL0I7b0JBQ3JDLEtBQUlBLEtBQVNBLEVBQU1vQyxTQUFTLEdBQUc7d0JBQUU7O29CQUVoQyxJQUFJeEIsSUFBY0QsRUFBVVg7b0JBRTVCLElBQUdZLEtBQWVaLEdBQU87d0JBQ3ZCK0IsRUFBUU0sY0FBY3pCO3dCQUN0Qm1CLEVBQVFPOzs7Ozs7O0NDbERwQjtJQUNDO0lBRUF4QyxRQUNFQyxPQUFPLDZCQUE0QiIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrJywgW1xuICAgIFx0J25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJyxcbiAgICBcdCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJyxcbiAgICBcdCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJyAgICBcdFxuICAgIF0pXG5cbiAgICAudmFsdWUoJ25nQ3VycmVuY3lNYXNrQ29uZmlnJywge1xuICAgIFx0Y3VycmVuY3k6ICdSJCAnLFxuXG5cdFx0XHQvLyBNYXRjaGVzIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGNvbnRlbnQuXG5cdFx0XHRtYXNrTWF0Y2hlczogW1xuXHRcdFx0XHR7ICdyZXBsYWNlJzogL1teXFxkXS9nLCAnd2l0aCc6IFwiXCIgfSxcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkezJ9KSQvLCAnd2l0aCc6IFwiLCQxXCIgfSxcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8sKFxcZHszLH0pJC8sICd3aXRoJzogJyQxLDAwJyB9LFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oMHsxLH0pLywgJ3dpdGgnOiAnJyB9LFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14sKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAsJDFcIiB9LFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ3dpdGgnOiBcIiQxLlwiIH1cblx0XHRcdF0sXG5cblx0XHRcdHVubWFza01hdGNoZXM6IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9cXEQvZywgd2l0aDogJycgfVxuXHRcdFx0XVxuXHRcdH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svU2VydmljZS9NYXNrZXInLCBbXSlcblxuXHRcdC5mYWN0b3J5KCdNYXNrZXInLCBbJ25nQ3VycmVuY3lNYXNrQ29uZmlnJywgZnVuY3Rpb24gKGNvbmZpZykge1xuXHRcdFx0dmFyIGFkZEN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xuXHRcdFx0XHRpZighdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuXHRcdFx0XHR2YXIgbmV3VmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuXG5cdFx0XHRcdG5ld1ZhbHVlID0gbmV3VmFsdWUucmVwbGFjZSgvXi8sIGN1cnJlbmN5ID8gY3VycmVuY3kgKyAnICcgOiBjb25maWcuY3VycmVuY3kpO1xuXG5cdFx0XHRcdHJldHVybiBuZXdWYWx1ZTtcblx0XHRcdH07XG5cblx0XHQgIC8qKlxuXHRcdCAgICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIGN1cnJlbmN5KSB7XG5cdFx0ICAgIHZhciBtYXNrZWRWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCksXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gY29uZmlnLm1hc2tNYXRjaGVzO1xuXHRcdCAgICBcblx0XHQgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgICBtYXNrZWRWYWx1ZSA9IG1hc2tlZFZhbHVlLnJlcGxhY2Uoa2V5LnJlcGxhY2UsIGtleS53aXRoKTtcblx0XHQgICAgfSk7XG5cblx0XHQgICAgbWFza2VkVmFsdWUgPSBhZGRDdXJyZW5jeShtYXNrZWRWYWx1ZSwgY3VycmVuY3kpO1xuXG5cdFx0ICAgIHJldHVybiBtYXNrZWRWYWx1ZTtcblx0XHQgIH07XG5cdFx0ICBcblx0XHQgIC8qKlxuXHRcdCAgICogUmV0dXJuIEB2YWx1ZSB0byBpdCByZWFsIHZhbHVlLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgdmFyIHVubWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGNvbmZpZy51bm1hc2tNYXRjaGVzO1xuXHRcdCAgICBcblx0XHQgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgICB1bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIH0pO1xuXHRcdCAgICBcblx0XHQgICAgcmV0dXJuIHVubWFza2VkVmFsdWU7XG5cdFx0ICB9O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRtYXNrVmFsdWU6IG1hc2tWYWx1ZSxcblx0XHRcdFx0dW5tYXNrVmFsdWU6IHVubWFza1ZhbHVlXG5cdFx0XHR9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9GaWx0ZXIvY3VycmVuY3lNYXNrJywgW10pXG5cblx0XHQuZmlsdGVyKCdjdXJyZW5jeU1hc2snLCBbJ01hc2tlcicsIGZ1bmN0aW9uIChNYXNrZXIpIHtcblx0XHRcdHZhciBkaWdlc3RNb2RlID0gZnVuY3Rpb24gKG1vZGUpIHtcblx0XHRcdFx0c3dpdGNoKG1vZGUpIHtcblx0XHRcdFx0XHRjYXNlICdtYXNrJzpcblx0XHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAndW5tYXNrJzpcblx0XHRcdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIG1vZGUpIHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgbm8gJ21vZGUnIGRlZmluZWQuIE1hc2sgdGhlIGlucHV0LlxuXHRcdFx0XHR2YXIgbW9kZSA9IG1vZGUgPyBkaWdlc3RNb2RlKG1vZGUpIDogZGlnZXN0TW9kZSgnbWFzaycpO1xuXG5cdFx0XHRcdGlmKG1vZGUgPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gTWFza2VyLm1hc2tWYWx1ZShpbnB1dCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gMikge1xuXHRcdFx0XHRcdHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUoaW5wdXQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlcycsIFsnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJ10pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLCBbJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJywgW10pXG5cblx0XHQuZGlyZWN0aXZlKCduZ0N1cnJlbmN5TWFzaycsIFsnTWFza2VyJywgZnVuY3Rpb24gKE1hc2tlcikge1xuXHRcdCAgcmV0dXJuIHtcblx0XHQgICAgcmVzdHJpY3Q6ICdBJyxcblx0XHQgICAgcmVxdWlyZTogWyc/bmdNb2RlbCddLFxuXHRcdCAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykge1xuXHRcdCAgICBcdHZhciBuZ01vZGVsID0gY29udHJvbGxlcnNbMF0sXG5cdFx0ICAgICAgXHRcdGN1cnJlbmN5ID0gIWF0dHJzLmN1cnJlbmN5ID8gbnVsbCA6IGF0dHJzLmN1cnJlbmN5O1xuXG5cdFx0ICAgIFx0LyoqXG5cdFx0ICAgIFx0ICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0ICAgIFx0ICovXG5cdFx0ICAgICAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIE1hc2tlci5tYXNrVmFsdWUodmFsdWUsIGN1cnJlbmN5KTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgIH07XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcblx0XHQgICAgICAgKiBiZWZvcmUgdGhlIGdvZXMgdG8gRE9NLiBUaGF0IGlzIHRoZSByZWFsIG5nTW9kZWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIHVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXG5cdFx0ICAgICAgbmdNb2RlbC4kcGFyc2Vycy5wdXNoKHBhcnNlcik7XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogRXZlcnl0aW1lIHRoZSBpbnB1dCBzdWZmZXIgYSBjaGFuZ2UsXG5cdFx0ICAgICAgICogdGhlIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdCBhbmQgbWFza1xuXHRcdCAgICAgICAqIGFsbCB0aGUgdHlwZWQgY29udGVudC5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgXHRpZighdmFsdWUgfHwgdmFsdWUubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cblxuXHRcdCAgICAgICAgdmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICAgIFxuXHRcdCAgICAgICAgaWYobWFza2VkVmFsdWUgIT0gdmFsdWUpIHtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgfSk7XG5cdFx0ICAgIH1cblx0XHQgIH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJywgWyduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlciddKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9