function generateQuestion(){
    let random_num = getRandomInt(4);
    switch(random_num){
        case 0:
            return createQuesiton("soundSeq");
        case 1:
            return createQuesiton("letterSeq");
        case 2:
            return createQuesiton("guessLetter");
        case 3:
            return createQuesiton("guessWord");
        default:
            throw new Error("question generator fell to default");
    }
}
function createQuesiton(type) {

    let letter = letters[getRandomInt(8)];
    let word = words[getRandomInt(3)];

    let question_map = {
        "soundSeq":    ['Listen Here', 'Tap the buttons below to write out the sequence', letter["code"].replace(/\s/g, ''), letter],
        "letterSeq":   ['Listen Here', 'Tap the buttons below to write out the sequence', letter["letter"], letter],
        "guessLetter": [ letter["letter"] , 'Tap the buttons below to write out the sequence for the corresponding letter', letter["code"].replace(/\s/g, ''), letter],
        "guessWord":   ['What word is this?', 'Tap the buttons below to write out the sequence for the corresponding word', word[0], word]
    }
    let [prompt, instructions, answer, data] = question_map[type]
    return {
        "prompt": prompt,
        "instructions": instructions,
        "answer": answer,
        "audio": data["link"],
        "type": type,
        "data": data,
        "state": {
            "index": 0,
            "input": "",
            "correct": false,
        }
    }
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
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1><audio controls src="${question["data"]["link"]}"></div>`);
    $('#middle-row').append(createDashButton());
    $('#middle-row').append(createDotButton());
    $('.dash-btn, .dot-btn').click(checkSeq);
}
function createDashButton() {
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