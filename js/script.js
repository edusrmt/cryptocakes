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

function parseRecipe(recipe, retorno) {
    let hex = (recipe >>> 0).toString(16);

    let massa = parseInt(hex[0]);
    let recheio1 = parseInt(hex[1]);
    let recheio2 = parseInt(hex[2]);
    let cobertura = parseInt(hex[3]);

    let cores = [];
    let receita = '';
    
    if (massa == 15) {
        cores.push('#C72C1B');
        receita += 'Massa de Red Velvet ';
    } else if (massa >= 12) {
        cores.push('#F2C92B');
        receita += 'Massa de cenoura ';
    } else if (massa >= 6) {
        cores.push('#E8D9AF');
        receita += 'Massa de baunilha ';
    } else {
        cores.push('#633839');
        receita += 'Massa de chocolate ';
    }

    if (recheio1 == 15) {
        cores.push('#EFA99C');
        receita += 'recheada com uma camada de morango ';
    } else if (recheio1 >= 12) {
        cores.push('#D69138');
        receita += 'recheada com uma camada de doce de leite ';
    } else if (recheio1 >= 6) {
        cores.push('#EBE0A0');
        receita += 'recheada com uma camada de leite em pó ';
    } else {
        cores.push('#7D4D3E');
        receita += 'recheada com uma camada de brigadeiro ';
    }

    if (recheio2 == 15) {
        cores.push('#EFA99C');
        receita += 'e outra de morango ';
    } else if (recheio2 >= 12) {
        cores.push('#D69138');
        receita += 'e outra de doce de leite ';
    } else if (recheio2 >= 6) {
        cores.push('#EBE0A0');
        receita += 'e outra de leite em pó ';
    } else {
        receita += 'e outra de brigadeiro ';
        cores.push('#7D4D3E');
    }

    if (cobertura == 15) {
        cores.push('#9D604F');
        receita += 'e coberto com ganache.';
    } else if (cobertura >= 12) {
        cores.push('#E8E2D0');
        receita += 'e coberto com chantilly.';
    } else if (cobertura >= 6) {
        cores.push('#F0D893');
        receita += 'e coberto com creme de confeiteiro.';
    } else {
        cores.push('#EAE7E3');
        receita += 'e coberto com merengue.';
    }

    
    return retorno == 0 ? receita : cores;
}

function createSliceSVG(container, sliceId, recipe) {
    let cores = parseRecipe(recipe, 1);
    container.innerHTML = `
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
            y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <g id="XMLID_7482_">
                <g id="XMLID_7481_">
                    <rect id="massa-${sliceId}" x="65.539" y="196.039" style="fill:${cores[0]};" width="390.357" height="207.906" />
                    <rect id="recheio2-${sliceId}" x="65.539" y="331.609" style="fill:${cores[2]};" width="390.357" height="27.603" />
                    <rect id="recheio1-${sliceId}" x="65.539" y="262.493" style="fill:${cores[1]};" width="390.357" height="27.603" />
                    <path id="cobertura-${sliceId}" style="fill:${cores[3]};" d="M475.053,193.947c0,15.367-12.465,27.832-27.833,27.832H99.582
                    c-7.591,0-13.747,6.156-13.747,13.757v168.408H30.192v-188.88c0-18.478,10.165-34.591,25.204-43.036
                    c7.153-4.02,15.4-6.309,24.185-6.298l367.662,0.373c1.753,0,3.472,0.164,5.137,0.482
                    C465.294,169.006,475.053,180.332,475.053,193.947z" />
                </g>
                <path id="prato" style="fill:#ADACB2;" d="M462.125,429.226H49.875c-16.164,0-31.535-7.006-42.138-19.207l-5.776-6.646
                c-4.465-5.137-0.815-13.143,5.991-13.143h496.095c6.806,0,10.455,8.006,5.991,13.143l-5.776,6.646
                C493.66,422.22,478.289,429.226,462.125,429.226z" />
            </g>
        </svg>
    `;
}

async function listarFatias(ids) {
    let table = document.getElementById("slices");
    table.innerText = '';
    ids = Array.from(ids).sort((a, b) => b - a);

    for (let i = 0; i < ids.length; i++){
        let id = ids[i];
        
        var let = await DApp.contracts.Contrato.methods.slices(id).call().then(result => {
            svg = document.createElement("div");
            svg.style.width = '150px';
            svg.style.height = '150px';
            svg.style.margin = '0 auto';
            svg.title = parseRecipe(result['recipe'], 0)
            createSliceSVG(svg, id, result['recipe']);

            let tr = document.createElement("tr");
            tr.className = 'd-flex';

            let td1 = document.createElement("td");
            td1.appendChild(svg);
            td1.className = 'col-2';

            let td2 = document.createElement("td");
            td2.innerText = result["baker"];
            td2.className = 'col-4';

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
