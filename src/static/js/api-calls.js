candidatesNo = 10;

async function callVote(token, voteOption) {
    if (token == '')
        return "The token field is mandatory";

    if (voteOption == '')
        return "You must select a candidate";

    const postData = {
        "token": token,
        "option": voteOption
    }

    const response = await fetch("/vote", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.body;
}

async function getNthCandidate(candidateIdx) {
    const getData = {
        'idx': candidateIdx
    }

    const response = await fetch("/nth_candidate", {
        method: "GET",
        body: JSON.stringify(getData),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.body;
}

async function getNthResult(candidateIdx) {
    const getData = {
        'idx': candidateIdx
    }

    const response = await fetch("/nth_result", {
        method: "GET",
        body: JSON.stringify(getData),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.body;
}

async function getElectionsState() {
    const response = await fetch("/state", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.body;
}