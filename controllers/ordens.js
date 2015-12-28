function OrdensController($scope, $rootScope, $filter) {
  var vm = this;

  // métodos
  vm.renderizarOrdens = renderizarOrdens;
  vm.incluirOS = incluirOS;

  // variáveis
  vm.ordens = [];
  vm.soma = 0;
  vm.pagina = 1;
  vm.total = 0;
  vm.somaGeral = 0;

  // estáticos
  $scope.$on('$viewContentLoaded', vm.renderizarOrdens);

  $scope.$watch('vm.pagina', function(newValue, oldValue) {
    vm.renderizarOrdens();
  });


  function renderizarOrdens() {
    process.mainModule.exports.app.ordem.listarOrdens(vm.pagina)
      .then(function(result) {
        vm.ordens = result.ordens;
        vm.soma = result.ordens.map(function(val) {
          return Number(val.totalGeral);
        }).reduce(function(a, b) {
          return a + b;
        });

        vm.total = result.total;
        vm.somaGeral = result.somaGeral;

        $scope.$apply();
      });
  }

  function incluirOS() {
    $rootScope.$emit('modal', {
      url: 'partials/incluirOS-modal.html'
    });
  }
}
