<!-- README template used: https://github.com/othneildrew/Best-README-Template -->

<h3 align="center">Voting System</h3>
  <p align="center">
    Blockchain project
  </p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Cuprins</summary>
  <ol>
    <li>Introducere</li>
    <li>Tehnologii</li>
    <li>Usage</li>
    <li>
        Implementarea sistemului de votare
        <ul>
            <li> Crearea, deschiderea și închiderea alegerilor </li>
        </ul>
    </li>
    <li>Interfața</li>
  </ol>
</details>

## Introducere

Acest proiect cuprinde un sistem de votare implementat folosind tehnologia Blockchain și este creat de: <a href="https://github.com/anacomo">Ana-Maria Comorașu</a>,
<a href="https://github.com/tifui-alexandru/">Alexandru Țifui</a>,
<a href="https://github.com/lauratender">Laura Tender</a>.

Proiectul a fost dezvoltat în cadrul cursului Blockchain din anul al III-lea la Facultatea de Matematică și Informatică, Universitatea din București.

Sistemul de votare permite unui proprietar să își creeze o alegere cu scop sau un titlu și să adauge candidați. Proprietarul este cel care deschide și închide alegerile și cel care trebuie să autorizeze persoanele care participă la vot. Sistemul nostru de votare cuprinde și o interfață pentru a arată progresul alegerilor.

### Tehnologii

* [Solidity](https://docs.soliditylang.org/en/v0.8.13/)
* [Javascript](https://www.javascript.com/)
* [Bootstrap](https://getbootstrap.com/)

### Usage

### Implementarea sistemului de votare

Implementarea sistemului de votare poate fi găsită în fișierul _Ballot.sol_.

* ### Crearea, deschiderea și închiderea alegerilor

Această parte este realizată de *Ana Comorașu* și cuprinde crearea clasei Ballot, constructorul, deschiderea, închiderea și starea alegerilor.

În constructor, alegerea noastră cuprinde un titlu, un proprietar, o listă de candidați și starea votării este marcată ca registered.

```javascript
constructor(string memory _title, bytes32[] memory _candidateList){
    title = _title;
    chairperson = msg.sender;
    for(uint i = 0; i < _candidateList.length; i++){
        candidatesList.push(Candidate({
            name: _candidateList[i],
            numVotes: 0
        }));
    }
       
```

Votarea poate avea trei stări: nu a început (registered), în desfășurare, încheiată. Verificarea stărilor are loc prin modifierii: inProgress, notStarted, finished. Funcția startBallot deschide alegerile, iar funcția endBallot le încheie.

```javascript
  function startBallot() public notStarted isChairperson {
      state = VotingState.Progress;
  }

  function endBallot() public inProgress {
      state = VotingState.Completed;
  }
```

* ### Verificarea dreptului de proprietar și autorizarea votanților

Această parte este realizată de *Laura Tender*.

Verificarea dreptului de proprietar este implementată cu ajutorul modifierului isChairperson, prin care ne asigurăm că senderul este persoană care a creat alegerile. Aceast modifier este folosit pentru deschiderea și închiderea alegerilor, cât și pentru autorizarea votanților.

```javascript
  modifier isChairperson(){
      require(msg.sender == chairperson, "Only the chairperson is allowed.");
      _;
  }
```

Un votant se află în una dintre stările: neautorizat (NotGranted), autorizat(granted) și care a votat deja (Voted). Votanții sunt reținuți într-un dincționar în care cheia este adresa lor, iar valoarea este starea sa.Autorizarea unui votant are loc în funcția grantVoter prin care votantul este adăugat în dicționar cu starea granted.

```javascript
  function grantVoter(address _voter) public notStarted isChairperson {
      Voter memory v;
      v.identifier = _voter;
      alreadyVoted[_voter] = VoterState.Granted;
  }
```

* ### Votarea și câștigarea alegerilor

Această parte este realizată de *Alexandru Țifui*.

Votarea are loc prin funcția vote, dacă alegerile sunt încă în desfășurare și dacă persoană are drept de vot. Odată ce este condiții sunt îndeplinite, verificăm că opțiunea de vot este una validă, creștem cu un vot numărul de voturi pentru acest candidat și schimbăm starea votantului din Granted în Voted.

```javascript
  function vote(uint _choice) public inProgress canVote {
      // * check if the choice is in the candidacy list
      require(_choice < candidatesList.length, "There is no choice for this");
      // * add vote
      candidatesList[_choice].numVotes++;
      alreadyVoted[msg.sender] = VoterState.Voted;
  }
```

Funcțiile winningId și winningCandidate returnează id-ul, respectiv numele candidatului câștigător. Acestea rulează dacă alegerile s-au terminat și caută în lista candidaților pe cel cu număr maxim de voturi.

```javascript
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
```

### Interfața