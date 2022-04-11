noCandidates = 10
candidates = [
    "Candidate 1",
    "Candidate 2",
    "Candidate 3",
    "Candidate 4",
    "Candidate 5",
    "Candidate 6",
    "Candidate 7",
    "Candidate 8",
    "Candidate 9",
    "Candidate 10",
];

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
    state = await getElectionsState(); // do something

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

async function getResults() {
    state = await getElectionsState(); // do something

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