function MatlavController($scope, $rootScope) {
  var vm = this;

  vm.modalUrl = '';

  $rootScope.$on('modal', function(event, args) {
    vm.modalUrl = args.url;
  });

  // enums e objetos
  $rootScope.TipoServicoEnum = TipoServicoEnum;
  $rootScope.UnidadeEnum = UnidadeEnum;
}