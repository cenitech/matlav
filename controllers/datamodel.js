// enums
var TipoServicoEnum = Object.freeze({
    KG: 'kg',
    CAMISA: 'camisa',
    CALCA: 'calca',
    TERNO: 'terno', 
    CASACO: 'casaco',
    VESTIDO: 'vestido',
    EDREDON: 'edredon',
    COBERTOR: 'cobertor',
    OUTROS: 'outros'
});

var UnidadeEnum = Object.freeze({
    KG: 'kg',
    UNITARIO: 'unitario'
});

// objetos
function OS() {
    this.numero = 10001;
    this.telefone = '';
    this.cliente = '';
    this.endereco = '';
    this.email = '';
    this.coletar = false;
    this.entregar = false;
    this.observacoes = '';
    this.pagamento = 'Não'
    this.itens = [];
    this.totalItens = 0;
    this.desconto = 0;
    this.coletaEntrega = 0;
    this.totalGeral = 0;
}

function Opcao(descricao, valor) {
    this.descricao = descricao;
    this.valor = valor;
}

function Item() {
    this.tipo;
    this.descricao;
    this.quantidade;
    this.preco;
    this.observacoes;
    this.opcao;
    this.adicionais = [];
}

function Servico() {
    this.tipo;
    this.titulo;
    this.descricao;
    this.unidade;
    this.quantidade;
    this.preco;
    this.prazo;
    this.opcoes = [];
    this.adicionais = [];
}

