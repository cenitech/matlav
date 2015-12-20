/******************************************
 *                                        *
 * Author: Lucas Ceni                     *
 * Email: lucas.ceni at gmail             *
 * Date: 2015                             *
 * github: https://github.com/cenitech    *
 *                                        *
 ******************************************/

'use strict';

angular.module('cenitech.angulartypeahead', [])
    .directive('ctechtypeahead', ctechtypeahead);

function ctechtypeahead($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, controller) {
            $(elem).typeahead({source: function(query, callback) {
                $parse(attrs['typeaheadSource'])(scope)(query).then(function(results) {
                    callback(results);
                });
            }, matcher: function(query) {
                return true;
            }, afterSelect: function() {
                $parse(attrs['typeaheadOnselect'])(scope)();
            }});
        }
    };
}