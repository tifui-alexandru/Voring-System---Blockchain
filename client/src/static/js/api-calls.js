async function getElectionsState(web3, Ballot, accounts) {
    // const web3 = await getWeb3();
    // const Ballot = await getContract(web3);

    state = await Ballot.methods.electionState().call()

    console.log("got state");

    return state;
}

async function callVote(voteOption, web3, Ballot, accounts) {
    // const web3 = await getWeb3();
    // const accounts = await web3.eth.getAccounts();
    // const Ballot = await getContract(web3);

    if (voteOption == '')
        return "You must select a candidate";

    try {    
        await Ballot.methods.vote(option).send({ from: accounts[0] });
        console.log("sent vote");
    } 
    catch (err) {
        return "You either don't have the right to vote or you voted already";
    }

    return "Success";
}

async function getCandidatesNo(web3, Ballot, accounts) {
    // const web3 = await getWeb3();
    // const Ballot = await getContract(web3);

    candidatesNo = await Ballot.methods.candidatesNo().call();
    return candidatesNo;
}

async function getNthCandidate(candidateIdx, web3, Ballot, accounts) {
    // const web3 = await getWeb3();
    // const Ballot = await getContract(web3);

    try {
        candidateName = await Ballot.methods.nthCandidate(candidateIdx).call();
        return candidateName;
    }
    catch (err) {
        return "Candidate index out of range";
    }
}

async function getNthResult(candidateIdx, web3, Ballot, accounts) {
    // const web3 = await getWeb3();
    // const Ballot = await getContract(web3);

    try {
        candidateResult = await Ballot.methods.nthNoVotes(candidateIdx).call();
        return candidateResult;
    }
    catch (err) {
        return "Candidate index out of range";
    }
}