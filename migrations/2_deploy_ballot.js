const Ballot = artifacts.require("Ballot");

const electionTitle = "USA Election 1904";
const candidates = [
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

module.exports = function (deployer) {
    deployer.deploy(Ballot, electionTitle, candidates);
};