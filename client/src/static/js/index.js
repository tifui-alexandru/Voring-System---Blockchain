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

async function vote() {
    console.log("hello");

    state = await getElectionsState();

    console.log(state);

    if (state === "finished") {
        alert("The voting has finished. You cannot vote anymore.");
    }
    else {
        token = document.getElementById("token").value;

        select = document.getElementById('candidates');
        voteOption = select.options[select.selectedIndex].value;

        response = await callVote(token, voteOption);
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
    state = await getElectionsState(); 
    noCandidates = await getCandidatesNo();

    if (state === "unfinished") {
        alert("The voting is still ongoing. You cannot see the results untul the end of the elections.")
    }
    else {
        totalVotes = 0
        for (let i = 0; i < noCandidates; ++i)
            totalVotes += number(await getNthResult(i));
    
        for (let i = 0; i < noCandidates; ++i) {
            candidateName = await getNthCandidate(i);
            candidateResult = number(await getNthResult(i));
    
            candidateResult = 100 * (candidateResult / totalVotes);
    
            document.getElementById('results' + i).innerText = candidateResult;
            document.getElementById('name' + i).innerText = candidateName;
        }
    }
}