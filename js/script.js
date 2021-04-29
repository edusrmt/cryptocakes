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


function inicializaInterface() {
    atualizaInterface(); 
    DApp.contracts.Contrato.methods.slicesOfOwner(DApp.account).call().then(result => listarFatias(result)); 
    //DApp.contracts.Rifa.events.RifaComprada((error, event) => registraEventos([event]));  
}

function listarFatias(ids) {
    let table = document.getElementById("slices");

    for (let i = 0; i < ids.length; i++){
        let id = ids[i];
        var let = DApp.contracts.Contrato.methods.slices(id).call().then(result => {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerHTML = "<a>" + "Bolo" + "</a>";
            let td2 = document.createElement("td");
            td2.innerHTML = result["message"];
            let td3 = document.createElement("td");  
            td3.innerHTML = result["value"];
            let td4 = document.createElement("td");  
            td4.innerHTML = "<button class='btn btn-primary'  type='button'><i class='fas fa-cloud'></i></button><button class='btn btn-secondary' type='button'><i class='fas fa-cloud'></i></button>";
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            table.appendChild(tr);
        }); 
    }
}

function atualizaInterface() {
    verFatias().then((result) => {
        document.getElementById("total-fatias").innerHTML = result;
    });

}
