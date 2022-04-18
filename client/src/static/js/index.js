function constructErrorCard(msg) {
    errorCard = document.createElement('div');
    errorCard.className = 'card';
    errorCard.id = 'error-card';
    authResponse = document.createElement('div');
    authResponse.className = 'card-body';
    authMsg = document.createElement('p');
    errorCard.appendChild(authResponse);
    authResponse.appendChild(authMsg);
    authMsg.innerText = msg;
    authMsg.className = 'text-warning';
    return errorCard;
}

let web3 = undefined;
let Ballot = undefined;
let accounts = undefined;

async function connectToContract() {
    if (web3 == undefined) {
        web3 = await getWeb3();
        console.log("got web3");
    
        Ballot = await getContract(web3);
        console.log("got contract");
    
        accounts = await web3.eth.getAccounts();
        console.log("got accounts");
    }
}

async function vote() {
    await connectToContract();

    state = await getElectionsState(web3, Ballot, accounts);

    console.log(state);

    if (state === "finished") {
        alert("The voting has finished. You cannot vote anymore.");
    }
    else if (state === "not started") {
        alert("The voting did not start yet")
    }
    else {
        select = document.getElementById('candidates');
        voteOption = select.options[select.selectedIndex].value;

        response = await callVote(voteOption, web3, Ballot, accounts);
        errorCard = document.getElementById("error-card");

        if (response === "Success") {
            if (errorCard !== null)
                errorCard.parentNode.removeChild(errorCard);
            window.location.replace(apiUrl);
        }
        else {
            if (errorCard === null) {
                errorCard = constructErrorCard(response);
                form = document.getElementById("voteForm");
                form.appendChild(errorCard);
            }
        }
    }
}

async function getResults() {
    await connectToContract();

    state = await getElectionsState(web3, Ballot, accounts); 

    if (state !== "finished") {
        alert("The voting did not end. You cannot see the results until the end of the elections.")
        window.location.href = "../index.html";
    }
    else {
        noCandidates = await getCandidatesNo(web3, Ballot, accounts);

        totalVotes = 0
        for (let i = 0; i < noCandidates; ++i)
            totalVotes += number(await getNthResult(i, web3, Ballot, accounts));
    
        for (let i = 0; i < noCandidates; ++i) {
            candidateName = await getNthCandidate(i, web3, Ballot, accounts);
            candidateResult = number(await getNthResult(i, web3, Ballot, accounts));
    
            candidateResult = 100 * (candidateResult / totalVotes);
    
            document.getElementById('results' + i).innerText = candidateResult;
            document.getElementById('name' + i).innerText = candidateName;
        }
    }
}