/******************************************
 *                                        *
 * Author: Lucas Ceni                     *
 * Email: lucas.ceni at gmail             *
 * Date: 2015                             *
 * github: https://github.com/cenitech    *
 *                                        *
 ******************************************/

'use strict';

angular.module('cenitech.angularicheck', [])
    .directive('icheck', icheck);

function icheck($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, controller) {
            var self = $(elem),
            label = self.next(),
            label_text = label.text(),
            ngModelGetter = $parse(attrs['ngModel']),
            value = $parse(attrs['ngValue'])(scope);

            if (label_text.substring(0,2) == '{{') {
                label_text = label_text.replace('{{', '');
                label_text = label_text.replace('}}', '');
                label_text = $parse(label_text)(scope);
            }

            var toUpdate = true;
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (toUpdate) {
                    if (self.attr('type') === 'checkbox' && attrs['ngModel']) {
                        self.iCheck(newValue ? 'check' : 'uncheck');
                    }
                    if (self.attr('type') === 'radio' && attrs['ngModel']) {
                        self.iCheck(self.val() === newValue ? 'check' : 'uncheck');
                    }
                    self.iCheck('update');
                }
                toUpdate = true;
            });

            label.remove();
            self.iCheck({
              checkboxClass: 'icheckbox_line-blue',
              radioClass: 'icheckbox_line-blue',
              insert: '<div class="icheck_line-icon"></div>' + label_text
            }).on('ifChanged', function(event) {
                toUpdate = false;
                if (self.attr('type') === 'checkbox' && attrs['ngModel']) {
                    scope.$apply(function() {
                        return ngModelGetter.assign(scope, event.target.checked);
                    });
                }
                if (self.attr('type') === 'radio' && attrs['ngModel']) {
                    return scope.$apply(function() {
                        return ngModelGetter.assign(scope, value);
                    });
                }
                if (attrs['ngClick']) {
                    scope.$apply(function() {
                        $parse(attrs['ngClick'])(scope);
                    });
                }
            });

            $('.icheckbox_line-blue').css('margin-right', '5px');
        }
    };
}