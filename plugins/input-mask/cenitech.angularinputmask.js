/******************************************
 *                                        *
 * Author: Lucas Ceni                     *
 * Email: lucas.ceni at gmail             *
 * Date: 2015                             *
 * github: https://github.com/cenitech    *
 *                                        *
 ******************************************/

'use strict';

angular.module('cenitech.angularinputmask', [])
    .directive('inputmask', inputmask);

function inputmask($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, controller) {
            $(elem).inputmask();

            var toUpdate = true;
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (toUpdate) {
                    $(elem).val(newValue);
                }
                toUpdate = true;
            });

            
            $(elem).keyup(function(e) {
                if ((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || e.which == 13) {
                    toUpdate = false;
                    controller.$setViewValue(elem.val());
                }
            });

            $(elem).change(function(e) {
                toUpdate = false;
                controller.$setViewValue(elem.val());
            });

            $(elem).blur(function() {
                toUpdate = false;
                if ($(elem).val() == '') {
                    controller.$setViewValue("");
                }
            });
        }
    };
}