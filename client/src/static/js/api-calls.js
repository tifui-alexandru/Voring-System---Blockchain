async function getElectionsState() {
    console.log("entered election state")

    const web3 = await getWeb3();

    console.log("got web3")
    const Ballot = await getContract(web3);

    console.log("got contract")

    state = await Ballot.methods.electionState().call();

    console.log("got state")

    return state;
}

async function callVote(token, voteOption) {
    const web3 = await getWeb3();
    const Ballot = await getContract(web3);

    if (token == '')
        return "The token field is mandatory";

    if (voteOption == '')
        return "You must select a candidate";

    if (allowed_tokens.has() !== true)
        return "Invalid token";

    try {    
        await Ballot.methods.vote(option).send();
    } 
    catch (err) {
        return "You have already voted";
    }

    return "Success";
}

async function getCandidatesNo() {
    const web3 = await getWeb3();
    const Ballot = await getContract(web3);

    candidatesNo = await Ballot.methods.candidatesNo().call();
    return candidatesNo;
}

async function getNthCandidate(candidateIdx) {
    const web3 = await getWeb3();
    const Ballot = await getContract(web3);

    try {
        candidateName = await Ballot.methods.nthCandidate(idx).call();
        return candidateName;
    }
    catch (err) {
        return "Candidate index out of range";
    }
}

async function getNthResult(candidateIdx) {
    const web3 = await getWeb3();
    const Ballot = await getContract(web3);

    try {
        candidateResult = await Ballot.methods.nthNoVotes(idx).call();
        return candidateResult;
    }
    catch (err) {
        return "Candidate index out of range";
    }
}