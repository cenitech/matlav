function OrdensController($scope, $rootScope, $filter) {
  var vm = this;

  // métodos
  vm.renderizarOrdens = renderizarOrdens;
  vm.incluirOS = incluirOS;
  vm.pagina = 1;

  // variáveis
  vm.ordens = [];
  vm.soma = 0;

  // estáticos
  $scope.$on('$viewContentLoaded', vm.renderizarOrdens);

  $scope.$watch('vm.pagina', function(newValue, oldValue) {
    vm.renderizarOrdens();
  });


  function renderizarOrdens() {
    process.mainModule.exports.app.ordem.listarOrdens(vm.pagina)
      .then(function(ordens) {
        vm.ordens = ordens;
        vm.soma = ordens.map(function(val) {
          return Number(val.totGeral ? val.totGeral : val.totalGeral);
        }).reduce(function(a, b) {
          return a + b;
        });

        $scope.$apply();
      });
  }

  function incluirOS() {
    $rootScope.$emit('modal', {
      url: 'partials/incluirOS-modal.html'
    });
  }
}
