(function() {
    "use strict";
    angular.module("ngCurrencyMask", [ "ngCurrencyMask/Services", "ngCurrencyMask/Directives", "ngCurrencyMask/Filters", "ngCurrencyMask/Providers" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Service/Masker", []).factory("Masker", [ "$currencyMask", function(e) {
        var r = function(r, n) {
            if (!r) return r;
            var a = r.toString();
            a = a.replace(/^/, (n ? n : e.currency) + " ");
            return a;
        };
        var n = function(n, a) {
            var c = n.toString(), t = e.maskMatches;
            t.forEach(function(e) {
                if (e.replace instanceof Function) {
                    c = e.replace(c);
                } else {
                    c = c.replace(e.replace, e.with);
                }
            });
            c = r(c, a);
            return c;
        };
        var a = function(r) {
            var n = r.toString(), a = e.unmaskMatches;
            a.forEach(function(e) {
                if (e.replace instanceof Function) {
                    n = e.replace(n);
                } else {
                    n = n.replace(e.replace, e.with);
                }
            });
            return n;
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
        var e = [ {
            replace: /(\.[0-9])(?=[0-9]{0}$)/g,
            "with": "$10"
        }, {
            replace: /^(\d)*(?=(\d{0,})$)/g,
            "with": "$&,00"
        }, {
            replace: /\D/g,
            "with": ""
        }, {
            replace: /^(\d{1})$/,
            "with": "0,0$1"
        }, {
            replace: /(\d{2})$/,
            "with": ",$1"
        }, {
            replace: /,(\d{3,})$/,
            "with": "$1,00"
        }, {
            replace: /^,(\d{2})$/,
            "with": "0,$1"
        }, {
            replace: /(\d)(?=(\d{3})+(?!\d))/g,
            "with": "$1."
        } ], r = [ {
            replace: /\D/g,
            "with": ""
        }, {
            replace: /^(\d{1})$/,
            "with": "0.0$1"
        }, {
            replace: /(\d{2})$/,
            "with": ".$1"
        }, {
            replace: /(,00|\.00$)/g,
            "with": ""
        }, {
            replace: /^(0{1,})/,
            "with": ""
        }, {
            replace: /^\.(\d{2})$/,
            "with": "0.$1"
        }, {
            replace: function(e) {
                if (!e) return "";
                var r = new RegExp(".(d{3,})$"), t = e.match(r);
                if (t instanceof Array && t[1]) {
                    e = e.replace(t, t.toString().substr(0, 2));
                }
                return e;
            }
        } ];
        var t = this, a = {
            currency: "R$",
            maskMatches: e,
            unmaskMatches: r
        };
        this.setCurrency = function(e) {
            a.currency = e;
            return t;
        };
        this.addUnmaskMatch = function(e, r) {
            a.unmaskMatches.unshift({
                replace: e,
                "with": r
            });
            return t;
        };
        this.addMaskMatch = function(e, r) {
            var c = {};
            if (!r) {
                c.replace = e;
            } else {
                c.replace = e;
                c.with = r;
            }
            a.maskMatches.unshift(c);
            return t;
        };
        this.$get = function() {
            return a;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1Qcm92aWRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbmdDdXJyZW5jeU1hc2stRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9wcm92aWRlcnMuanMiLCJjb21wb25lbnRzL3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJmYWN0b3J5IiwiZGVmYXVsdHMiLCJhZGRDdXJyZW5jeSIsInZhbHVlIiwiY3VycmVuY3kiLCJuZXdWYWx1ZSIsInRvU3RyaW5nIiwicmVwbGFjZSIsIm1hc2tWYWx1ZSIsIm1hc2tlZFZhbHVlIiwibWF0Y2hlcyIsIm1hc2tNYXRjaGVzIiwiZm9yRWFjaCIsImtleSIsIkZ1bmN0aW9uIiwid2l0aCIsInVubWFza1ZhbHVlIiwidW5tYXNrZWRWYWx1ZSIsInVubWFza01hdGNoZXMiLCJmaWx0ZXIiLCJNYXNrZXIiLCJkaWdlc3RNb2RlIiwibW9kZSIsImRpZ2VzdEN1cnJlbmN5IiwiaW5wdXQiLCJkaWdlc3RlZEN1cnJlbmN5IiwicHJvdmlkZXIiLCJyZWdleCIsIlJlZ0V4cCIsIm1hdGNoIiwiQXJyYXkiLCJzdWJzdHIiLCIkc2VsZiIsInRoaXMiLCIkY3VycmVuY3lNYXNrIiwic2V0Q3VycmVuY3kiLCJhZGRVbm1hc2tNYXRjaCIsInVuc2hpZnQiLCJhZGRNYXNrTWF0Y2giLCIkZ2V0IiwiZGlyZWN0aXZlIiwicmVzdHJpY3QiLCJyZXF1aXJlIiwibGluayIsInNjb3BlIiwiZWxlbWVudCIsImF0dHJzIiwiY29udHJvbGxlcnMiLCJuZ01vZGVsIiwicGFyc2VyIiwiJHBhcnNlcnMiLCJwdXNoIiwiJHdhdGNoIiwibGVuZ3RoIiwiJHNldFZp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RUFBUUUsU0FBU0MsS0FBS0Y7Z0JBT3RCTCxFQUFNUSxPQUFPTixFQUFNRSxTQUFTLFNBQVU3QztvQkFDckMsS0FBSUEsS0FBU0EsRUFBTWtELFNBQVMsR0FBRzt3QkFBRTs7b0JBRWhDLElBQUk1QyxJQUFjRCxFQUFVTDtvQkFFNUIsSUFBR00sS0FBZU4sR0FBTzt3QkFDdkI2QyxFQUFRTSxjQUFjN0M7d0JBQ3RCdUMsRUFBUU87Ozs7Ozs7Q0NsRHBCO0lBQ0M7SUFFQXpELFFBQ0VDLE9BQU8sOEJBQ1A7O0NDTEg7SUFDQztJQUVBRCxRQUNFQyxPQUFPLDZCQUE0QiIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrJywgW1xuXHRcdFx0J25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmVzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJyxcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlcnMnXG5cdFx0XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlcicsIFtdKVxuXG5cdFx0LmZhY3RvcnkoJ01hc2tlcicsIFsnJGN1cnJlbmN5TWFzaycsIGZ1bmN0aW9uIChkZWZhdWx0cykge1xuXHRcdFx0dmFyIGFkZEN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xuXHRcdFx0XHRpZighdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogQ29udmVydHMgQHZhbHVlIHRvIGEgU3RyaW5nIGluc3RhbmNlLCBmb3IgTnVtYmVyXG5cdFx0XHRcdCAqIGluc3RhbmNlcyBkb2Vzbid0IGhhdmUgLnJlcGxhY2UoKSBwcm90b3R5cGUuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR2YXIgbmV3VmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuXG5cdFx0XHRcdC8vIEltcGxlbWVudHMgdGhlIGN1cnJlbmN5IGF0IEBuZXdWYWx1ZVxuXHRcdFx0XHRuZXdWYWx1ZSA9IG5ld1ZhbHVlLnJlcGxhY2UoL14vLCAoY3VycmVuY3kgPyBjdXJyZW5jeSA6IGRlZmF1bHRzLmN1cnJlbmN5KSArICcgJyk7XG5cblx0XHRcdFx0cmV0dXJuIG5ld1ZhbHVlO1xuXHRcdFx0fTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cblx0XHQgICAqL1xuXHRcdCAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVuY3kpIHtcblx0XHQgICAgdmFyIG1hc2tlZFZhbHVlID0gdmFsdWUudG9TdHJpbmcoKSxcblx0XHQgICAgXHRcdG1hdGNoZXMgPSBkZWZhdWx0cy5tYXNrTWF0Y2hlcztcblx0XHQgICAgXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgIFx0aWYoa2V5LnJlcGxhY2UgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdCAgICBcdFx0bWFza2VkVmFsdWUgPSBrZXkucmVwbGFjZShtYXNrZWRWYWx1ZSk7XG5cdFx0ICAgIFx0fSBlbHNlIHtcblx0XHQgICAgICBcdG1hc2tlZFZhbHVlID0gbWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xuXHRcdCAgICBcdH1cblx0XHQgICAgfSk7XG5cblx0XHQgICAgbWFza2VkVmFsdWUgPSBhZGRDdXJyZW5jeShtYXNrZWRWYWx1ZSwgY3VycmVuY3kpO1xuXG5cdFx0ICAgIHJldHVybiBtYXNrZWRWYWx1ZTtcblx0XHQgIH07XG5cdFx0ICBcblx0XHQgIC8qKlxuXHRcdCAgICogUmV0dXJuIEB2YWx1ZSB0byBpdCByZWFsIHZhbHVlLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgdmFyIHVubWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGRlZmF1bHRzLnVubWFza01hdGNoZXM7XG5cdFx0ICAgIFxuXHRcdCAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdCAgICBcdGlmKGtleS5yZXBsYWNlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcblx0XHQgICAgXHRcdHVubWFza2VkVmFsdWUgPSBrZXkucmVwbGFjZSh1bm1hc2tlZFZhbHVlKTtcblx0XHQgICAgXHR9IGVsc2Uge1xuXHRcdCAgICAgIFx0dW5tYXNrZWRWYWx1ZSA9IHVubWFza2VkVmFsdWUucmVwbGFjZShrZXkucmVwbGFjZSwga2V5LndpdGgpO1xuXHRcdCAgICBcdH1cblx0XHQgICAgfSk7XG5cdFx0ICAgIFxuXHRcdCAgICByZXR1cm4gdW5tYXNrZWRWYWx1ZTtcblx0XHQgIH07XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG1hc2tWYWx1ZTogbWFza1ZhbHVlLFxuXHRcdFx0XHR1bm1hc2tWYWx1ZTogdW5tYXNrVmFsdWVcblx0XHRcdH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5maWx0ZXIoJ2N1cnJlbmN5TWFzaycsIFsnTWFza2VyJywgZnVuY3Rpb24gKE1hc2tlcikge1xuXHRcdFx0dmFyIGRpZ2VzdE1vZGUgPSBmdW5jdGlvbiAobW9kZSkge1xuXHRcdFx0XHRzd2l0Y2gobW9kZSkge1xuXHRcdFx0XHRcdGNhc2UgJ21hc2snOlxuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICd1bm1hc2snOlxuXHRcdFx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dmFyIGRpZ2VzdEN1cnJlbmN5ID0gZnVuY3Rpb24gKGN1cnJlbmN5KSB7XG5cdFx0XHRcdGlmKGN1cnJlbmN5ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGN1cnJlbmN5O1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgbW9kZSwgY3VycmVuY3kpIHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgbm8gJ21vZGUnIGRlZmluZWQuIE1hc2sgdGhlIGlucHV0LlxuXHRcdFx0XHR2YXIgbW9kZSA9IG1vZGUgPyBkaWdlc3RNb2RlKG1vZGUpIDogZGlnZXN0TW9kZSgnbWFzaycpLFxuXHRcdFx0XHRkaWdlc3RlZEN1cnJlbmN5ID0gY3VycmVuY3kgPyBkaWdlc3RDdXJyZW5jeShjdXJyZW5jeSkgOiBkaWdlc3RDdXJyZW5jeShudWxsKTtcblxuXHRcdFx0XHRpZihtb2RlID09PSAxKSB7XG5cdFx0XHRcdFx0dmFyIG1hc2tlZFZhbHVlID0gTWFza2VyLm1hc2tWYWx1ZShpbnB1dCwgZGlnZXN0ZWRDdXJyZW5jeSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gbWFza2VkVmFsdWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gMikge1xuXHRcdFx0XHRcdHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUoaW5wdXQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXIvY3VycmVuY3lNYXNrJywgW10pXG5cblx0XHQucHJvdmlkZXIoJyRjdXJyZW5jeU1hc2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgbWFza01hdGNoZXMgPSBbXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcLlswLTldKSg/PVswLTldezB9JCkvZywgJ3dpdGgnOiAnJDEwJyB9LCAvLyBDb252ZXJ0cyBYWFhYLlggdG8gWFhYWC5YMFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oXFxkKSooPz0oXFxkezAsfSkkKS9nLCAnd2l0aCc6ICckJiwwMCcgfSwgLy8gQ29udmVydHMgWFhYWCB0byBYWFhYLDAwXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXFxEL2csICd3aXRoJzogXCJcIiB9LCAvLyBDb252ZXJ0cyBhbGwgbm9uLWRpZ2l0IG51bWJlcnMgdG8gJydcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZHsxfSkkLywgJ3dpdGgnOiAnMCwwJDEnIH0sIC8vIENvbnZlcnRzIFggdG8gMCwwWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJywkMSd9LCAvLyBDb252ZXJ0cyBYWCB0byAwLFhYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvLChcXGR7Myx9KSQvLCAnd2l0aCc6ICckMSwwMCcgfSwgLy8gQ29udmVydHMgWCxYWFggdG8gWCxYWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14sKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAsJDFcIiB9LCAvLyBDb252ZXJ0cyAsWFggdG8gMCxYWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJ3dpdGgnOiBcIiQxLlwiIH0gLy8gQ29udmVydHMgWFhYWFhYIHRvIFhYWC5YWFhcblx0XHRcdF0sXG5cblx0XHRcdHVubWFza01hdGNoZXMgPSBbXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXFxEL2csICd3aXRoJzogXCJcIiB9LCAvLyBDb252ZXJ0cyAgYWxsIG5vbi1kaWdpdCBudW1iZXJzIHRvICcnXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGR7MX0pJC8sICd3aXRoJzogJzAuMCQxJyB9LCAvLyBDb252ZXJ0cyBYIHRvIFguMFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkezJ9KSQvLCAnd2l0aCc6ICcuJDEnfSwgLy8gQ29udmVydHMgWFggdG8gLlhYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKCwwMHxcXC4wMCQpL2csICd3aXRoJzogJycgfSwgLy8gQ29udmVydHMgYWxsICxYWCBhbmQgLlhYIHRvIG5vdGhpbmdcdFx0XHRcdFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oMHsxLH0pLywgJ3dpdGgnOiAnJyB9LCAvLyBDb252ZXJ0cyB6ZXJvcyBhdCB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZyB0byBub3RoaW5nXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXlxcLihcXGR7Mn0pJC8sICd3aXRoJzogXCIwLiQxXCIgfSwgLy8gQ29udmVydHMgLlhYIHRvIDAuWFhcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogQ2xlYW4gdGhlIGVuZCBvZiB0aGUgc3RyaW5nIGZyb21cblx0XHRcdFx0ICogdW5zaWduaWZpY2FudCBudW1iZXJzIGNvbnZlcnRpbmdcblx0XHRcdFx0ICogWFhYLjMwWFhYWCB0byBYWFguMzBcblx0XHRcdFx0ICovXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuICcnO1xuXG5cdFx0XHRcdFx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdcXC4oXFxkezMsfSkkJyksXG5cdFx0XHRcdFx0XHRtYXRjaCA9IHZhbHVlLm1hdGNoKHJlZ2V4KTtcblxuXHRcdFx0XHRcdFx0aWYobWF0Y2ggaW5zdGFuY2VvZiBBcnJheSAmJiBtYXRjaFsxXSkge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UobWF0Y2gsIG1hdGNoLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XTtcblxuXHRcdFx0dmFyICRzZWxmID0gdGhpcyxcblx0XHRcdCRjdXJyZW5jeU1hc2sgPSB7XG5cdFx0XHRcdGN1cnJlbmN5OiAnUiQnLFxuXG5cdFx0XHRcdC8vIE1hdGNoZXMgd2hvIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgaW5wdXQgY29udGVudC5cblx0XHRcdFx0bWFza01hdGNoZXM6IG1hc2tNYXRjaGVzLFxuXG5cdFx0XHRcdHVubWFza01hdGNoZXM6IHVubWFza01hdGNoZXNcblx0XHRcdH07XG5cblx0XHRcdHRoaXMuc2V0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcblx0XHRcdFx0JGN1cnJlbmN5TWFzay5jdXJyZW5jeSA9IGN1cnJlbmN5O1xuXG5cdFx0XHRcdHJldHVybiAkc2VsZjtcblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJGN1cnJlbmN5TWFzay51bm1hc2tNYXRjaGVzLlxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLmFkZFVubWFza01hdGNoID0gZnVuY3Rpb24gKHJlcGxhY2UsIHZhbHVlKSB7XG5cdFx0XHRcdCRjdXJyZW5jeU1hc2sudW5tYXNrTWF0Y2hlcy51bnNoaWZ0KHtcblx0XHRcdFx0XHQncmVwbGFjZSc6IHJlcGxhY2UsXG5cdFx0XHRcdFx0J3dpdGgnOiB2YWx1ZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gJHNlbGY7XG5cdFx0XHR9O1x0XHRcdFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEFkZCBhIG5ldyBtYXRjaCB0YXNrIHRvICRjdXJyZW5jeU1hc2subWFza01hdGNoZXMuXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuYWRkTWFza01hdGNoID0gZnVuY3Rpb24gKHJlcGxhY2UsIHZhbHVlKSB7XG5cdFx0XHRcdHZhciBtYXRjaCA9IHt9O1xuXG5cdFx0XHRcdGlmKCF2YWx1ZSkge1xuXHRcdFx0XHRcdG1hdGNoLnJlcGxhY2UgPSByZXBsYWNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hdGNoLnJlcGxhY2UgPSByZXBsYWNlO1xuXHRcdFx0XHRcdG1hdGNoLndpdGggPSB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRjdXJyZW5jeU1hc2subWFza01hdGNoZXMudW5zaGlmdChtYXRjaCk7XG5cblx0XHRcdFx0cmV0dXJuICRzZWxmO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gJGN1cnJlbmN5TWFzaztcblx0XHRcdH07XG5cdFx0fSk7XHRcdFxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZXMnLCBbJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZS9uZ0N1cnJlbmN5TWFzayddKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJywgWyduZ0N1cnJlbmN5TWFzay9GaWx0ZXIvY3VycmVuY3lNYXNrJ10pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZS9uZ0N1cnJlbmN5TWFzaycsIFtdKVxuXG5cdFx0LmRpcmVjdGl2ZSgnbmdDdXJyZW5jeU1hc2snLCBbJ01hc2tlcicsIGZ1bmN0aW9uIChNYXNrZXIpIHtcblx0XHQgIHJldHVybiB7XG5cdFx0ICAgIHJlc3RyaWN0OiAnQScsXG5cdFx0ICAgIHJlcXVpcmU6IFsnP25nTW9kZWwnXSxcblx0XHQgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcblx0XHQgICAgXHR2YXIgbmdNb2RlbCA9IGNvbnRyb2xsZXJzWzBdLFxuXHRcdCAgICAgIFx0XHRjdXJyZW5jeSA9ICFhdHRycy5jdXJyZW5jeSA/IG51bGwgOiBhdHRycy5jdXJyZW5jeTtcblxuXHRcdCAgICBcdC8qKlxuXHRcdCAgICBcdCAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxuXHRcdCAgICBcdCAqL1xuXHRcdCAgICAgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIubWFza1ZhbHVlKHZhbHVlLCBjdXJyZW5jeSk7XG5cdFx0ICAgICAgfTtcblx0XHQgICAgICBcblx0XHQgICAgICAvKipcblx0XHQgICAgICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHVubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgICByZXR1cm4gTWFza2VyLnVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFBhcnNlciB3aG8gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBuZ01vZGVsXG5cdFx0ICAgICAgICogYmVmb3JlIHRoZSBnb2VzIHRvIERPTS4gVGhhdCBpcyB0aGUgcmVhbCBuZ01vZGVsIHZhbHVlLlxuXHRcdCAgICAgICAqL1xuXHRcdCAgICAgIHZhciBwYXJzZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiB1bm1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0ICAgICAgfTtcblxuXHRcdCAgICAgIG5nTW9kZWwuJHBhcnNlcnMucHVzaChwYXJzZXIpO1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIEV2ZXJ5dGltZSB0aGUgaW5wdXQgc3VmZmVyIGEgY2hhbmdlLFxuXHRcdCAgICAgICAqIHRoZSBkaXJlY3RpdmUgd2lsbCB1cGRhdGUgaXQgYW5kIG1hc2tcblx0XHQgICAgICAgKiBhbGwgdGhlIHR5cGVkIGNvbnRlbnQuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgIFx0aWYoIXZhbHVlIHx8IHZhbHVlLmxlbmd0aCA8IDEpIHsgcmV0dXJuOyB9XG5cblx0XHQgICAgICAgIHZhciBtYXNrZWRWYWx1ZSA9IG1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0ICAgICAgICBcblx0XHQgICAgICAgIGlmKG1hc2tlZFZhbHVlICE9IHZhbHVlKSB7XG5cdFx0ICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShtYXNrZWRWYWx1ZSk7XG5cdFx0ICAgICAgICAgIG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdCAgICAgICAgfVxuXHRcdCAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICB9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlcnMnLCBbXG5cdFx0XHQnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXIvY3VycmVuY3lNYXNrJ1xuXHRcdF0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJywgWyduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlciddKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9