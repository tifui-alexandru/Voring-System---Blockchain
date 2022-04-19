function getWeb3() {
    return new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                let web3 = new Web3(Web3.givenProvider);

                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    resolve(web3);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                reject("Please install MetaMask");
            }
        })
    })
}

async function getContract(web3) {
    data = await $.getJSON("../contracts/Ballot.json");

    networkId = 5777; // default; change this if needed
    networkAddress = data.networks[networkId]["address"];

    ballot = new web3.eth.Contract(data.abi, networkAddress);
    
    return ballot;
}