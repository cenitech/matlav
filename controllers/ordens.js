function OrdensController($scope, $rootScope, $filter) {
  var vm = this;

  vm.renderizarOrdens = renderizarOrdens;
  vm.incluirOS = incluirOS;

  $scope.$on('$viewContentLoaded', vm.renderizarOrdens);
  
  function renderizarOrdens() {
    $('#tabelaOS').empty();
    $('#soma').text('0,00');
    
    process.mainModule.exports.app.ordem.listarOrdens(function(result) {
      var html = '\
        <tr>\
                    <td>{numero}</td>\
                    <td>{nome}</td>\
                    <td><span class="label label-default">{coletar}</span> / <span class="label label-default">{entregar}</span></td>\
                    <td><span class="label label-primary">{pagamento}</span></td>\
                    <td>{total}</td>\
                  </tr>\
      ';
      
      
      // var ordem = {numero: numero, coletar: coletar, entregar: entregar, observacoes: observacoes, pagamento: pagamento, situacao: 'em aberto', itens: itens,
      //totItens: totItens, desconto: desconto, totGeral: totGeral, criadoEm: hoje, cliente: newDoc._id};
      var soma = 0;
      for (i in result) {
        soma += Number(result[i].total);
        var row = html
          .replace('{numero}',result[i].numero)
          .replace('{nome}',result[i].nome)
          .replace('{coletar}',result[i].coletar ? 'Sim' : 'Não')
          .replace('{entregar}',result[i].entregar ? 'Sim' : 'Não')
          .replace('{pagamento}',result[i].pagamento)
          .replace('{total}', $filter('currency')(result[i].total));
          
        $('#tabelaOS').append(row);
      }
      $('#soma').text($filter('currency')(soma));
    });
  }

  function incluirOS() {
    $rootScope.$emit('modal', {url: 'partials/incluirOS-modal.html'});
  }
}