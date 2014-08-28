(function() {
    "use strict";
    angular.module("ngCurrencyMask", [ "ngCurrencyMask/Services", "ngCurrencyMask/Directives", "ngCurrencyMask/Filters", "ngCurrencyMask/Providers" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Service/Masker", []).factory("Masker", [ "$currencyMask", function(r) {
        var n = function(n, a) {
            if (!n) return n;
            var e = n.toString();
            e = e.replace(/^/, (a ? a : r.currency) + " ");
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
        var n = function(r) {
            switch (r) {
              case "mask":
                return 1;
                break;

              case "unmask":
                return 2;
                break;
            }
        };
        var e = function(r) {
            if (r === null) {
                return null;
            } else {
                return r;
            }
        };
        return function(u, a, t) {
            var a = a ? n(a) : n("mask"), s = t ? e(t) : e(null);
            if (a === 1) {
                var c = r.maskValue(u, s);
                return c;
            } else if (a === 2) {
                return r.unmaskValue(u);
            }
        };
    } ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Provider/currencyMask", []).provider("$currencyMask", function() {
        var e = this, r = {
            currency: "R$",
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
        };
        this.setCurrency = function(t) {
            r.currency = t;
            return e;
        };
        this.addUnmaskMatch = function(t, c) {
            r.unmaskMatches.unshift({
                replace: t,
                "with": c
            });
            return e;
        };
        this.addMaskMatch = function(t, c) {
            r.maskMatches.unshift({
                replace: t,
                "with": c
            });
            return e;
        };
        this.$get = function() {
            var e;
            angular.copy(r, e);
            return r;
        };
    });
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
    angular.module("ngCurrencyMask/Providers", [ "ngCurrencyMask/Provider/currencyMask" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Services", [ "ngCurrencyMask/Service/Masker" ]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHNcXE1hc2tlci1TZXJ2aWNlLmpzIiwiY29tcG9uZW50c1xcY3VycmVuY3lNYXNrLUZpbHRlci5qcyIsImNvbXBvbmVudHNcXGN1cnJlbmN5TWFzay1Qcm92aWRlci5qcyIsImNvbXBvbmVudHNcXGRpcmVjdGl2ZXMuanMiLCJjb21wb25lbnRzXFxmaWx0ZXJzLmpzIiwiY29tcG9uZW50c1xcbmdDdXJyZW5jeU1hc2stRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50c1xccHJvdmlkZXJzLmpzIiwiY29tcG9uZW50c1xcc2VydmljZXMuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImZhY3RvcnkiLCJkZWZhdWx0cyIsImFkZEN1cnJlbmN5IiwidmFsdWUiLCJjdXJyZW5jeSIsIm5ld1ZhbHVlIiwidG9TdHJpbmciLCJyZXBsYWNlIiwibWFza1ZhbHVlIiwibWFza2VkVmFsdWUiLCJtYXRjaGVzIiwibWFza01hdGNoZXMiLCJmb3JFYWNoIiwia2V5Iiwid2l0aCIsInVubWFza1ZhbHVlIiwidW5tYXNrZWRWYWx1ZSIsInVubWFza01hdGNoZXMiLCJmaWx0ZXIiLCJNYXNrZXIiLCJkaWdlc3RNb2RlIiwibW9kZSIsImRpZ2VzdEN1cnJlbmN5IiwiaW5wdXQiLCJkaWdlc3RlZEN1cnJlbmN5IiwicHJvdmlkZXIiLCIkc2VsZiIsInRoaXMiLCIkY3VycmVuY3lNYXNrIiwic2V0Q3VycmVuY3kiLCJhZGRVbm1hc2tNYXRjaCIsInVuc2hpZnQiLCJhZGRNYXNrTWF0Y2giLCIkZ2V0IiwiY3VycmVuY3lNYXNrIiwiY29weSIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwicmVxdWlyZSIsImxpbmsiLCJzY29wZSIsImVsZW1lbnQiLCJhdHRycyIsImNvbnRyb2xsZXJzIiwibmdNb2RlbCIsInBhcnNlciIsIiRwYXJzZXJzIiwicHVzaCIsIiR3YXRjaCIsImxlbmd0aCIsIiRzZXRWaWV3VmFsdWUiLCIkcmVuZGVyIl0sIm1h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QUFtQixVQUFVLFNBQVVqQjtRQUNoRDtZQUNFa0IsVUFBVTtZQUNWQyxXQUFVO1lBQ1ZDLE1BQU0sU0FBVUMsR0FBT0MsR0FBU0MsR0FBT0M7Z0JBQ3RDLElBQUlDLElBQVVELEVBQVksSUFDdkJ2QyxLQUFZc0MsRUFBTXRDLFdBQVcsT0FBT3NDLEVBQU10QztnQkFLNUMsSUFBSUksSUFBWSxTQUFVTDtvQkFDeEIsT0FBT2dCLEVBQU9YLFVBQVVMLEdBQU9DOztnQkFNakMsSUFBSVcsSUFBYyxTQUFVWjtvQkFDMUIsT0FBT2dCLEVBQU9KLFlBQVlaOztnQkFPNUIsSUFBSTBDLElBQVMsU0FBVTFDO29CQUNyQixPQUFPWSxFQUFZWjs7Z0JBR3JCeUMsRUFBUUUsU0FBU0MsS0FBS0Y7Z0JBT3RCTCxFQUFNUSxPQUFPTixFQUFNRSxTQUFTLFNBQVV6QztvQkFDckMsS0FBSUEsS0FBU0EsRUFBTThDLFNBQVMsR0FBRzt3QkFBRTs7b0JBRWhDLElBQUl4QyxJQUFjRCxFQUFVTDtvQkFFNUIsSUFBR00sS0FBZU4sR0FBTzt3QkFDdkJ5QyxFQUFRTSxjQUFjekM7d0JBQ3RCbUMsRUFBUU87Ozs7Ozs7Q0NsRHBCO0lBQ0M7SUFFQXJELFFBQ0VDLE9BQU8sOEJBQ1A7O0NDTEg7SUFDQztJQUVBRCxRQUNFQyxPQUFPLDZCQUE0QiIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblx0XHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2snLCBbXHJcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlcycsXHJcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJyxcclxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLFxyXG5cdFx0XHQnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXJzJ1xyXG5cdFx0XSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlcicsIFtdKVxyXG5cclxuXHRcdC5mYWN0b3J5KCdNYXNrZXInLCBbJyRjdXJyZW5jeU1hc2snLCBmdW5jdGlvbiAoZGVmYXVsdHMpIHtcclxuXHRcdFx0dmFyIGFkZEN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xyXG5cdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xyXG5cclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBDb252ZXJ0cyBAdmFsdWUgdG8gYSBTdHJpbmcgaW5zdGFuY2UsIGZvciBOdW1iZXJcclxuXHRcdFx0XHQgKiBpbnN0YW5jZXMgZG9lc24ndCBoYXZlIC5yZXBsYWNlKCkgcHJvdG90eXBlLlxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdHZhciBuZXdWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcblxyXG5cdFx0XHRcdC8vIEltcGxlbWVudHMgdGhlIGN1cnJlbmN5IGF0IEBuZXdWYWx1ZVxyXG5cdFx0XHRcdG5ld1ZhbHVlID0gbmV3VmFsdWUucmVwbGFjZSgvXi8sIChjdXJyZW5jeSA/IGN1cnJlbmN5IDogZGVmYXVsdHMuY3VycmVuY3kpICsgJyAnKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIG5ld1ZhbHVlO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdCAgLyoqXHJcblx0XHQgICAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxyXG5cdFx0ICAgKi9cclxuXHRcdCAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVuY3kpIHtcclxuXHRcdCAgICB2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxyXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gZGVmYXVsdHMubWFza01hdGNoZXM7XHJcblx0XHQgICAgXHJcblx0XHQgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdCAgICAgIG1hc2tlZFZhbHVlID0gbWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xyXG5cdFx0ICAgIH0pO1xyXG5cclxuXHRcdCAgICBtYXNrZWRWYWx1ZSA9IGFkZEN1cnJlbmN5KG1hc2tlZFZhbHVlLCBjdXJyZW5jeSk7XHJcblxyXG5cdFx0ICAgIHJldHVybiBtYXNrZWRWYWx1ZTtcclxuXHRcdCAgfTtcclxuXHRcdCAgXHJcblx0XHQgIC8qKlxyXG5cdFx0ICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXHJcblx0XHQgICAqL1xyXG5cdFx0ICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdCAgICB2YXIgdW5tYXNrZWRWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCksXHJcblx0XHQgICAgXHRcdG1hdGNoZXMgPSBkZWZhdWx0cy51bm1hc2tNYXRjaGVzO1xyXG5cdFx0ICAgIFxyXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHQgICAgICB1bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XHJcblx0XHQgICAgfSk7XHJcblx0XHQgICAgXHJcblx0XHQgICAgcmV0dXJuIHVubWFza2VkVmFsdWU7XHJcblx0XHQgIH07XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG1hc2tWYWx1ZTogbWFza1ZhbHVlLFxyXG5cdFx0XHRcdHVubWFza1ZhbHVlOiB1bm1hc2tWYWx1ZVxyXG5cdFx0XHR9O1xyXG5cdFx0fV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9GaWx0ZXIvY3VycmVuY3lNYXNrJywgW10pXHJcblxyXG5cdFx0LmZpbHRlcignY3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XHJcblx0XHRcdHZhciBkaWdlc3RNb2RlID0gZnVuY3Rpb24gKG1vZGUpIHtcclxuXHRcdFx0XHRzd2l0Y2gobW9kZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAnbWFzayc6XHJcblx0XHRcdFx0XHRcdHJldHVybiAxO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3VubWFzayc6XHJcblx0XHRcdFx0XHRcdHJldHVybiAyO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR2YXIgZGlnZXN0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcclxuXHRcdFx0XHRpZihjdXJyZW5jeSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBjdXJyZW5jeTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSwgY3VycmVuY3kpIHtcclxuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXHJcblx0XHRcdFx0dmFyIG1vZGUgPSBtb2RlID8gZGlnZXN0TW9kZShtb2RlKSA6IGRpZ2VzdE1vZGUoJ21hc2snKSxcclxuXHRcdFx0XHRkaWdlc3RlZEN1cnJlbmN5ID0gY3VycmVuY3kgPyBkaWdlc3RDdXJyZW5jeShjdXJyZW5jeSkgOiBkaWdlc3RDdXJyZW5jeShudWxsKTtcclxuXHJcblx0XHRcdFx0aWYobW9kZSA9PT0gMSkge1xyXG5cdFx0XHRcdFx0dmFyIG1hc2tlZFZhbHVlID0gTWFza2VyLm1hc2tWYWx1ZShpbnB1dCwgZGlnZXN0ZWRDdXJyZW5jeSk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIG1hc2tlZFZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gMikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fTtcclxuXHRcdH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXIvY3VycmVuY3lNYXNrJywgW10pXHJcblxyXG5cdFx0LnByb3ZpZGVyKCckY3VycmVuY3lNYXNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgJHNlbGYgPSB0aGlzLFxyXG5cdFx0XHQkY3VycmVuY3lNYXNrID0ge1xyXG5cdFx0XHRcdGN1cnJlbmN5OiAnUiQnLFxyXG5cclxuXHRcdFx0XHQvLyBNYXRjaGVzIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGNvbnRlbnQuXHJcblx0XHRcdFx0bWFza01hdGNoZXM6IFtcclxuXHRcdFx0XHRcdHsgJ3JlcGxhY2UnOiAvW15cXGRdL2csICd3aXRoJzogXCJcIiB9LFxyXG5cdFx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkezJ9KSQvLCAnd2l0aCc6IFwiLCQxXCIgfSxcclxuXHRcdFx0XHRcdHsgJ3JlcGxhY2UnOiAvLChcXGR7Myx9KSQvLCAnd2l0aCc6ICckMSwwMCcgfSxcclxuXHRcdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXigwezEsfSkvLCAnd2l0aCc6ICcnIH0sXHJcblx0XHRcdFx0XHR7ICdyZXBsYWNlJzogL14sKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAsJDFcIiB9LFxyXG5cdFx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICd3aXRoJzogXCIkMS5cIiB9XHJcblx0XHRcdFx0XSxcclxuXHJcblx0XHRcdFx0dW5tYXNrTWF0Y2hlczogW1xyXG5cdFx0XHRcdFx0eyAncmVwbGFjZSc6IC9cXEQvZywgJ3dpdGgnOiAnJyB9XHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy5zZXRDdXJyZW5jeSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkge1xyXG5cdFx0XHRcdCRjdXJyZW5jeU1hc2suY3VycmVuY3kgPSBjdXJyZW5jeTtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRzZWxmO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIEFkZCBhIG5ldyBtYXRjaCB0YXNrIHRvICRjdXJyZW5jeU1hc2sudW5tYXNrTWF0Y2hlcy5cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuYWRkVW5tYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcclxuXHRcdFx0XHQkY3VycmVuY3lNYXNrLnVubWFza01hdGNoZXMudW5zaGlmdCh7XHJcblx0XHRcdFx0XHQncmVwbGFjZSc6IHJlcGxhY2UsXHJcblx0XHRcdFx0XHQnd2l0aCc6IHZhbHVlXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkc2VsZjtcclxuXHRcdFx0fTtcdFx0XHRcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBBZGQgYSBuZXcgbWF0Y2ggdGFzayB0byAkY3VycmVuY3lNYXNrLm1hc2tNYXRjaGVzLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5hZGRNYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcclxuXHRcdFx0XHQkY3VycmVuY3lNYXNrLm1hc2tNYXRjaGVzLnVuc2hpZnQoe1xyXG5cdFx0XHRcdFx0J3JlcGxhY2UnOiByZXBsYWNlLFxyXG5cdFx0XHRcdFx0J3dpdGgnOiB2YWx1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJHNlbGY7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIGN1cnJlbmN5TWFzaztcclxuXHJcblx0XHRcdFx0YW5ndWxhci5jb3B5KCRjdXJyZW5jeU1hc2ssIGN1cnJlbmN5TWFzayk7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkY3VycmVuY3lNYXNrO1xyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHRcdFxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJywgWyduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmUvbmdDdXJyZW5jeU1hc2snXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLCBbJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZS9uZ0N1cnJlbmN5TWFzaycsIFtdKVxyXG5cclxuXHRcdC5kaXJlY3RpdmUoJ25nQ3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XHJcblx0XHQgIHJldHVybiB7XHJcblx0XHQgICAgcmVzdHJpY3Q6ICdBJyxcclxuXHRcdCAgICByZXF1aXJlOiBbJz9uZ01vZGVsJ10sXHJcblx0XHQgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcclxuXHRcdCAgICBcdHZhciBuZ01vZGVsID0gY29udHJvbGxlcnNbMF0sXHJcblx0XHQgICAgICBcdFx0Y3VycmVuY3kgPSAhYXR0cnMuY3VycmVuY3kgPyBudWxsIDogYXR0cnMuY3VycmVuY3k7XHJcblxyXG5cdFx0ICAgIFx0LyoqXHJcblx0XHQgICAgXHQgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cclxuXHRcdCAgICBcdCAqL1xyXG5cdFx0ICAgICAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0ICAgICAgICByZXR1cm4gTWFza2VyLm1hc2tWYWx1ZSh2YWx1ZSwgY3VycmVuY3kpO1xyXG5cdFx0ICAgICAgfTtcclxuXHRcdCAgICAgIFxyXG5cdFx0ICAgICAgLyoqXHJcblx0XHQgICAgICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXHJcblx0XHQgICAgICAgKi9cclxuXHRcdCAgICAgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0ICAgICAgICByZXR1cm4gTWFza2VyLnVubWFza1ZhbHVlKHZhbHVlKTtcclxuXHRcdCAgICAgIH07XHJcblx0XHQgICAgICBcclxuXHRcdCAgICAgIC8qKlxyXG5cdFx0ICAgICAgICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcclxuXHRcdCAgICAgICAqIGJlZm9yZSB0aGUgZ29lcyB0byBET00uIFRoYXQgaXMgdGhlIHJlYWwgbmdNb2RlbCB2YWx1ZS5cclxuXHRcdCAgICAgICAqL1xyXG5cdFx0ICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0ICAgICAgICByZXR1cm4gdW5tYXNrVmFsdWUodmFsdWUpO1xyXG5cdFx0ICAgICAgfTtcclxuXHJcblx0XHQgICAgICBuZ01vZGVsLiRwYXJzZXJzLnB1c2gocGFyc2VyKTtcclxuXHRcdCAgICAgIFxyXG5cdFx0ICAgICAgLyoqXHJcblx0XHQgICAgICAgKiBFdmVyeXRpbWUgdGhlIGlucHV0IHN1ZmZlciBhIGNoYW5nZSxcclxuXHRcdCAgICAgICAqIHRoZSBkaXJlY3RpdmUgd2lsbCB1cGRhdGUgaXQgYW5kIG1hc2tcclxuXHRcdCAgICAgICAqIGFsbCB0aGUgdHlwZWQgY29udGVudC5cclxuXHRcdCAgICAgICAqL1xyXG5cdFx0ICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0ICAgICAgXHRpZighdmFsdWUgfHwgdmFsdWUubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cclxuXHJcblx0XHQgICAgICAgIHZhciBtYXNrZWRWYWx1ZSA9IG1hc2tWYWx1ZSh2YWx1ZSk7XHJcblx0XHQgICAgICAgIFxyXG5cdFx0ICAgICAgICBpZihtYXNrZWRWYWx1ZSAhPSB2YWx1ZSkge1xyXG5cdFx0ICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShtYXNrZWRWYWx1ZSk7XHJcblx0XHQgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICAgIH0pO1xyXG5cdFx0ICAgIH1cclxuXHRcdCAgfTtcclxuXHRcdH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXJzJywgW1xyXG5cdFx0XHQnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXIvY3VycmVuY3lNYXNrJ1xyXG5cdFx0XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJywgWyduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlciddKTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=