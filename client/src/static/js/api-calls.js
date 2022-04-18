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

async function checkAdmin(web3, Ballot, accounts) {
    adminState = await Ballot.methods.checkOwner().call();

    console.log(adminState);
    console.log(accounts[0]);


    return adminState;
}

async function grantAccess(address, web3, Ballot, accounts) {
    try {
        await Ballot.methods.grantVoter(address).call([{ from: accounts[0]}]);
        return "Success";
    }
    catch (err) {
        return "An error occured. Check if the wallet address is valid";
    }
}

async function callStartVoting(web3, Ballot, accounts) {
    try {
        await Ballot.methods.startBallot().call();
        return "Success";
    }
    catch (err) {
        return "An unexpected error occured.";
    }
}

async function callEndVoting(web3, Ballot, accounts) {
    try {
        await Ballot.methods.endBallot(candidateIdx).call();
        return "Success";
    }
    catch (err) {
        return "An unexpected error occured."
    }
}