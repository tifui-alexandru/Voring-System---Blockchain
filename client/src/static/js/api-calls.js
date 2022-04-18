async function getElectionsState(web3, Ballot, accounts) {
    state = await Ballot.methods.electionState().call()
    return state;
}

async function callVote(voteOption, web3, Ballot, accounts) {
    if (voteOption == '')
        return "You must select a candidate";

    try {    
        console.log(accounts);
        await Ballot.methods.vote(voteOption).send({ from: accounts[0] });
    } 
    catch (err) {
        console.log(err);
        return "You either don't have the right to vote or you voted already";
    }

    return "Success";
}

async function getCandidatesNo(web3, Ballot, accounts) {
    candidatesNo = await Ballot.methods.candidatesNo().call();
    return candidatesNo;
}

async function getNthCandidate(candidateIdx, web3, Ballot, accounts) {
    try {
        candidateName = await Ballot.methods.nthCandidate(candidateIdx).call();
        return candidateName;
    }
    catch (err) {
        console.log(err);
        return "Candidate index out of range";
    }
}

async function getNthResult(candidateIdx, web3, Ballot, accounts) {
    try {
        candidateResult = await Ballot.methods.nthNoVotes(candidateIdx).call();
        return candidateResult;
    }
    catch (err) {
        console.log(err);
        return "Candidate index out of range";
    }
}