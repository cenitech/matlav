/******************************************
 *                                        *
 * Author: Lucas Ceni                     *
 * Email: lucas.ceni at gmail             *
 * Date: 2015                             *
 * github: https://github.com/cenitech    *
 *                                        *
 ******************************************/

 'use strict';

 angular.module('cenitech.selectall', [])
 .directive('selectall', selectall);

 function selectall($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, controller) {
            var self = $(elem);
            self.on("click", function () {
                self.select();
            });
        }
    };
}