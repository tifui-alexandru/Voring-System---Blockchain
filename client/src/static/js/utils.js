function getWeb3() {
    return new Web3(Web3.givenProvider);
}

async function getContract(web3) {
    data = await $.getJSON("../contracts/Ballot.json");

    networkId = 5777; // default; change this if needed
    networkAddress = data.networks[networkId]["address"];

    ballot = new web3.eth.Contract(data.abi, networkAddress);

    console.log(data.abi);
    console.log(networkAddress);
    
    return ballot;
}