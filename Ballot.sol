// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Ballot {
    // * struct types
    struct Voter {
        address identifier;
        uint choice;
    }
    struct Candidate {
        bytes32 name;
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
    constructor(string memory _title, bytes32[] memory _candidateList){
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
    }

    // * functionalities for 
    function vote(uint _choice) public inProgress canVote {
        // * check if the choice is in the candidacy list
        require(_choice < candidatesList.length, "There is no choice for this");
        // * add vote
        candidatesList[_choice].numVotes++;
        alreadyVoted[msg.sender] = VoterState.Voted;
    }

    // * at the end of balloot
    function winningId() public view finished returns (uint id_) {
        uint max = 0;
        for(uint i = 0; i < candidatesList.length; i++) {
            if(candidatesList[i].numVotes > max) {
                max = candidatesList[i].numVotes;
                id_ = i;
            }
        }
    }

    function winningCandidate() public view finished returns (bytes32 name_) {
        uint max = 0;
        uint id;
        for(uint i = 0; i < candidatesList.length; i++) {
            if(candidatesList[i].numVotes > max) {
                max = candidatesList[i].numVotes;
                id = i;
            }
        }
        name_ = candidatesList[id].name;
    }
}