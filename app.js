(function(){
	var S = require('string');
	var N = require('numeral');
	var Datastore = require('nedb');
	var printer = require('printer');
	var Q = require('q');
	var gui;

	exports.init = function () {
		console.log('initializing...');
		gui = window.require('nw.gui');
		// do necessary things with nw.gui module, if called directly, like module nedb, main window closes (nwbuild) or throw an error similar to: 'module not found'
		
		// set language to pr-br for numeral module
		N.language('pt-br', require('numeral/languages/pt-br.js'));
		N.language('pt-br');

		console.log('initializing database at: ' + gui.App.dataPath);
		app.clientes = new Datastore({ filename: gui.App.dataPath + '/clientes.db', autoload: true, corruptAlertThreshold: 0 });
		app.ordens = new Datastore({ filename: gui.App.dataPath + '/ordens.db', autoload: true, corruptAlertThreshold: 0 });
		app.servicos = new Datastore({ filename: gui.App.dataPath + '/servicos.db', autoload: true, corruptAlertThreshold: 0 });
		console.log('done!');

		app.servicos.count({}, function (err, count) {
			if (count == 0) {
				app.servicos.insert({
					tipo: 'kg',
					titulo: 'Roupa a KG',
					descricao: 'Roupa a KG',
					unidade: 'kg',
					quantidade: 1,
					preco: 14.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Lavar, Secar e Passar', valor: 14.90},
					{descricao: 'Lavar e Secar', valor: 9.90},
					{descricao: 'Só Passar', valor: 7.90},
					{descricao: 'Só Secar', valor: 7.90}
					]
				});
				app.servicos.insert({
					tipo: 'camisa',
					titulo: 'Camisa Social',
					descricao: 'Camisa Social',
					unidade: 'unitario',
					quantidade: 1,
					preco: 8.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Lavar, Secar e Passar', valor: 8.90},
					{descricao: 'Só Passar', valor: 7.50}
					],
					adicionais: [
					{descricao: 'Dobradas', valor: 0.90},
					{descricao: 'Engomadas', valor: 1.50}
					]
				});
				app.servicos.insert({
					tipo: 'calca',
					titulo: 'Calça Social',
					descricao: 'Calça Social',
					unidade: 'unitario',
					quantidade: 1,
					preco: 8.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Lavar, Secar e Passar', valor: 8.90},
					{descricao: 'Só Passar', valor: 7.50}
					],
					adicionais: [
					{descricao: 'Dobradas', valor: 0.90},
					{descricao: 'Vinco', valor: 0.00}
					]
				});
				app.servicos.insert({
					tipo: 'terno',
					titulo: 'Terno',
					descricao: 'Terno',
					unidade: 'unitario',
					quantidade: 1,
					preco: 29.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Lavar, Secar e Passar', valor: 29.90},
					{descricao: 'Só Passar', valor: 19.90}
					]
				});
				app.servicos.insert({
					tipo: 'casaco',
					titulo: 'Casaco',
					descricao: 'Casaco',
					unidade: 'unitario',
					quantidade: 1,
					preco: 20.90,
					prazo: 3,
					opcoes: [
					{descricao: 'Curto', valor: 20.90},
					{descricao: 'Médio', valor: 24.90},
					{descricao: 'Grande', valor: 29.90}
					]
				});
				app.servicos.insert({
					tipo: 'vestido',
					titulo: 'Vestido Simples',
					descricao: 'Vestido Simples',
					unidade: 'unitario',
					quantidade: 1,
					preco: 8.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Pequeno', valor: 8.90},
					{descricao: 'Médio', valor: 12.90},
					{descricao: 'Grande', valor: 14.90}
					]
				});
				app.servicos.insert({
					tipo: 'edredon',
					titulo: 'Edredon',
					descricao: 'Edredon',
					unidade: 'unitario',
					quantidade: 1,
					preco: 21.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Solteiro', valor: 21.90},
					{descricao: 'Casal', valor: 25.90},
					{descricao: 'Queen', valor: 29.90},
					{descricao: 'King', valor: 35.90}
					]
				});
				app.servicos.insert({
					tipo: 'cobertor',
					titulo: 'Cobertor',
					descricao: 'Cobertor',
					unidade: 'unitario',
					quantidade: 1,
					preco: 19.90,
					prazo: 2,
					opcoes: [
					{descricao: 'Solteiro', valor: 19.90},
					{descricao: 'Casal', valor: 21.90},
					{descricao: 'Queen', valor: 25.90},
					{descricao: 'King', valor: 32.90}
					],
					adicionais: [
					{descricao: 'Cobertor de lã', valor: 14.00}
					]
				});
				app.servicos.insert({
					tipo: 'outros',
					titulo: 'Outros',
					descricao: 'Outros',
					unidade: 'unitario',
					quantidade: 1,
					preco: 0.00,
					prazo: 2
				});
			}
		});

		var w = gui.Window.get();
		w.show();
		w.maximize();
}

