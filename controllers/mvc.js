angular.module('matlav1', ['ui.router', 'ui.bootstrap', 'cenitech.angularinputmask', 'cenitech.angularicheck', 'cenitech.selectall', 'cenitech.angulartypeahead', 'ui.utils.masks'])
  .config(configure)
  .controller('MatlavController', ['$scope', '$rootScope', MatlavController])
  .controller('DashboardController', DashboardController)
  .controller('OrdensController', ['$scope', '$rootScope', '$filter', OrdensController])
  .controller('ClientesController', ClientesController)
  .controller('IncluirOSController', ['$scope', '$rootScope', '$timeout', '$filter', IncluirOSController])
  .run(runBlock);

configure.$inject = ['$stateProvider'];
runBlock.$inject = ['$rootScope', '$timeout', '$state'];

function configure($stateProvider) {
  $stateProvider
    .state('index', {
        url: "/",
        views: {
            "content": {
                templateUrl: "partials/dashboard.html",
                controller: 'DashboardController'
            }
        }
    })
    .state('ordens', {
        url: "/ordens",
        views: {
            "content": {
                templateUrl: "partials/ordens.html",
                controller: 'OrdensController',
                controllerAs: 'vm'
            }
        }
    })
    .state('clientes', {
        url: "/clientes",
        views: {
            "content": {
                templateUrl: "partials/clientes.html",
                controller: 'ClientesController'
            }
        }
    });
}

function runBlock($rootScope, $timeout, $state) {
  $timeout(function() {
    $.AdminLTE.start();
    process.mainModule.exports.init();

    $state.go("ordens");
    $("a[data-menuitem='ordens']").click();
  });
}