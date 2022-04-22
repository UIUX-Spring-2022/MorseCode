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
    let letter = letters[getRandomInt(8)]
    return {
        "prompt": "Listen Here.",
        "instructions": "Tap the buttons below to write out the sequence",
        "answer": letter["code"].replace(/\s/g, ''),
        "data": letter,
        "type": "soundSeq",
        "state": {
            "index": 0,
            "input": ""
        }
    };
}
function letterSeqQuestion() {
    let letter = letters[getRandomInt(8)]
    return {
        "prompt": "What letter is this?",
        "instructions": "",
        "answer": letter["letter"],
        "data": letter,
        "type": "letterSeq",
    };
}
function guessLetterQuestion() {
    let letter = letters[getRandomInt(8)]
    return {
        "prompt": letter["letter"],
        "instructions": "Tap the buttons below to write out the sequence for the corresponding letter.",
        "answer": letter["code"].replace(/\s/g, ''),
        "audio": letter["link"],
        "type": "letterGuess",
        "state": {
            "index": 0,
            "input": ""
        }
    };
}
function guessWordQuestion() {
    let word = words[getRandomInt(3)];
    return {
        "prompt": "What word is this?",
        "instructions": "Tap the buttons below to write out the sequence for the corresponding word",
        "answer": word[0],
        "audio": "",
        "type": "wordGuess",
        "data": word,
        "state": {
            "index": 0,
            "input": ""
        }
    };
}
function displayQuestion(question) {
    let {type} = question
    console.log(question);
    switch(type){
        case "soundSeq":
            displaySoundSeq(question);
            break;
        case "letterSeq":
            displayLetterSeq(question);
            break;
        case "letterGuess":
            displayGuessLetter(question);
            break;
        case "wordGuess":
            displayGuessWord(question);
            break;
        default:
            throw new Error("display generator fell to default");
    }
}
function displaySoundSeq(question) {
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1><audio controls src="${question["data"]["link"]}"></div>`);
    $('#middle-row').append(createDashButton());
    $('#middle-row').append(createDotButton());
    $('.dash-btn, .dot-btn').click(checkSeq);
}
function createDashButton(){
    return `<div><button class="dash-btn" val="_">DASH<div><div></button></div>`;
}
function createDotButton() {
    return `<div><button class="dot-btn" val="."><div>DOT<div></button></div>`;
}
function displayLetterSeq(question) {
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div><div class="col-md-12"></div><div class=""><h1>${question["data"]["code"]}</h1>
                            <audio controls src="${question["data"]["link"]}"></div>`);
    let buttons = []
    let letter_ind = letters.indexOf(question["data"])
    buttons.push(letter_ind);
    buttons = fillButtonArray(4, buttons);
    generateLetterButtons(buttons, checkLetter);
}
function fillButtonArray(len, buttons) {
    while (buttons.length < len) {
        let random_num = getRandomInt(8)
        if (!buttons.includes(random_num)) {
            buttons.push(random_num);
        }
    }
    return shuffle(buttons);
}
function shuffle(array) {
    /* Fisher Yates Shuffle https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
function generateLetterButtons(buttons, func) {
    console.log(buttons)
    for(let button of buttons) {
        let letter = letters[button]
        $('#middle-row').append(`<div><button class="letter-btn" letter=${letter["letter"]}><div>${letter["letter"]}<div></button></div>`);
    }
    $('.letter-btn').click(func);
}
function displayGuessLetter(question){
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div><div class="col-md-12"></div><div class=""><h6>${question["instructions"]}</h6>`);
    $('#middle-row').append(createDashButton());
    $('#middle-row').append(createDotButton());
    $('.dash-btn, .dot-btn').click(checkSeq);
}
function displayGuessWord(question){
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div><div class="col-md-12"></div><div class=""><h1>${question["data"][1].join('  ')}</h1></div>`);
    let buttons = [...question["data"][2]]
    buttons = fillButtonArray(8, buttons);
    generateLetterButtons(buttons, checkWord);
}
function checkSeq() {
   let code = $(this).attr('val');
   let {state, answer} = question;
   state["input"] += code + " ";
   if(code === answer[state["index"]]) {
       if(state["index"] === answer.length -1) {
            $('.dash-btn, .dot-btn').prop("disabled", true);
            createFeedback(true, "Correct!");
            sendJsonRequest(true);
       } else {
           state["index"] += 1;
           question["state"] = state;
       }
   } else {
       $('.dash-btn, .dot-btn').prop("disabled", true);
       createFeedback(false, `Not quite! you tapped sequence "${state["input"]}". The answer is ${question["answer"]}`);
       sendJsonRequest(false);
   }
}
function checkLetter(){
    let btn_letter = $(this).attr('letter')
    if(btn_letter === question['answer']) {
        createFeedback(true, "Correct!");
        $('.letter-btn').prop("disabled", true);
        sendJsonRequest(true);
    } else {
        sendJsonRequest(false);
        $('.letter-btn').prop("disabled", true);
        createFeedback(false, `Not quite! you selected "${btn_letter}". The answer is ${question["answer"]}`);
    }
}
function checkWord(){
    let letter = $(this).attr('letter');
    let {state, answer} = question;
    state["input"] += letter + " ";
    if(letter === answer[state["index"]]) {
        if(state["index"] === answer.length -1) {
             $('.letter-btn').prop("disabled", true);
             createFeedback(true, "Correct!");
             sendJsonRequest(true);
        } else {
            state["index"] += 1;
            question["state"] = state;
        }
    } else {
        $('.letter-btn').prop("disabled", true);
        createFeedback(false, `Not quite! you clicked "${state["input"]}". The answer is ${question["answer"]}`);
        sendJsonRequest(false);
    }
}
function displayResults(result){
    $('#upper-row').append(endingBanner(result))
}
function endingBanner(result){
    let messages = [
        "This can definitely be hard! Keep trying!",
        "All you need is a little review!",
        "That's a start, you'll be a master in no time.",
        "That's great, you're master at it before you know it.",
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
function generateNextButton(id) {
    if (id === 7) {
        $('#button-col').append(`<a href="/end" class="btn btn-warning btn-large" role="button">Finish</a>`);
    } else {
        $('#button-col').append(`<a href="/question/${id + 1}" class="btn btn-warning btn-large" role="button">Next</a>`)
    }
}
function createFeedback(answer, message) {
    $('#feedback').text(message);
    $('#feedback').addClass(function() {return answer ? 'text-success' : 'text-danger'});
}