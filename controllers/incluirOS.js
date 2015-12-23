function IncluirOSController($scope, $rootScope, $timeout, $filter) {
  var vm = this;

  // métodos
  vm.render = render;
  vm.exibirPainel = exibirPainel;
  vm.incluirItem = incluirItem;
  vm.cancelarIncluirItem = cancelarIncluirItem;
  vm.editarItem = editarItem;
  vm.excluirItem = excluirItem;
  vm.calcularItem = calcularItem;
  vm.salvarOrdem = salvarOrdem;
  vm.listarTelefones = listarTelefones;
  vm.listarNomesClientes = listarNomesClientes;
  vm.selecionarTelefone = selecionarTelefone;
  vm.selecionarCliente = selecionarCliente;

  // variáveis
  vm.os = new OS();
  vm.painel = new Painel();

  // estáticos
  $rootScope.$on('modal', vm.render);

  // init
  vm.render();

  function Painel() {
    this.url = 'partials/incluirOS-itens.html';
    this.item = new Item();
    this.edicao;
  }

  function render() {
    // limpa os campos com valores default
    vm.os = new OS();
    vm.painel = new Painel();

    process.mainModule.exports.app.ordem.gerarNumero(function(result) {
      vm.os.numero = Number(result);
      $scope.$apply();
    });
  }

  function exibirPainel(tipo, edicao) {
    vm.painel = new Painel();
    vm.painel.item.tipo = tipo;

    if (tipo == 'mais') {
      vm.painel.url = 'partials/incluirOS-painel-mais.html';
    } else if (tipo == 'outros') {
      vm.painel.url = 'partials/incluirOS-incluirItemOutros.html';
    } else {
      vm.painel.url = 'partials/incluirOS-incluirItem.html';
    }

    process.mainModule.exports.app.servico.getServico(tipo, function(result) {
      if (!edicao) {
        vm.painel.item.descricao = result.descricao;
        vm.painel.item.quantidade = result.quantidade;
        vm.painel.item.preco = result.preco;
        vm.painel.item.adicionais = result.adicionais;

        if (result.opcoes) {
          vm.painel.item.opcoes = result.opcoes;
          vm.painel.item.opcao = vm.painel.item.opcoes[0];
        }
      }

      vm.painel.item.unidade = result.unidade;

      $scope.$apply();
    });
  }

  function incluirItem() {
    var i = vm.os.itens.indexOf(vm.painel.edicao);
    if (i == -1) {
      vm.os.itens.push(vm.painel.item);
    } else {
      vm.os.itens[i] = vm.painel.item;
    }

    calcularOS();
    vm.painel = new Painel();
  }

  function cancelarIncluirItem() {
    vm.painel = new Painel();
  }

  function editarItem(item) {
    exibirPainel(item.tipo, true);

    vm.painel.item = angular.copy(item);
    vm.painel.edicao = item;
  }

  function excluirItem() {
    var i = vm.os.itens.indexOf(vm.painel.edicao);
    vm.os.itens.splice(i, 1);

    calcularOS();
    vm.painel = new Painel();
  }

  function calcularOS() {
    vm.os.totalItens = 0;
    vm.os.totalGeral = 0;

    for (i in vm.os.itens) {
      var item = vm.os.itens[i];
      vm.os.totalItens += (item.quantidade * item.preco);
    }

    vm.os.totalGeral += vm.os.totalItens;
  }

  function calcularItem() {
    if (vm.painel.item.opcao) {
      vm.painel.item.preco = vm.painel.item.opcao.valor;
    }

    if (vm.painel.item.adicionais) {
      for (a in vm.painel.item.adicionais) {
        if (vm.painel.item.adicionais[a].selecionado) {
          vm.painel.item.preco += vm.painel.item.adicionais[a].valor;
        }
      }
    }
  }

  function salvarOrdem() {
    var agora = new Date();
    var data = $filter('date')(agora, 'dd/MM/yyyy');
    var hora = $filter('date')(agora, 'HH:mm');

    $('#myModal').modal('hide');

    process.mainModule.exports.app.ordem.salvarEGerarOrdem(vm.os)
      .then(function(value) {
        process.mainModule.exports.app.ordem.imprimirOS(value.os, value.cliente, data, hora, 'cliente');
        return value;
      })
      .delay(5000)
      .then(function(value) {
        process.mainModule.exports.app.ordem.imprimirOS(value.os, value.cliente, data, hora, 'estabelecimento');
      })
      .fail(function(reason) {
        console.log(reason);
      });
  }

  function listarTelefones(val) {
    var unmasked = val.substr(0, val.search(/\d(?!.*\d)/) + 1);
    return process.mainModule.exports.app.ordem.listarTelefones(unmasked);
  }

  function listarNomesClientes(val) {
    return process.mainModule.exports.app.ordem.listarNomesClientes(val);
  }

  function selecionarTelefone() {
    process.mainModule.exports.app.ordem.buscarClientePorTelefone(vm.os.telefone)
      .then(function(nome) {
        if (nome) {
          vm.os.cliente = nome;
          $scope.$apply();
        }
      });
  }

  function selecionarCliente($item, $model, $label) {
    process.mainModule.exports.app.ordem.buscarClientePorNome(vm.os.cliente)
      .then(function(cliente) {
        if (cliente) {
          vm.os.telefone = cliente.telefone;
          $scope.$apply();
        }
      });
  }
}