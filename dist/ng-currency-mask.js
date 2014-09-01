(function() {
    "use strict";
    angular.module("ngCurrencyMask", [ "ngCurrencyMask/Services", "ngCurrencyMask/Directives", "ngCurrencyMask/Filters", "ngCurrencyMask/Providers" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Service/Masker", []).factory("Masker", [ "$currencyMask", function(e) {
        var r = function(r, a) {
            if (!r) return r;
            var c = r.toString();
            c = c.replace(/^/, (a ? a : e.currency) + " ");
            return c;
        };
        var a = function(a, c) {
            var n = a.toString(), t = e.maskMatches;
            t.forEach(function(e) {
                if (typeof e.replace === "function") {
                    n = e.replace(n);
                } else if (typeof e.replace === "object") {
                    n = n.replace(e.replace, e.with);
                }
            });
            n = r(n, c);
            return n;
        };
        var c = function(r) {
            var a = r.toString(), c = e.unmaskMatches;
            c.forEach(function(e) {
                if (typeof e.replace === "function") {
                    a = e.replace(a);
                } else if (typeof e.replace === "object") {
                    a = a.replace(e.replace, e.with);
                }
            });
            return a;
        };
        return {
            maskValue: a,
            unmaskValue: c
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
                replace: function(e) {
                    return e.toString();
                }
            }, {
                replace: function(e) {
                    var r = /(\.[0-9])(?=[0-9]{0}$)/g;
                    return e.replace(r, "$10");
                }
            }, {
                replace: function(e) {
                    return e.replace(e[e.lastIndexOf(".")], ",");
                }
            }, {
                replace: function(e) {
                    if (e[e.length - 3] !== ".") {
                        e = e.replace(/^(\d)*(?=(\d{0,})$)/g, "$&.00");
                    }
                    return e;
                }
            }, {
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
                replace: function(e) {
                    if (!e) return "";
                    var r = e.match(/(^[\d\D]{0,})(\,)/)[1];
                    if (r) {
                        e = e.replace(r, r.replace(/\D/g, ""));
                    }
                    e = e.replace(e[e.lastIndexOf(",")], ".");
                    return parseFloat(e);
                }
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
            var n = {};
            if (!c) {
                n.replace = t;
            } else {
                n.replace = t;
                n.with = c;
            }
            r.maskMatches.unshift(n);
            return e;
        };
        this.$get = function() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1Qcm92aWRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbmdDdXJyZW5jeU1hc2stRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9wcm92aWRlcnMuanMiLCJjb21wb25lbnRzL3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJmYWN0b3J5IiwiZGVmYXVsdHMiLCJhZGRDdXJyZW5jeSIsInZhbHVlIiwiY3VycmVuY3kiLCJuZXdWYWx1ZSIsInRvU3RyaW5nIiwicmVwbGFjZSIsIm1hc2tWYWx1ZSIsIm1hc2tlZFZhbHVlIiwibWF0Y2hlcyIsIm1hc2tNYXRjaGVzIiwiZm9yRWFjaCIsImtleSIsIndpdGgiLCJ1bm1hc2tWYWx1ZSIsInVubWFza2VkVmFsdWUiLCJ1bm1hc2tNYXRjaGVzIiwiZmlsdGVyIiwiTWFza2VyIiwiZGlnZXN0TW9kZSIsIm1vZGUiLCJkaWdlc3RDdXJyZW5jeSIsImlucHV0IiwiZGlnZXN0ZWRDdXJyZW5jeSIsInByb3ZpZGVyIiwiJHNlbGYiLCJ0aGlzIiwiJGN1cnJlbmN5TWFzayIsIm1hdGNoIiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJwYXJzZUZsb2F0Iiwic2V0Q3VycmVuY3kiLCJhZGRVbm1hc2tNYXRjaCIsInVuc2hpZnQiLCJhZGRNYXNrTWF0Y2giLCIkZ2V0IiwiZGlyZWN0aXZlIiwicmVzdHJpY3QiLCJyZXF1aXJlIiwibGluayIsInNjb3BlIiwiZWxlbWVudCIsImF0dHJzIiwiY29udHJvbGxlcnMiLCJuZ01vZGVsIiwicGFyc2VyIiwiJHBhcnNlcnMiLCJwdXNoIiwiJHdhdGNoIiwiJHNldFZpZXdWYWx1ZSIsIiRyZW5kZXIi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T0M7O2dCQU1qQyxJQUFJVyxJQUFjLFNBQVVaO29CQUMxQixPQUFPZ0IsRUFBT0osWUFBWVo7O2dCQU81QixJQUFJNEMsSUFBUyxTQUFVNUM7b0JBQ3JCLE9BQU9ZLEVBQVlaOztnQkFHckIyQyxFQUFRRSxTQUFTQyxLQUFLRjtnQkFPdEJMLEVBQU1RLE9BQU9OLEVBQU1FLFNBQVMsU0FBVTNDO29CQUNyQyxLQUFJQSxLQUFTQSxFQUFNNEIsU0FBUyxHQUFHO3dCQUFFOztvQkFFaEMsSUFBSXRCLElBQWNELEVBQVVMO29CQUU1QixJQUFHTSxLQUFlTixHQUFPO3dCQUN2QjJDLEVBQVFLLGNBQWMxQzt3QkFDdEJxQyxFQUFRTTs7Ozs7OztDQ2xEcEI7SUFDQztJQUVBdEQsUUFDRUMsT0FBTyw4QkFDUDs7Q0NMSDtJQUNDO0lBRUFELFFBQ0VDLE9BQU8sNkJBQTRCIiwiZmlsZSI6Im5nLWN1cnJlbmN5LW1hc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2snLCBbXG5cdFx0XHQnbmdDdXJyZW5jeU1hc2svU2VydmljZXMnLFxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZXMnLFxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLFxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL1Byb3ZpZGVycydcblx0XHRdKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2UvTWFza2VyJywgW10pXG5cblx0XHQuZmFjdG9yeSgnTWFza2VyJywgWyckY3VycmVuY3lNYXNrJywgZnVuY3Rpb24gKGRlZmF1bHRzKSB7XG5cdFx0XHR2YXIgYWRkQ3VycmVuY3kgPSBmdW5jdGlvbiAodmFsdWUsIGN1cnJlbmN5KSB7XG5cdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBDb252ZXJ0cyBAdmFsdWUgdG8gYSBTdHJpbmcgaW5zdGFuY2UsIGZvciBOdW1iZXJcblx0XHRcdFx0ICogaW5zdGFuY2VzIGRvZXNuJ3QgaGF2ZSAucmVwbGFjZSgpIHByb3RvdHlwZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdHZhciBuZXdWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG5cblx0XHRcdFx0Ly8gSW1wbGVtZW50cyB0aGUgY3VycmVuY3kgYXQgQG5ld1ZhbHVlXG5cdFx0XHRcdG5ld1ZhbHVlID0gbmV3VmFsdWUucmVwbGFjZSgvXi8sIChjdXJyZW5jeSA/IGN1cnJlbmN5IDogZGVmYXVsdHMuY3VycmVuY3kpICsgJyAnKTtcblxuXHRcdFx0XHRyZXR1cm4gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgbWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xuXHRcdCAgICB2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGRlZmF1bHRzLm1hc2tNYXRjaGVzO1xuXHRcdCAgICBcblx0XHQgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgXHRpZih0eXBlb2Yga2V5LnJlcGxhY2UgPT09ICdmdW5jdGlvbicpIHtcblx0XHQgICAgXHRcdG1hc2tlZFZhbHVlID0ga2V5LnJlcGxhY2UobWFza2VkVmFsdWUpO1xuXHRcdCAgICBcdH0gZWxzZSBpZiAodHlwZW9mIGtleS5yZXBsYWNlID09PSAnb2JqZWN0Jykge1xuXHRcdCAgICAgIFx0bWFza2VkVmFsdWUgPSBtYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KTtcblxuXHRcdCAgICBtYXNrZWRWYWx1ZSA9IGFkZEN1cnJlbmN5KG1hc2tlZFZhbHVlLCBjdXJyZW5jeSk7XG5cblx0XHQgICAgcmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblx0XHQgIFxuXHRcdCAgLyoqXG5cdFx0ICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgKi9cblx0XHQgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICB2YXIgdW5tYXNrZWRWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCksXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gZGVmYXVsdHMudW5tYXNrTWF0Y2hlcztcblx0XHQgICAgXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgIFx0aWYodHlwZW9mIGtleS5yZXBsYWNlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0ICAgIFx0XHR1bm1hc2tlZFZhbHVlID0ga2V5LnJlcGxhY2UodW5tYXNrZWRWYWx1ZSk7XG5cdFx0ICAgIFx0fSBlbHNlIGlmICh0eXBlb2Yga2V5LnJlcGxhY2UgPT09ICdvYmplY3QnKSB7XG5cdFx0ICAgICAgXHR1bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KTtcblx0XHQgICAgXG5cdFx0ICAgIHJldHVybiB1bm1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bWFza1ZhbHVlOiBtYXNrVmFsdWUsXG5cdFx0XHRcdHVubWFza1ZhbHVlOiB1bm1hc2tWYWx1ZVxuXHRcdFx0fTtcblx0XHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRmlsdGVyL2N1cnJlbmN5TWFzaycsIFtdKVxuXG5cdFx0LmZpbHRlcignY3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XG5cdFx0XHR2YXIgZGlnZXN0TW9kZSA9IGZ1bmN0aW9uIChtb2RlKSB7XG5cdFx0XHRcdHN3aXRjaChtb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSAnbWFzayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3VubWFzayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZGlnZXN0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcblx0XHRcdFx0aWYoY3VycmVuY3kgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gY3VycmVuY3k7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBtb2RlLCBjdXJyZW5jeSkge1xuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXG5cdFx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyksXG5cdFx0XHRcdGRpZ2VzdGVkQ3VycmVuY3kgPSBjdXJyZW5jeSA/IGRpZ2VzdEN1cnJlbmN5KGN1cnJlbmN5KSA6IGRpZ2VzdEN1cnJlbmN5KG51bGwpO1xuXG5cdFx0XHRcdGlmKG1vZGUgPT09IDEpIHtcblx0XHRcdFx0XHR2YXIgbWFza2VkVmFsdWUgPSBNYXNrZXIubWFza1ZhbHVlKGlucHV0LCBkaWdlc3RlZEN1cnJlbmN5KTtcblxuXHRcdFx0XHRcdHJldHVybiBtYXNrZWRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSAyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlci9jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5wcm92aWRlcignJGN1cnJlbmN5TWFzaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciAkc2VsZiA9IHRoaXMsXG5cdFx0XHQkY3VycmVuY3lNYXNrID0ge1xuXHRcdFx0XHRjdXJyZW5jeTogJ1IkJyxcblxuXHRcdFx0XHQvLyBNYXRjaGVzIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGNvbnRlbnQuXG5cdFx0XHRcdG1hc2tNYXRjaGVzOiBbXG5cdFx0XHRcdFx0eyAncmVwbGFjZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0fSB9LFxuXHRcdFx0XHRcdHsgJ3JlcGxhY2UnOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdHZhciBtYXRjaCA9IC8oXFwuWzAtOV0pKD89WzAtOV17MH0kKS9nO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWUucmVwbGFjZShtYXRjaCwgJyQxMCcpO1xuXHRcdFx0XHRcdH0gfSxcblx0XHRcdFx0XHR7ICdyZXBsYWNlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWUucmVwbGFjZSh2YWx1ZVt2YWx1ZS5sYXN0SW5kZXhPZignLicpXSwgJywnKTtcblx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0eyAncmVwbGFjZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHQgKiBFeGFtcGxlOiBodHRwOi8vcmVnZXgxMDEuY29tL3IvbEUwdE45LzFcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0aWYodmFsdWVbdmFsdWUubGVuZ3RoIC0gM10gIT09ICcuJykge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL14oXFxkKSooPz0oXFxkezAsfSkkKS9nLCAnJCYuMDAnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH0gfSxcblx0XHRcdFx0XHR7ICdyZXBsYWNlJzogL1teXFxkXS9nLCAnd2l0aCc6IFwiXCIgfSxcblx0XHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogXCIsJDFcIiB9LFxuXHRcdFx0XHRcdHsgJ3JlcGxhY2UnOiAvLChcXGR7Myx9KSQvLCAnd2l0aCc6ICckMSwwMCcgfSxcblx0XHRcdFx0XHR7ICdyZXBsYWNlJzogL14oMHsxLH0pLywgJ3dpdGgnOiAnJyB9LFxuXHRcdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXiwoXFxkezJ9KSQvLCAnd2l0aCc6IFwiMCwkMVwiIH0sXG5cdFx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICd3aXRoJzogXCIkMS5cIiB9XG5cdFx0XHRcdF0sXG5cblx0XHRcdFx0dW5tYXNrTWF0Y2hlczogW1x0XHRcdFx0XHRcblx0XHRcdFx0XHR7ICdyZXBsYWNlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZighdmFsdWUpIHJldHVybiAnJztcblxuXHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHQgKiBFeGFtcGxlOiBodHRwOi8vcmVnZXgxMDEuY29tL3IvZFowclg3LzFcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0dmFyIG1hdGNoID0gKHZhbHVlLm1hdGNoKC8oXltcXGRcXERdezAsfSkoXFwsKS8pKVsxXTtcblxuXHRcdFx0XHRcdFx0aWYobWF0Y2gpIHtcblx0XHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKG1hdGNoLCBtYXRjaC5yZXBsYWNlKC9cXEQvZywgJycpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHZhbHVlW3ZhbHVlLmxhc3RJbmRleE9mKCcsJyldLCAnLicpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG5cdFx0XHRcdFx0fSB9XG5cdFx0XHRcdF1cblx0XHRcdH07XG5cblx0XHRcdHRoaXMuc2V0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcblx0XHRcdFx0JGN1cnJlbmN5TWFzay5jdXJyZW5jeSA9IGN1cnJlbmN5O1xuXG5cdFx0XHRcdHJldHVybiAkc2VsZjtcblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJGN1cnJlbmN5TWFzay51bm1hc2tNYXRjaGVzLlxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLmFkZFVubWFza01hdGNoID0gZnVuY3Rpb24gKHJlcGxhY2UsIHZhbHVlKSB7XG5cdFx0XHRcdCRjdXJyZW5jeU1hc2sudW5tYXNrTWF0Y2hlcy51bnNoaWZ0KHtcblx0XHRcdFx0XHQncmVwbGFjZSc6IHJlcGxhY2UsXG5cdFx0XHRcdFx0J3dpdGgnOiB2YWx1ZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gJHNlbGY7XG5cdFx0XHR9O1x0XHRcdFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEFkZCBhIG5ldyBtYXRjaCB0YXNrIHRvICRjdXJyZW5jeU1hc2subWFza01hdGNoZXMuXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuYWRkTWFza01hdGNoID0gZnVuY3Rpb24gKHJlcGxhY2UsIHZhbHVlKSB7XG5cdFx0XHRcdHZhciBtYXRjaCA9IHt9O1xuXG5cdFx0XHRcdGlmKCF2YWx1ZSkge1xuXHRcdFx0XHRcdG1hdGNoLnJlcGxhY2UgPSByZXBsYWNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hdGNoLnJlcGxhY2UgPSByZXBsYWNlO1xuXHRcdFx0XHRcdG1hdGNoLndpdGggPSB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRjdXJyZW5jeU1hc2subWFza01hdGNoZXMudW5zaGlmdChtYXRjaCk7XG5cblx0XHRcdFx0cmV0dXJuICRzZWxmO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gJGN1cnJlbmN5TWFzaztcblx0XHRcdH07XG5cdFx0fSk7XHRcdFxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZXMnLCBbJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZS9uZ0N1cnJlbmN5TWFzayddKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9GaWx0ZXJzJywgWyduZ0N1cnJlbmN5TWFzay9GaWx0ZXIvY3VycmVuY3lNYXNrJ10pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZS9uZ0N1cnJlbmN5TWFzaycsIFtdKVxuXG5cdFx0LmRpcmVjdGl2ZSgnbmdDdXJyZW5jeU1hc2snLCBbJ01hc2tlcicsIGZ1bmN0aW9uIChNYXNrZXIpIHtcblx0XHQgIHJldHVybiB7XG5cdFx0ICAgIHJlc3RyaWN0OiAnQScsXG5cdFx0ICAgIHJlcXVpcmU6IFsnP25nTW9kZWwnXSxcblx0XHQgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcblx0XHQgICAgXHR2YXIgbmdNb2RlbCA9IGNvbnRyb2xsZXJzWzBdLFxuXHRcdCAgICAgIFx0XHRjdXJyZW5jeSA9ICFhdHRycy5jdXJyZW5jeSA/IG51bGwgOiBhdHRycy5jdXJyZW5jeTtcblxuXHRcdCAgICBcdC8qKlxuXHRcdCAgICBcdCAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxuXHRcdCAgICBcdCAqL1xuXHRcdCAgICAgIHZhciBtYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIubWFza1ZhbHVlKHZhbHVlLCBjdXJyZW5jeSk7XG5cdFx0ICAgICAgfTtcblx0XHQgICAgICBcblx0XHQgICAgICAvKipcblx0XHQgICAgICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHVubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgICByZXR1cm4gTWFza2VyLnVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFBhcnNlciB3aG8gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBuZ01vZGVsXG5cdFx0ICAgICAgICogYmVmb3JlIHRoZSBnb2VzIHRvIERPTS4gVGhhdCBpcyB0aGUgcmVhbCBuZ01vZGVsIHZhbHVlLlxuXHRcdCAgICAgICAqL1xuXHRcdCAgICAgIHZhciBwYXJzZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiB1bm1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0ICAgICAgfTtcblxuXHRcdCAgICAgIG5nTW9kZWwuJHBhcnNlcnMucHVzaChwYXJzZXIpO1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIEV2ZXJ5dGltZSB0aGUgaW5wdXQgc3VmZmVyIGEgY2hhbmdlLFxuXHRcdCAgICAgICAqIHRoZSBkaXJlY3RpdmUgd2lsbCB1cGRhdGUgaXQgYW5kIG1hc2tcblx0XHQgICAgICAgKiBhbGwgdGhlIHR5cGVkIGNvbnRlbnQuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgIFx0aWYoIXZhbHVlIHx8IHZhbHVlLmxlbmd0aCA8IDEpIHsgcmV0dXJuOyB9XG5cblx0XHQgICAgICAgIHZhciBtYXNrZWRWYWx1ZSA9IG1hc2tWYWx1ZSh2YWx1ZSk7XG5cdFx0ICAgICAgICBcblx0XHQgICAgICAgIGlmKG1hc2tlZFZhbHVlICE9IHZhbHVlKSB7XG5cdFx0ICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShtYXNrZWRWYWx1ZSk7XG5cdFx0ICAgICAgICAgIG5nTW9kZWwuJHJlbmRlcigpO1xuXHRcdCAgICAgICAgfVxuXHRcdCAgICAgIH0pO1xuXHRcdCAgICB9XG5cdFx0ICB9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlcnMnLCBbXG5cdFx0XHQnbmdDdXJyZW5jeU1hc2svUHJvdmlkZXIvY3VycmVuY3lNYXNrJ1xuXHRcdF0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2VzJywgWyduZ0N1cnJlbmN5TWFzay9TZXJ2aWNlL01hc2tlciddKTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9