var app = {
	ordem: {
		gerarNumero: function (callback) {
			app.ordens.find({}).sort({numero: -1}).limit(1).exec(function (err, docs) {
				if (docs.length == 0) {
					callback(10001);
				} else {
					callback(Number(docs[0].numero) + 1);
				}
			});
		},
		salvarEGerarOrdem: function(os) {
			return Q.nfcall(app.ordens.count.bind(app.ordens), {numero: os.numero})
			.then(function (result) {
				if (result == 0) {
					var cliente = {nome: os.cliente, telefone: os.telefone, endereco: os.endereco, email: os.email};
					return Q.nfcall(app.clientes.insert.bind(app.clientes), cliente);
				} else {
					throw new Error('Número de OS já existente. Favor abrir uma nova OS. (' + os.numero + ')');
				}
			})
			.then(function(newDoc) {
				os.cliente = newDoc._id;
				return Q.nfcall(app.ordens.insert.bind(app.ordens), os)
				.then(function(os) {
					return {os: os, cliente: newDoc};
				});
			});

			/*app.clientes.update({ telefone: telefone }, { $set: { nome: cliente, endereco: endereco } }, { multi: true }, function (err, numReplaced) {
				  // numReplaced = 3
				  // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
				});
				
				app.clientes.find({ telefone: telefone }, function (err, docs) {
				  // docs is an array containing documents Mars, Earth, Jupiter
				  // If no document is found, docs is equal to []
				  console.log(docs[0]);
				});
				
				// Remove multiple documents
				app.clientes.remove({ telefone: telefone }, { multi: true }, function (err, numRemoved) {
				  // numRemoved = 3
				  // All planets from the solar system were removed
				});*/
		},
imprimirOS: function(os, cliente, data, hora, via) {

	var txtOrdem = "\
LAVANDERIA FARIAS - 41 3015-5900\n\
Mateus Leme 2987 - Curitiba/PR\n\n\
Ordem: {numero} - {data}-{hora} \n\
Cliente: {nome}                 \n\
Telefone: {telefone}            \n\
Endereco: {endereco}          \n\n\
ITENS ==================== R$/un\n\
{itens}                         \n\
================================\n\
TOTAL: {total} - {pgto}       \n\n\
{observacoes}                 \n\n\
Acesse                          \n\
www.lavanderiafarias.com.br     \n\
e acompanhe seu pedido online.  \n\
Preencha a pesquisa e ganhe 10% \n\
de desconto na proxima compra.\n\n\
via {via}             \n\n\n\n\n\n";

	txtOrdem = txtOrdem
	.replace('{numero}', os.numero)
	.replace('{data}', data)
	.replace('{hora}', hora)
	.replace('{nome}', S(cliente.nome).latinise().s)
	.replace('{telefone}', cliente.telefone)
	.replace('{endereco}', S(cliente.endereco).latinise().s)
	.replace('{total}', N(os.totalGeral).format('$0,0.00'))
	.replace('{via}', via);

	var txtItens = '';
	var txtItem = '{quant}x{descricao} {preco} \n';
	for (i in os.itens) {
		txtItens += txtItem.replace('{quant}', N(os.itens[i].quantidade).format('0,0.000')).replace('{descricao}', S(os.itens[i].descricao).truncate(20,' ').latinise().s).replace('{preco}', N(os.itens[i].preco).format('$0,0.00'));
	}

	txtOrdem = txtOrdem.replace('{itens}', txtItens.substring(0,txtItens.length-1));

	if (os.pagamento == 'Não') {
		txtOrdem = txtOrdem.replace('{pgto}', 'A PAGAR');
	} else {
		txtOrdem = txtOrdem.replace('{pgto}', 'PAGO');
	}

	if (os.observacoes) {
		var txtObs = 'obs. ' + os.observacoes;
		if (os.coletar) {txtObs += '\n*COLETAR*'}
			if (os.entregar) {txtObs += '\n*ENTREGAR*'}

				txtOrdem = txtOrdem.replace('{observacoes}', txtObs);
		} else {
			txtOrdem = txtOrdem.replace('{observacoes}', '');
		}
		//console.log(txtOrdem);

				printer.printDirect({data: txtOrdem
					//, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
					, type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
					, success:function(jobID){
						//console.log("sent to printer with ID: "+jobID);
					}
					, error:function(err){console.log(err);}
				});

},
listarOrdens: function(callback) {
				// numero, nome, criadoEm, coletar, entregar, situacao, pgto, total
				var results = [];
				
				app.ordens.find().sort({numero: -1}).exec(function(err, ordens) {
					for (i in ordens) {
						app.ordem.ordemCliente(i, ordens, results, callback);
					}
				});
			},
			listarTelefones: function(val) {
				var deferred = Q.defer();
				app.clientes.find({telefone: new RegExp(val, 'i')}, {telefone: 1}).limit(8).exec(function (err, docs) {
					var telefones = docs.map(function(obj) { return obj.telefone; });
					deferred.resolve(telefones.filter(function(v,i) { return telefones.indexOf(v) == i; }));
				});
				return deferred.promise;
			},
			listarNomesClientes: function(val) {
				var deferred = Q.defer();
				app.clientes.find({nome: new RegExp(val, 'i')}, {nome: 1}).limit(8).exec(function (err, docs) {
					var nomes = docs.map(function(obj) { return obj.nome; });
					deferred.resolve(nomes.filter(function(v,i) { return nomes.indexOf(v) == i; }));
				});
				return deferred.promise;
			},
			buscarClientePorTelefone: function(telefone) {
				var deferred = Q.defer();
				app.clientes.findOne({telefone: telefone}, {nome: 1}, function (err, doc) {
					if (doc) {
						deferred.resolve(doc.nome);
					}
				});
				return deferred.promise;
			},
			buscarClientePorNome: function(nome) {
				var deferred = Q.defer();
				app.clientes.findOne({nome: nome}, function (err, doc) {
					if (doc) {
						deferred.resolve(doc);
					}
				});
				return deferred.promise;
			},
			ordemCliente: function(i, ordens, results, callback) {
				app.clientes.findOne({_id: ordens[i].cliente}, {nome: 1}, function (err, cliente) {

					results.push({
						numero: ordens[i].numero,
						nome: cliente.nome,
						//criadoEm: ordens[i].criadoEm,
						coletar: ordens[i].coletar,
						entregar: ordens[i].entregar,
						//situacao: ordens[i].situacao,
						pagamento: ordens[i].pagamento,
						total: typeof ordens[i].totalGeral !== 'undefined' ? ordens[i].totalGeral : ordens[i].totGeral
					});
					
					if (results.length == ordens.length) {
						callback(results);
					}
				});
			},
			testarImpressora: function() {
				printer.printDirect({data: "\n\nTESTE\n\n"
					, type: 'RAW'
					, success:function(jobID){
						console.log("sent to printer with ID: " + jobID);
					}
					, error:function(err){console.log(err);}
				});
			}
		},
		servico: {
			getServico: function (tipo, callback) {
				app.servicos.findOne({tipo: tipo}, function (err, servico) {
					callback(servico);
				});
			}
		}
	}
	exports.app = app;
})();