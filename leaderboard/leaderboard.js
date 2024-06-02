const URL = "https://rasmusweb.no/hs.php";
const GameID = "MagnusAirHockey44";

const requestOptions = {
    method: "GET",
    headers: {
        Accept: "application/json",
    },
};

let playerArr = [];

// Fetch high scores
async function getRequest(gameId, i) {
    const apiCallPromise = await fetch(URL + "?id=" + gameId, requestOptions);
    const json = await apiCallPromise.json();

    let player = {
        name: json.player,
        hs: json.hs,
        gameID: gameId,
    };

    playerArr.push(player);
}

// Fetch and display high scores
async function pullNames() {
    for (let i = 0; i < 5; i++) {
        await getRequest(GameID + i, i);
    }

    playerArr.sort((a, b) => b.hs - a.hs);
    displayScores();
}

// Display high scores
function displayScores() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    playerArr.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.hs}`;
        playerList.appendChild(li);
    });
}

window.onload = () => {
    pullNames();
};

document.getElementById("tilForside").addEventListener("click", function(){
    document.location = "../forside/forside.html";
});
