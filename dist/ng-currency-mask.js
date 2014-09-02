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
            if (r === null || r === "default") {
                return null;
            } else {
                return r;
            }
        };
        return function(u, a, t) {
            if (!u) return "";
            u = u.toString();
            var a = a ? n(a) : n("mask"), s = t ? e(t) : e(null);
            if (a === 1) {
                var l = r.maskValue(u, s);
                return l;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHMvTWFza2VyLVNlcnZpY2UuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1GaWx0ZXIuanMiLCJjb21wb25lbnRzL2N1cnJlbmN5TWFzay1Qcm92aWRlci5qcyIsImNvbXBvbmVudHMvZGlyZWN0aXZlcy5qcyIsImNvbXBvbmVudHMvZmlsdGVycy5qcyIsImNvbXBvbmVudHMvbmdDdXJyZW5jeU1hc2stRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9wcm92aWRlcnMuanMiLCJjb21wb25lbnRzL3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJmYWN0b3J5IiwiZGVmYXVsdHMiLCJhZGRDdXJyZW5jeSIsInZhbHVlIiwiY3VycmVuY3kiLCJuZXdWYWx1ZSIsInRvU3RyaW5nIiwicmVwbGFjZSIsIm1hc2tWYWx1ZSIsIm1hc2tlZFZhbHVlIiwibWF0Y2hlcyIsIm1hc2tNYXRjaGVzIiwiZm9yRWFjaCIsImtleSIsIkZ1bmN0aW9uIiwid2l0aCIsInVubWFza1ZhbHVlIiwidW5tYXNrZWRWYWx1ZSIsInVubWFza01hdGNoZXMiLCJmaWx0ZXIiLCJNYXNrZXIiLCJkaWdlc3RNb2RlIiwibW9kZSIsImRpZ2VzdEN1cnJlbmN5IiwiaW5wdXQiLCJkaWdlc3RlZEN1cnJlbmN5IiwicHJvdmlkZXIiLCJyZWdleCIsIlJlZ0V4cCIsIm1hdGNoIiwiQXJyYXkiLCJzdWJzdHIiLCIkc2VsZiIsInRoaXMiLCIkY3VycmVuY3lNYXNrIiwic2V0Q3VycmVuY3kiLCJhZGRVbm1hc2tNYXRjaCIsInVuc2hpZnQiLCJhZGRNYXNrTWF0Y2giLCIkZ2V0IiwiZGlyZWN0aXZlIiwicmVzdHJpY3QiLCJyZXF1aXJlIiwibGluayIsInNjb3BlIiwiZWxlbWVudCIsImF0dHJzIiwiY29udHJvbGxlcnMiLCJuZ01vZGVsIiwicGFyc2VyIiwiJHBhcnNlcnMiLCJwdXNoIiwiJHdhdGNoIiwibGVuZ3RoIiwiJHNldFZp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QU81QixJQUFJOEMsSUFBUyxTQUFVOUM7b0JBQ3JCLE9BQU9hLEVBQVliOztnQkFHckI2QyxFQUFRRSxTQUFTQyxLQUFLRjtnQkFPdEJMLEVBQU1RLE9BQU9OLEVBQU1FLFNBQVMsU0FBVTdDO29CQUNyQyxLQUFJQSxLQUFTQSxFQUFNa0QsU0FBUyxHQUFHO3dCQUFFOztvQkFFaEMsSUFBSTVDLElBQWNELEVBQVVMO29CQUU1QixJQUFHTSxLQUFlTixHQUFPO3dCQUN2QjZDLEVBQVFNLGNBQWM3Qzt3QkFDdEJ1QyxFQUFRTzs7Ozs7OztDQ2xEcEI7SUFDQztJQUVBekQsUUFDRUMsT0FBTyw4QkFDUDs7Q0NMSDtJQUNDO0lBRUFELFFBQ0VDLE9BQU8sNkJBQTRCIiwiZmlsZSI6Im5nLWN1cnJlbmN5LW1hc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2snLCBbXG5cdFx0XHQnbmdDdXJyZW5jeU1hc2svU2VydmljZXMnLFxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZXMnLFxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLFxuXHRcdFx0J25nQ3VycmVuY3lNYXNrL1Byb3ZpZGVycydcblx0XHRdKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2UvTWFza2VyJywgW10pXG5cblx0XHQuZmFjdG9yeSgnTWFza2VyJywgWyckY3VycmVuY3lNYXNrJywgZnVuY3Rpb24gKGRlZmF1bHRzKSB7XG5cdFx0XHR2YXIgYWRkQ3VycmVuY3kgPSBmdW5jdGlvbiAodmFsdWUsIGN1cnJlbmN5KSB7XG5cdFx0XHRcdGlmKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBDb252ZXJ0cyBAdmFsdWUgdG8gYSBTdHJpbmcgaW5zdGFuY2UsIGZvciBOdW1iZXJcblx0XHRcdFx0ICogaW5zdGFuY2VzIGRvZXNuJ3QgaGF2ZSAucmVwbGFjZSgpIHByb3RvdHlwZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdHZhciBuZXdWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG5cblx0XHRcdFx0Ly8gSW1wbGVtZW50cyB0aGUgY3VycmVuY3kgYXQgQG5ld1ZhbHVlXG5cdFx0XHRcdG5ld1ZhbHVlID0gbmV3VmFsdWUucmVwbGFjZSgvXi8sIChjdXJyZW5jeSA/IGN1cnJlbmN5IDogZGVmYXVsdHMuY3VycmVuY3kpICsgJyAnKTtcblxuXHRcdFx0XHRyZXR1cm4gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIE1hc2sgQHZhbHVlIG1hdGNoaW5nIGl0IGNvbnRlbnRzLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgbWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW5jeSkge1xuXHRcdCAgICB2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxuXHRcdCAgICBcdFx0bWF0Y2hlcyA9IGRlZmF1bHRzLm1hc2tNYXRjaGVzO1xuXHRcdCAgICBcblx0XHQgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHQgICAgXHRpZihrZXkucmVwbGFjZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG5cdFx0ICAgIFx0XHRtYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgXHR9IGVsc2Uge1xuXHRcdCAgICAgIFx0bWFza2VkVmFsdWUgPSBtYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KTtcblxuXHRcdCAgICBtYXNrZWRWYWx1ZSA9IGFkZEN1cnJlbmN5KG1hc2tlZFZhbHVlLCBjdXJyZW5jeSk7XG5cblx0XHQgICAgcmV0dXJuIG1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblx0XHQgIFxuXHRcdCAgLyoqXG5cdFx0ICAgKiBSZXR1cm4gQHZhbHVlIHRvIGl0IHJlYWwgdmFsdWUuXG5cdFx0ICAgKi9cblx0XHQgIHZhciB1bm1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICB2YXIgdW5tYXNrZWRWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCksXG5cdFx0ICAgIFx0XHRtYXRjaGVzID0gZGVmYXVsdHMudW5tYXNrTWF0Y2hlcztcblx0XHQgICAgXG5cdFx0ICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ICAgIFx0aWYoa2V5LnJlcGxhY2UgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdCAgICBcdFx0dW5tYXNrZWRWYWx1ZSA9IGtleS5yZXBsYWNlKHVubWFza2VkVmFsdWUpO1xuXHRcdCAgICBcdH0gZWxzZSB7XG5cdFx0ICAgICAgXHR1bm1hc2tlZFZhbHVlID0gdW5tYXNrZWRWYWx1ZS5yZXBsYWNlKGtleS5yZXBsYWNlLCBrZXkud2l0aCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KTtcblx0XHQgICAgXG5cdFx0ICAgIHJldHVybiB1bm1hc2tlZFZhbHVlO1xuXHRcdCAgfTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bWFza1ZhbHVlOiBtYXNrVmFsdWUsXG5cdFx0XHRcdHVubWFza1ZhbHVlOiB1bm1hc2tWYWx1ZVxuXHRcdFx0fTtcblx0XHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRmlsdGVyL2N1cnJlbmN5TWFzaycsIFtdKVxuXG5cdFx0LmZpbHRlcignY3VycmVuY3lNYXNrJywgWydNYXNrZXInLCBmdW5jdGlvbiAoTWFza2VyKSB7XG5cdFx0XHR2YXIgZGlnZXN0TW9kZSA9IGZ1bmN0aW9uIChtb2RlKSB7XG5cdFx0XHRcdHN3aXRjaChtb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSAnbWFzayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3VubWFzayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZGlnZXN0Q3VycmVuY3kgPSBmdW5jdGlvbiAoY3VycmVuY3kpIHtcblx0XHRcdFx0aWYoY3VycmVuY3kgPT09IG51bGwgfHwgY3VycmVuY3kgPT09ICdkZWZhdWx0Jykge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBjdXJyZW5jeTtcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoaW5wdXQsIG1vZGUsIGN1cnJlbmN5KSB7XG5cdFx0XHRcdGlmKCFpbnB1dCkgcmV0dXJuICcnO1xuXG5cdFx0XHRcdGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcblxuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyAnbW9kZScgZGVmaW5lZC4gTWFzayB0aGUgaW5wdXQuXG5cdFx0XHRcdHZhciBtb2RlID0gbW9kZSA/IGRpZ2VzdE1vZGUobW9kZSkgOiBkaWdlc3RNb2RlKCdtYXNrJyksXG5cdFx0XHRcdGRpZ2VzdGVkQ3VycmVuY3kgPSBjdXJyZW5jeSA/IGRpZ2VzdEN1cnJlbmN5KGN1cnJlbmN5KSA6IGRpZ2VzdEN1cnJlbmN5KG51bGwpO1xuXG5cdFx0XHRcdGlmKG1vZGUgPT09IDEpIHtcblx0XHRcdFx0XHR2YXIgbWFza2VkVmFsdWUgPSBNYXNrZXIubWFza1ZhbHVlKGlucHV0LCBkaWdlc3RlZEN1cnJlbmN5KTtcblxuXHRcdFx0XHRcdHJldHVybiBtYXNrZWRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSAyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIE1hc2tlci51bm1hc2tWYWx1ZShpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlci9jdXJyZW5jeU1hc2snLCBbXSlcblxuXHRcdC5wcm92aWRlcignJGN1cnJlbmN5TWFzaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBtYXNrTWF0Y2hlcyA9IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFwuWzAtOV0pKD89WzAtOV17MH0kKS9nLCAnd2l0aCc6ICckMTAnIH0sIC8vIENvbnZlcnRzIFhYWFguWCB0byBYWFhYLlgwXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXihcXGQpKig/PShcXGR7MCx9KSQpL2csICd3aXRoJzogJyQmLDAwJyB9LCAvLyBDb252ZXJ0cyBYWFhYIHRvIFhYWFgsMDBcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9cXEQvZywgJ3dpdGgnOiBcIlwiIH0sIC8vIENvbnZlcnRzIGFsbCBub24tZGlnaXQgbnVtYmVycyB0byAnJ1xuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oXFxkezF9KSQvLCAnd2l0aCc6ICcwLDAkMScgfSwgLy8gQ29udmVydHMgWCB0byAwLDBYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZHsyfSkkLywgJ3dpdGgnOiAnLCQxJ30sIC8vIENvbnZlcnRzIFhYIHRvIDAsWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8sKFxcZHszLH0pJC8sICd3aXRoJzogJyQxLDAwJyB9LCAvLyBDb252ZXJ0cyBYLFhYWCB0byBYLFhYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXiwoXFxkezJ9KSQvLCAnd2l0aCc6IFwiMCwkMVwiIH0sIC8vIENvbnZlcnRzICxYWCB0byAwLFhYXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnd2l0aCc6IFwiJDEuXCIgfSAvLyBDb252ZXJ0cyBYWFhYWFggdG8gWFhYLlhYWFxuXHRcdFx0XSxcblxuXHRcdFx0dW5tYXNrTWF0Y2hlcyA9IFtcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9cXEQvZywgJ3dpdGgnOiBcIlwiIH0sIC8vIENvbnZlcnRzICBhbGwgbm9uLWRpZ2l0IG51bWJlcnMgdG8gJydcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eKFxcZHsxfSkkLywgJ3dpdGgnOiAnMC4wJDEnIH0sIC8vIENvbnZlcnRzIFggdG8gWC4wWFxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogJy4kMSd9LCAvLyBDb252ZXJ0cyBYWCB0byAuWFhcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oLDAwfFxcLjAwJCkvZywgJ3dpdGgnOiAnJyB9LCAvLyBDb252ZXJ0cyBhbGwgLFhYIGFuZCAuWFggdG8gbm90aGluZ1x0XHRcdFx0XG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXigwezEsfSkvLCAnd2l0aCc6ICcnIH0sIC8vIENvbnZlcnRzIHplcm9zIGF0IHRoZSBzdGFydCBvZiB0aGUgc3RyaW5nIHRvIG5vdGhpbmdcblx0XHRcdFx0eyAncmVwbGFjZSc6IC9eXFwuKFxcZHsyfSkkLywgJ3dpdGgnOiBcIjAuJDFcIiB9LCAvLyBDb252ZXJ0cyAuWFggdG8gMC5YWFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBDbGVhbiB0aGUgZW5kIG9mIHRoZSBzdHJpbmcgZnJvbVxuXHRcdFx0XHQgKiB1bnNpZ25pZmljYW50IG51bWJlcnMgY29udmVydGluZ1xuXHRcdFx0XHQgKiBYWFguMzBYWFhYIHRvIFhYWC4zMFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0eyAncmVwbGFjZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0aWYoIXZhbHVlKSByZXR1cm4gJyc7XG5cblx0XHRcdFx0XHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1xcLihcXGR7Myx9KSQnKSxcblx0XHRcdFx0XHRcdG1hdGNoID0gdmFsdWUubWF0Y2gocmVnZXgpO1xuXG5cdFx0XHRcdFx0XHRpZihtYXRjaCBpbnN0YW5jZW9mIEFycmF5ICYmIG1hdGNoWzFdKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShtYXRjaCwgbWF0Y2gudG9TdHJpbmcoKS5zdWJzdHIoMCwgMikpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXG5cdFx0XHR2YXIgJHNlbGYgPSB0aGlzLFxuXHRcdFx0JGN1cnJlbmN5TWFzayA9IHtcblx0XHRcdFx0Y3VycmVuY3k6ICdSJCcsXG5cblx0XHRcdFx0Ly8gTWF0Y2hlcyB3aG8gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBjb250ZW50LlxuXHRcdFx0XHRtYXNrTWF0Y2hlczogbWFza01hdGNoZXMsXG5cblx0XHRcdFx0dW5tYXNrTWF0Y2hlczogdW5tYXNrTWF0Y2hlc1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5zZXRDdXJyZW5jeSA9IGZ1bmN0aW9uIChjdXJyZW5jeSkge1xuXHRcdFx0XHQkY3VycmVuY3lNYXNrLmN1cnJlbmN5ID0gY3VycmVuY3k7XG5cblx0XHRcdFx0cmV0dXJuICRzZWxmO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBBZGQgYSBuZXcgbWF0Y2ggdGFzayB0byAkY3VycmVuY3lNYXNrLnVubWFza01hdGNoZXMuXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuYWRkVW5tYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdFx0JGN1cnJlbmN5TWFzay51bm1hc2tNYXRjaGVzLnVuc2hpZnQoe1xuXHRcdFx0XHRcdCdyZXBsYWNlJzogcmVwbGFjZSxcblx0XHRcdFx0XHQnd2l0aCc6IHZhbHVlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiAkc2VsZjtcblx0XHRcdH07XHRcdFx0XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQWRkIGEgbmV3IG1hdGNoIHRhc2sgdG8gJGN1cnJlbmN5TWFzay5tYXNrTWF0Y2hlcy5cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5hZGRNYXNrTWF0Y2ggPSBmdW5jdGlvbiAocmVwbGFjZSwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIG1hdGNoID0ge307XG5cblx0XHRcdFx0aWYoIXZhbHVlKSB7XG5cdFx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWF0Y2gucmVwbGFjZSA9IHJlcGxhY2U7XG5cdFx0XHRcdFx0bWF0Y2gud2l0aCA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGN1cnJlbmN5TWFzay5tYXNrTWF0Y2hlcy51bnNoaWZ0KG1hdGNoKTtcblxuXHRcdFx0XHRyZXR1cm4gJHNlbGY7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiAkY3VycmVuY3lNYXNrO1xuXHRcdFx0fTtcblx0XHR9KTtcdFx0XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlcycsIFsnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJ10pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL0ZpbHRlcnMnLCBbJ25nQ3VycmVuY3lNYXNrL0ZpbHRlci9jdXJyZW5jeU1hc2snXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJywgW10pXG5cblx0XHQuZGlyZWN0aXZlKCduZ0N1cnJlbmN5TWFzaycsIFsnTWFza2VyJywgZnVuY3Rpb24gKE1hc2tlcikge1xuXHRcdCAgcmV0dXJuIHtcblx0XHQgICAgcmVzdHJpY3Q6ICdBJyxcblx0XHQgICAgcmVxdWlyZTogWyc/bmdNb2RlbCddLFxuXHRcdCAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycykge1xuXHRcdCAgICBcdHZhciBuZ01vZGVsID0gY29udHJvbGxlcnNbMF0sXG5cdFx0ICAgICAgXHRcdGN1cnJlbmN5ID0gIWF0dHJzLmN1cnJlbmN5ID8gbnVsbCA6IGF0dHJzLmN1cnJlbmN5O1xuXG5cdFx0ICAgIFx0LyoqXG5cdFx0ICAgIFx0ICogTWFzayBAdmFsdWUgbWF0Y2hpbmcgaXQgY29udGVudHMuXG5cdFx0ICAgIFx0ICovXG5cdFx0ICAgICAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIE1hc2tlci5tYXNrVmFsdWUodmFsdWUsIGN1cnJlbmN5KTtcblx0XHQgICAgICB9O1xuXHRcdCAgICAgIFxuXHRcdCAgICAgIC8qKlxuXHRcdCAgICAgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICB2YXIgdW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHQgICAgICAgIHJldHVybiBNYXNrZXIudW5tYXNrVmFsdWUodmFsdWUpO1xuXHRcdCAgICAgIH07XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogUGFyc2VyIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIG5nTW9kZWxcblx0XHQgICAgICAgKiBiZWZvcmUgdGhlIGdvZXMgdG8gRE9NLiBUaGF0IGlzIHRoZSByZWFsIG5nTW9kZWwgdmFsdWUuXG5cdFx0ICAgICAgICovXG5cdFx0ICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdCAgICAgICAgcmV0dXJuIHVubWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICB9O1xuXG5cdFx0ICAgICAgbmdNb2RlbC4kcGFyc2Vycy5wdXNoKHBhcnNlcik7XG5cdFx0ICAgICAgXG5cdFx0ICAgICAgLyoqXG5cdFx0ICAgICAgICogRXZlcnl0aW1lIHRoZSBpbnB1dCBzdWZmZXIgYSBjaGFuZ2UsXG5cdFx0ICAgICAgICogdGhlIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdCBhbmQgbWFza1xuXHRcdCAgICAgICAqIGFsbCB0aGUgdHlwZWQgY29udGVudC5cblx0XHQgICAgICAgKi9cblx0XHQgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0ICAgICAgXHRpZighdmFsdWUgfHwgdmFsdWUubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cblxuXHRcdCAgICAgICAgdmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcblx0XHQgICAgICAgIFxuXHRcdCAgICAgICAgaWYobWFza2VkVmFsdWUgIT0gdmFsdWUpIHtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcblx0XHQgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgfSk7XG5cdFx0ICAgIH1cblx0XHQgIH07XG5cdFx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nQ3VycmVuY3lNYXNrL1Byb3ZpZGVycycsIFtcblx0XHRcdCduZ0N1cnJlbmN5TWFzay9Qcm92aWRlci9jdXJyZW5jeU1hc2snXG5cdFx0XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svU2VydmljZXMnLCBbJ25nQ3VycmVuY3lNYXNrL1NlcnZpY2UvTWFza2VyJ10pO1xufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=