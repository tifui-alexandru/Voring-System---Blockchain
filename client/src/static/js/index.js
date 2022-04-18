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
    console.log(web3);

    if (web3 === undefined) {
        web3 = await getWeb3();
        console.log("got web3");
    
        Ballot = await getContract(web3);
        console.log("got contract");
    
        accounts = await web3.eth.getAccounts();
        console.log("got accounts");
    }
}

async function vote() {
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

async function getAdmin() {
    await connectToContract();

    amIAdmin = await checkAdmin(web3, Ballot, accounts);

    if (amIAdmin !== true) {
        alert("You are not admin!");
        window.location.href = "../index.html";
    }
}

async function grantAccess() {
    walletAddress = document.getElementById('address').value;

    state = await getElectionsState(web3, Ballot, accounts); 

    if (state !== "not started") {
        alert("You cannot grant access anymore");
    }
    else {
        response = await callGrantAccess(walletAddress, web3, Ballot, accounts);
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

async function startVoting() {
    state = await getElectionsState(web3, Ballot, accounts); 

    if (state !== "not started") {
        alert("The election already started");
    }
    else {
        response = await callStartVoting(web3, Ballot, accounts);
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

async function endVoting() {
    state = await getElectionsState(web3, Ballot, accounts); 

    if (state !== "in progress") {
        alert("The election is not in progress");
    }
    else {
        response = await callEndVoting(web3, Ballot, accounts);
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

async function getVotes() {
    await connectToContract();

    state = await getElectionsState(web3, Ballot, accounts); 

    if (state === "finished") {
        alert("The voting has finished. You cannot vote anymore.");
        window.location.href = "../index.html";
    }
    else if (state === "not started") {
        alert("The voting did not start yet");
        window.location.href = "../index.html";
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

        resultContainer = document.getElementById("results-container");

        totalVotes = 0
        for (let i = 0; i < noCandidates; ++i)
            totalVotes += number(await getNthResult(i, web3, Ballot, accounts));
    
        for (let i = 0; i < noCandidates; ++i) {
            candidateName = await getNthCandidate(i, web3, Ballot, accounts);
            candidateResult = number(await getNthResult(i, web3, Ballot, accounts));
    
            candidateResult = 100 * (candidateResult / totalVotes);

            
            newCandidateResult = createCandidateResult(candidateResult, candidateName);
    
            resultContainer.appendChild(newCandidateResult);
        }
    }
}

function createCandidateResult(result, name) {
    // <li class="list-group-item d-flex justify-content-between align-items-center" id="element-to-clone">
    //     <p id="name1">Candidate</p>
    //     <span class="badge badge-primary badge-pill" id="results1">0%</span>
    // </li>

    li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center"

    p = document.createElement('p')
    p.innerText = name

    span = document.createElement('span')
    span.innerText = result
    span.className = "badge badge-primary badge-pill"

    li.appendChild(p);
    li.appendChild(span);

    return li;
}