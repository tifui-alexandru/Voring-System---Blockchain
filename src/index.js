import Web3 from 'web3';

const express = require('express')
const path = require('path')
const app = express()
const web3 = new Web3(window.ethereum);

await window.ethereum.enable();

const contract_abi = 0;
const contract_address = 0;

const Ballot = web3.eth.Contract(contract_abi, contract_address);

allowed_tokens = new Set([
    '0EhldoQ5hNncHfZRvITI',
    'cEiSTp2yuXn9j961VimT',
    '7XTbvbpoUSIpMSa7Oxf1',
    'DIBhlzP7uaVEVWbs0rQD',
    'CGBX2vNyJpOPLfb1ska7',
    'ThlncY8OEcRJeZz3jfRx',
    'YMFMBIlxKhvTNh9RnBzG',
    'EYwuF9LdPgzej1LaIk0A',
    'G16mFNVSm8TwVomXDhFG',
    '5fTmYgiN6LLEZ9z1XOr4',
    'Hodwsb82g6qcblP8jOHe',
    'M3gerpD7M5aK1w7QKIWg',
    'FuI1zGhjcXj0LHPdv7Z7',
    'kEXEzqNmb4miobUwWcUm',
    'K6kgya69kFAcvfQSmQuV',
    'WneNjbYVyJ0ZDmlvqAJZ',
    'yMjeLEghCap8cx1EAzBR',
    'HxAguWGuPGREBzXPo9ty',
    'wlaTne7MYMLj3JqNsvkS',
    'BuQAn1EZ53CE3qDz0BoQ',
]);

app.post('/vote', (req, res) => {
    token = req.body['token'];
    option = req.body['option'];

    if (allowed_tokens.has() !== true)
        res.send("Invalid token");

    try {    
        Ballot.methods.vote(option).send()
    } 
    catch (err) {
        res.send("You have already voted");
    }

    res.send("Success")
});

app.get('/nth_candidate', (req, res) => {
    idx = req.body['idx'];

    try {
        candidateName = Ballot.methods.nthCandidate(idx).call();
        res.send(candidateName);
    }
    catch (err) {
        res.send("Candidate index out of range");
    }
});

app.get('/nth_result', (req, res) => {
    idx = req.body['idx'];

    try {
        candidateName = Ballot.methods.nthNoVotes(idx).call();
        res.send(candidateName);
    }
    catch (err) {
        res.send("Candidate index out of range");
    }
});

app.get('/state', (req, res) => {
    try {
        state = Ballot.methods.electionState().call();
        res.send(state);
    }
    catch (err) {
        res.send("An error occured");
    }
});

const ip = 'localhost'
const port = '3000'

app.use(express.static(path.join(__dirname, 'static')));
app.listen(port, () => {
    console.log(`App started at: http://${ip}:${port}`)
});