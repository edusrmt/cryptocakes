// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0xaAa05172cE60bCF76F6325Bf3DB11B9f3a5a8E7c";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
    DApp.init();
}

// Nosso objeto DApp que irá armazenar a instância web3
const DApp = {
    web3: null,
    contracts: {},
    account: null,

    init: function () {
        return DApp.initWeb3();
    },

    // Inicializa o provedor web3
    initWeb3: async function () {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ // Requisita primeiro acesso ao Metamask
                    method: "eth_requestAccounts",
                });
                DApp.account = accounts[0];
                window.ethereum.on('accountsChanged', DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
            } catch (error) {
                console.error("Usuário negou acesso ao web3!");
                return;
            }
            DApp.web3 = new Web3(window.ethereum);
        } else {
            console.error("Instalar MetaMask!");
            return;
        }
        return DApp.initContract();
    },

    // Atualiza 'DApp.account' para a conta ativa no Metamask
    updateAccount: async function () {
        DApp.account = (await DApp.web3.eth.getAccounts())[0];
        atualizaInterface();
    },

    // Associa ao endereço do seu contrato
    initContract: async function () {
        DApp.contracts.Contrato = new DApp.web3.eth.Contract(abi, contractAddress);
        return DApp.render();
    },

    // Inicializa a interface HTML com os dados obtidos
    render: async function () {
        inicializaInterface();
    },

};

function verFatias(){
    return DApp.contracts.Contrato.methods.balanceOf(DApp.account).call({ from: DApp.account });
}

function comprarBolo() {
    let valor = document.getElementById("valor").value;
    let mensagem = document.getElementById("mensagem").value;
    let valor_wei = 1000000000000000000 * valor;

    return DApp.contracts.Contrato.methods.bakeCake(mensagem).send({ from: DApp.account, value: valor_wei }).then(atualizaInterface);
}

function comerFatia(e) {
    let id_fatia = e.target.value;

    document.getElementById(`destino-${id_fatia}`).readOnly = true;
    document.getElementById(`enviar-${id_fatia}`).disabled = true;
    e.target.disabled = true;
    
    return DApp.contracts.Contrato.methods.eatCake(id_fatia).send({ from: DApp.account }).then(atualizaInterface);
}

function transferirFatia(e) {
    let id_fatia = e.target.value;
    let destino = document.getElementById(`destino-${id_fatia}`).value;

    if (destino) {
        document.getElementById(`destino-${id_fatia}`).readOnly = true;
        document.getElementById(`comer-${id_fatia}`).disabled = true;
        e.target.disabled = true;
        
        return DApp.contracts.Contrato.methods.sendCake(destino, id_fatia).send({ from: DApp.account }).then(atualizaInterface);
    } else {
        alert('Por favor, insira o endereço do destinatário.');
    }    
}

function inicializaInterface() {
    document.getElementById("btnComprar").onclick = comprarBolo;
    atualizaInterface();
}

function parseRecipe(recipe) {
    let hex = (recipe >>> 0).toString(16);

    let massa = parseInt(hex[0]);
    let recheio1 = parseInt(hex[1]);
    let recheio2 = parseInt(hex[2]);
    let cobertura = parseInt(hex[3]);

    let receita = '';
    
    if (massa == 15) {
        receita += 'Massa de Red Velvet ';
    } else if (massa >= 12) {
        receita += 'Massa de cenoura ';
    } else if (massa >= 6) {
        receita += 'Massa de baunilha ';
    } else {
        receita += 'Massa de chocolate ';
    }

    if (recheio1 == 15) {
        receita += 'recheada com uma camada de morango ';
    } else if (recheio1 >= 12) {
        receita += 'recheada com uma camada de doce de leite ';
    } else if (recheio1 >= 6) {
        receita += 'recheada com uma camada de leite em pó ';
    } else {
        receita += 'recheada com uma camada de brigadeiro ';
    }

    if (recheio2 == 15) {
        receita += 'e outra de morango ';
    } else if (recheio2 >= 12) {
        receita += 'e outra de doce de leite ';
    } else if (recheio2 >= 6) {
        receita += 'e outra de leite em pó ';
    } else {
        receita += 'e outra de brigadeiro ';
    }

    if (recheio2 == 15) {
        receita += 'e coberto com ganache.';
    } else if (recheio2 >= 12) {
        receita += 'e coberto com chantilly.';
    } else if (recheio2 >= 6) {
        receita += 'e coberto com creme de confeiteiro.';
    } else {
        receita += 'e coberto com merengue.';
    }

    return receita;
}

async function listarFatias(ids) {
    let table = document.getElementById("slices");
    table.innerText = '';
    ids = Array.from(ids).sort((a, b) => a - b);

    for (let i = 0; i < ids.length; i++){
        let id = ids[i];
        
        var let = await DApp.contracts.Contrato.methods.slices(id).call().then(result => {
            let tr = document.createElement("tr");
            tr.className = 'd-flex';

            let td1 = document.createElement("td");
            td1.innerText = parseRecipe(result['recipe'])
            td1.className = 'col-3';

            let td2 = document.createElement("td");
            td2.innerText = result["baker"];
            td2.className = 'col-3';

            let td3 = document.createElement("td");
            td3.innerText = result["message"];
            td3.className = 'col-2';

            let td4 = document.createElement("td");  
            td4.innerText = result["value"] / 1000000000;
            td4.className = 'col-1';

            let td5 = document.createElement("td");
            td5.className = 'col-3';      

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);

            if (!result["eaten"]) {
                let inp = document.createElement("input");
                inp.id = `destino-${id}`;
                inp.className = 'form-control';
                inp.type = 'text';
                inp.placeholder = 'Destinatário'

                let btn1 = document.createElement("button");
                btn1.className = 'btn btn-primary';
                btn1.id = `enviar-${id}`;
                btn1.type = 'button';
                btn1.value = id;
                btn1.innerText = "Enviar";
                btn1.onclick = transferirFatia;

                let btn2 = document.createElement("button");
                btn2.className = 'btn btn-secondary';
                btn2.id = `comer-${id}`;
                btn2.type = 'button';
                btn2.value = id;
                btn2.innerText = "Comer";
                btn2.onclick = comerFatia;

                td5.appendChild(inp);
                td5.appendChild(btn1);
                td5.appendChild(btn2);
            } else {
                td5.innerText = 'A fatia já foi comida.';
            }            
            
            table.appendChild(tr);
        }); 
    }
}

function atualizaInterface() {
    verFatias().then((result) => {
        document.getElementById("total-fatias").innerHTML = result;
    });

    document.getElementById("endereco").innerHTML = DApp.account;

    DApp.contracts.Contrato.methods.slicesOfOwner(DApp.account).call().then(result => listarFatias(result));
}
