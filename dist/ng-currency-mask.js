(function() {
    "use strict";
    angular.module("ngCurrencyMask", [ "ngCurrencyMask/Directives" ]).value("ngCurrencyMaskConfig", {
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
    angular.module("ngCurrencyMask/Directives", [ "ngCurrencyMask/Directive/ngCurrencyMask" ]);
})();
(function() {
    "use strict";
    angular.module("ngCurrencyMask/Directive/ngCurrencyMask", []).directive("ngCurrencyMask", [ "ngCurrencyMaskConfig", function(r) {
        return {
            restrict: "A",
            require: [ "?ngModel" ],
            link: function(n, e, t, u) {
                var c = u[0];
                var i = function(n) {
                    var e = n.toString(), t = r.matches;
                    t.forEach(function(r) {
                        e = e.replace(r.replace, r.with);
                    });
                    return e;
                };
                var a = function(r) {
                    return r.replace(/\D/g, "");
                };
                var o = function(r) {
                    return a(r);
                };
                c.$parsers.push(o);
                n.$watch(t.ngModel, function(r) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbXBvbmVudHNcXGRpcmVjdGl2ZXMuanMiLCJjb21wb25lbnRzXFxuZ0N1cnJlbmN5TWFzay1EaXJlY3RpdmUuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsInZhbHVlIiwibWF0Y2hlcyIsInJlcGxhY2UiLCJ3aXRoIiwiZGlyZWN0aXZlIiwiY29uZmlnIiwicmVzdHJpY3QiLCJyZXF1aXJlIiwibGluayIsInNjb3BlIiwiZWxlbWVudCIsImF0dHJzIiwiY29udHJvbGxlcnMiLCJuZ01vZGVsIiwibWFza1ZhbHVlIiwibWFza2VkVmFsdWUiLCJ0b1N0cmluZyIsImZvckVhY2giLCJrZXkiLCJ1bm1hc2tWYWx1ZSIsInBhcnNlciIsIiRwYXJzZXJzIiwicHVzaCIsIiR3YXRjaCIsImxlbmd0aCIsIiRzZXRWaWV3VmFsdWUiLCIkcmVuZGVyIl0sIm1hcHBpbmdzIjoiQ0FBQTtJQUNFO0lBRUFBLFFBQ0dDLE9BQU8sb0JBQW1CLCtCQUUxQkMsTUFBTTtRQUVSQztZQUNHQyxTQUFXO1lBQVVDLFFBQVE7O1lBQzdCRCxTQUFXO1lBQVlDLFFBQVE7O1lBQy9CRCxTQUFXO1lBQWNDLFFBQVE7O1lBQ2pDRCxTQUFXO1lBQVlDLFFBQVE7O1lBQy9CRCxTQUFXO1lBQWNDLFFBQVE7O1lBQ2pDRCxTQUFXO1lBQTJCQyxRQUFROztZQUM5Q0QsU0FBVztZQUFLQyxRQUFROzs7O0NDZjlCO0lBQ0M7SUFFQUwsUUFDRUMsT0FBTywrQkFBOEI7O0NDSnhDO0lBQ0M7SUFFQUQsUUFDRUMsT0FBTywrQ0FFUEssVUFBVSxvQkFBbUIsd0JBQXdCLFNBQVVDO1FBQzlEO1lBQ0VDLFVBQVU7WUFDVkMsV0FBVTtZQUNWQyxNQUFNLFNBQVVDLEdBQU9DLEdBQVNDLEdBQU9DO2dCQUN0QyxJQUFJQyxJQUFVRCxFQUFZO2dCQUt6QixJQUFJRSxJQUFZLFNBQVVkO29CQUN4QixJQUFJZSxJQUFjZixFQUFNZ0IsWUFDdEJmLElBQVVJLEVBQU9KO29CQUVuQkEsRUFBUWdCLFFBQVEsU0FBVUM7d0JBQ3hCSCxJQUFjQSxFQUFZYixRQUFRZ0IsRUFBSWhCLFNBQVNnQixFQUFJZjs7b0JBR3JELE9BQU9ZOztnQkFNVCxJQUFJSSxJQUFjLFNBQVVuQjtvQkFDMUIsT0FBT0EsRUFBTUUsUUFBUSxPQUFPOztnQkFPOUIsSUFBSWtCLElBQVMsU0FBVXBCO29CQUNyQixPQUFPbUIsRUFBWW5COztnQkFHckJhLEVBQVFRLFNBQVNDLEtBQUtGO2dCQU90QlgsRUFBTWMsT0FBT1osRUFBTUUsU0FBUyxTQUFVYjtvQkFDckMsS0FBSUEsS0FBU0EsRUFBTXdCLFNBQVMsR0FBRzt3QkFBRTs7b0JBRWhDLElBQUlULElBQWNELEVBQVVkO29CQUU1QixJQUFHZSxLQUFlZixHQUFPO3dCQUN2QmEsRUFBUVksY0FBY1Y7d0JBQ3RCRixFQUFRYSIsImZpbGUiOiJuZy1jdXJyZW5jeS1tYXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcbiAgXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnbmdDdXJyZW5jeU1hc2snLCBbJ25nQ3VycmVuY3lNYXNrL0RpcmVjdGl2ZXMnXSlcclxuXHJcbiAgICAudmFsdWUoJ25nQ3VycmVuY3lNYXNrQ29uZmlnJywge1xyXG5cdFx0XHQvLyBNYXRjaGVzIHdobyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGNvbnRlbnQuXHJcblx0XHRcdG1hdGNoZXM6IFtcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL1teXFxkXS9nLCAnd2l0aCc6IFwiXCIgfSxcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogLyhcXGR7Mn0pJC8sICd3aXRoJzogXCIsJDFcIiB9LFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvLChcXGR7Myx9KSQvLCAnd2l0aCc6ICckMSwwMCcgfSxcclxuXHRcdFx0XHR7ICdyZXBsYWNlJzogL14oMHsxLH0pLywgJ3dpdGgnOiAnJyB9LFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXiwoXFxkezJ9KSQvLCAnd2l0aCc6IFwiMCwkMVwiIH0sXHJcblx0XHRcdFx0eyAncmVwbGFjZSc6IC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICd3aXRoJzogXCIkMS5cIiB9LFxyXG5cdFx0XHRcdHsgJ3JlcGxhY2UnOiAvXi8sICd3aXRoJzogXCJSJCBcIiB9XHJcblx0XHRcdF1cclxuXHRcdH0pO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlcycsIFsnbmdDdXJyZW5jeU1hc2svRGlyZWN0aXZlL25nQ3VycmVuY3lNYXNrJ10pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCduZ0N1cnJlbmN5TWFzay9EaXJlY3RpdmUvbmdDdXJyZW5jeU1hc2snLCBbXSlcclxuXHJcblx0XHQuZGlyZWN0aXZlKCduZ0N1cnJlbmN5TWFzaycsIFsnbmdDdXJyZW5jeU1hc2tDb25maWcnLCBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblx0XHQgIHJldHVybiB7XHJcblx0XHQgICAgcmVzdHJpY3Q6ICdBJyxcclxuXHRcdCAgICByZXF1aXJlOiBbJz9uZ01vZGVsJ10sXHJcblx0XHQgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcclxuXHRcdCAgICBcdHZhciBuZ01vZGVsID0gY29udHJvbGxlcnNbMF07XHJcblxyXG5cdFx0ICAgIFx0LyoqXHJcblx0XHQgICAgXHQgKiBNYXNrIEB2YWx1ZSBtYXRjaGluZyBpdCBjb250ZW50cy5cclxuXHRcdCAgICBcdCAqL1xyXG5cdFx0ICAgICAgdmFyIG1hc2tWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0ICAgICAgICB2YXIgbWFza2VkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLFxyXG5cdFx0ICAgICAgICBcdFx0bWF0Y2hlcyA9IGNvbmZpZy5tYXRjaGVzO1xyXG5cdFx0ICAgICAgICBcclxuXHRcdCAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdCAgICAgICAgICBtYXNrZWRWYWx1ZSA9IG1hc2tlZFZhbHVlLnJlcGxhY2Uoa2V5LnJlcGxhY2UsIGtleS53aXRoKTtcclxuXHRcdCAgICAgICAgfSk7XHJcblx0XHQgICAgICAgIFxyXG5cdFx0ICAgICAgICByZXR1cm4gbWFza2VkVmFsdWU7XHJcblx0XHQgICAgICB9O1xyXG5cdFx0ICAgICAgXHJcblx0XHQgICAgICAvKipcclxuXHRcdCAgICAgICAqIFJldHVybiBAdmFsdWUgdG8gaXQgcmVhbCB2YWx1ZS5cclxuXHRcdCAgICAgICAqL1xyXG5cdFx0ICAgICAgdmFyIHVubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHQgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xyXG5cdFx0ICAgICAgfTtcclxuXHRcdCAgICAgIFxyXG5cdFx0ICAgICAgLyoqXHJcblx0XHQgICAgICAgKiBQYXJzZXIgd2hvIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgbmdNb2RlbFxyXG5cdFx0ICAgICAgICogYmVmb3JlIHRoZSBnb2VzIHRvIERPTS4gVGhhdCBpcyB0aGUgcmVhbCBuZ01vZGVsIHZhbHVlLlxyXG5cdFx0ICAgICAgICovXHJcblx0XHQgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHQgICAgICAgIHJldHVybiB1bm1hc2tWYWx1ZSh2YWx1ZSk7XHJcblx0XHQgICAgICB9O1xyXG5cclxuXHRcdCAgICAgIG5nTW9kZWwuJHBhcnNlcnMucHVzaChwYXJzZXIpO1xyXG5cdFx0ICAgICAgXHJcblx0XHQgICAgICAvKipcclxuXHRcdCAgICAgICAqIEV2ZXJ5dGltZSB0aGUgaW5wdXQgc3VmZmVyIGEgY2hhbmdlLFxyXG5cdFx0ICAgICAgICogdGhlIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdCBhbmQgbWFza1xyXG5cdFx0ICAgICAgICogYWxsIHRoZSB0eXBlZCBjb250ZW50LlxyXG5cdFx0ICAgICAgICovXHJcblx0XHQgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHQgICAgICBcdGlmKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG5cclxuXHRcdCAgICAgICAgdmFyIG1hc2tlZFZhbHVlID0gbWFza1ZhbHVlKHZhbHVlKTtcclxuXHRcdCAgICAgICAgXHJcblx0XHQgICAgICAgIGlmKG1hc2tlZFZhbHVlICE9IHZhbHVlKSB7XHJcblx0XHQgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1hc2tlZFZhbHVlKTtcclxuXHRcdCAgICAgICAgICBuZ01vZGVsLiRyZW5kZXIoKTtcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0ICAgICAgfSk7XHJcblx0XHQgICAgfVxyXG5cdFx0ICB9O1xyXG5cdFx0fV0pO1xyXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==