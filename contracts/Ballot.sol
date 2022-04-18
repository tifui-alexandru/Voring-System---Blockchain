// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Ballot {
    // * struct types
    struct Voter {
        address identifier;
        uint choice;
    }
    struct Candidate {
        string name;
        uint numVotes;
    }

    // * public variables
    address public chairperson;
    string public title;
    Candidate[] public candidatesList;

    enum VoterState {NotGranted, Granted, Voted}
    mapping(address => VoterState) public alreadyVoted;

    enum VotingState {Registered, Progress, Completed}
    VotingState public state;

    // * modifiers
    // only chairperson can grant voters
    modifier isChairperson(){
        require(msg.sender == chairperson, "Only the chairperson is allowed.");
        _;
    }
    // check for a valid voter
    modifier canVote(){
        require(alreadyVoted[msg.sender] != VoterState.Granted, "This person already voted.");
        _;
    }
    // check if state is in progress
    modifier inProgress(){
        require(state == VotingState.Progress);
        _;
    }
    // check if not started
    modifier notStarted(){
        require(state == VotingState.Registered);
        _;
    }
    modifier finished() {
        require(state == VotingState.Completed);
        _;
    }

    // * Constructor
    constructor(string memory _title, string[] memory _candidateList){
        title = _title;
        chairperson = msg.sender;
        for(uint i = 0; i < _candidateList.length; i++){
            candidatesList.push(Candidate({
                name: _candidateList[i],
                numVotes: 0
            }));
        }
        state = VotingState.Registered;
    }
    // * functionalities for chairperson
    function grantVoter(address _voter) public notStarted isChairperson {
        Voter memory v;
        v.identifier = _voter;
        alreadyVoted[_voter] = VoterState.Granted;
    }

    function startBallot() public notStarted isChairperson {
        state = VotingState.Progress;
    }

    function endBallot() public inProgress {
        state = VotingState.Completed;

        // * sort the candidates

        for (uint i = 0; i < candidatesList.length; i++) {
            uint max = 0;
            uint id;
            for(uint j = i; j < candidatesList.length; j++) {
                if(candidatesList[j].numVotes > max) {
                    max = candidatesList[j].numVotes;
                    id = i;
                }
            }

            Candidate memory aux = candidatesList[i];
            candidatesList[i] = candidatesList[id];
            candidatesList[id] = aux;
        }
    }

    // * functionalities for 

    function vote(uint _choice) public inProgress canVote {
        // * check if the choice is in the candidacy list
        require(_choice < candidatesList.length, "There is no choice for this");
        // * add vote
        candidatesList[_choice].numVotes++;
        alreadyVoted[msg.sender] = VoterState.Voted;
    }

    function electionState() public view returns (string memory) {
        if (state == VotingState.Completed)
            return "finished";
        if (state == VotingState.Progress)
            return "in progress";
        else
            return "not started";
    }

    function candidatesNo() public view returns (uint no_) {
        no_ = candidatesList.length;
    }

    // * at the end of balloot

    function nthCandidate(uint _id) public view finished returns (string memory) {
        require(_id < candidatesList.length, "Candidate index out of range");
        return candidatesList[_id].name;
    }

    function nthNoVotes(uint _id) public view finished returns (uint) {
        require(_id < candidatesList.length, "Candidate index out of range");
        return candidatesList[_id].numVotes;
    }
}