const URL = "https://rasmusweb.no/hs.php"
const GameID = "MagnusAirHockey44"

let currentHS = 0
let currentHSPlayerName = 0

async function getHS() {
    const requestOptions = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    }

    const apiCallPromise = await fetch(URL + "?id=" + GameID, requestOptions)

    // htmlObj.innerHTML = ""
    // appendPElm(htmlObj, "StatusCodeOK: " + apiCallPromise.ok)

    // Getting the json from the response (NOTE: Also await!)
    const json = await apiCallPromise.json()
    console.log(json)
    currentHS = json.hs
    currentHSPlayerName = json.player
    // TODO: Legg til disse i HTML doc på rett sted
    

}

// Poster ny HS til php backend
async function postHS(playerName, hs) {

    postBody = {}
    postBody.id = GameID
    postBody.hs = hs
    postBody.player = playerName

    const apiCallPromise = await fetch(URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: JSON.stringify(postBody),
    })


    //  appendPElm(htmlObj, "StatusCodeOK: " + apiCallPromise.ok)

    // Getting the json from the response:
    const responseJson = await apiCallPromise.json()
    console.log(responseJson)

    // appendPElm(htmlObj, "Response: " + responseJson)
}

