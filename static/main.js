function generateQuestion(){
    let random_num = getRandomInt(4);
    console.log(random_num);
    switch(random_num) {
        case 0:
            return soundSeqQuestion();
        case 1:
            return letterSeqQuestion();
        case 2:
            return guessLetterQuestion();
        case 3:
            return guessWordQuestion();
        default:
            throw new Error("question generator fell to default");
    }
}
function soundSeqQuestion(){
    let letter = letters[getRandomInt(8) + 1]
    return {
        "prompt": "Listen Here.",
        "instructions": "Tap the buttons below to write out the sequence",
        "answer": letter["letter"],
        "data": letter,
        "type": "soundSeq",
    };
}
function letterSeqQuestion() {
    let letter = letters[getRandomInt(8) + 1]
    return {
        "prompt": "What letter is this?",
        "instructions": "",
        "answer": letter["letter"],
        "data": letter,
        "type": "letterSeq",
    };
}
function guessLetterQuestion() {
    let letter = letters[getRandomInt(8) + 1]
    return {
        "prompt": "",
        "instructions": "Tap the buttons below to write out the sequence for the corresponding letter.",
        "answer": letter["code"],
        "audio": letter["link"],
        "type": "guessLetter"
    };
}
function guessWordQuestion() {
    let word = words[getRandomInt(8) + 1]
    return {
        "prompt": "What word is this?",
        "instructions": "Tap the buttons below to write out the sequence for the corresponding word",
        "answer": word,
        "audio": "",
        "type": "wordGuess"
    };
}

function displayQuestion(question) {
    let {type} = question
    switch(type){
        case "soundSeq":
            displaySoundSeq(question);
            break;
        case "letterSeq":
            displayLetterSeq(question);
            break;
        case "guessLetter":
            displayGuessLetter(question);
            break;
        case "guessWord":
            displayGuessWord(question);
            break;
        default:
            throw new Error("display generator fell to default");
    }
}
function displaySoundSeq(question) {
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1><audio controls src="${question["data"]["link"]}"></div>`)
    $('#middle-row').append(createDashButton());
    $('#middle-row').append(createDotButton());
    $('.dash-btn, .dot-btn').click(checkAnswer);
}
function createDashButton(){
    return `<div><button class="dash-btn">DASH<div><div></button></div>`
}
function createDotButton() {
    return `<div><button class="dot-btn"><div>DOT<div></button></div>`
}
function displayLetterSeq(question) {

}
function displayGuessLetter(question){

}
function displayGuessWord(question){

}

function checkAnswer(){
    console.log("clicked");
}

function displayResults(result){
    $('#upper-row').append(endingBanner(result))
}

function endingBanner(result){
    let messages = [
        "This can definitely be hard! Keep trying!",
        "All you need is a little review!",
        "That's a start, you'll be a master in no time.",
        "That's great, you're master it before you know it.",
        "Congrats, more than half way to perfect!",
        "You're doing great, just a little more!",
        "Congratulations, almost perfect!",
        "Congrats, you made this look easy!" 
    ];
    return `<h1 class="results-banner">${messages[result]} You Scored ${result}/7 <h1>`
}
function sendJsonRequest(data) {
    $.ajax({
      type: "POST",
      url: '/update',
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (result) {
        score=result["score"]
      },
      error: function (request, status, error) {
        console.log("Error");
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}