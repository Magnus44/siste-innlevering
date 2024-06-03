// Display high scores
function displayScores(number) {
    document.getElementById("li" + number).innerText = playerArr[number].name + ": " + playerArr[number].hs
    
}

setTimeout(function() {
    for(j = 0; j < 5; j++)
        {displayScores(j)}
}, 2000)



document.getElementById("tilForside").addEventListener("click", function(){
    document.location = "../forside/forside.html";
});
