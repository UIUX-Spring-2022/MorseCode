function generateQuestion(){
    let random_num = getRandomInt(4);
    switch(random_num){
        case 0:
            return createQuestion(0);
        case 1:
            return createQuestion(1);
        case 2:
            return createQuestion(2);
        case 3:
            return createQuestion(3);
        default:
            throw new Error("question generator fell to default");
    }
}
function createQuestion(code) {
    let types = ["soundSeq", "letterSeq", "guessLetter", "guessWord"]
    let type = types[code];

    let letter_num = getRandomInt(8);
    let word_num = getRandomInt(3);
    let letter = letters[letter_num];
    let word = words[word_num];
    
    let question_id = (code === 3) ? (code * 10) + word_num : (code * 10) + letter_num;

    if(quizQuestions.includes(question_id)) {
        console.log('used question previously');
        generateQuestion();
    }
    let question_map = {
        "soundSeq":    ['Listen Here', 'Tap the buttons below to write out the sequence', letter["code"].replace(/\s/g, ''), letter],
        "letterSeq":   ['What letter is this?', '', letter["letter"], letter],
        "guessLetter": [ letter["letter"] , 'Tap the buttons below to write out the sequence for the corresponding letter', letter["code"].replace(/\s/g, ''), letter],
        "guessWord":   ['What word is this?', 'Tap the buttons below to write out the sequence for the corresponding word', word[0], word]
    }
    let [prompt, instructions, answer, data] = question_map[type];
    return {
        "question_id": question_id,
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
    let {type} = question;
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
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div>
                            <div class="col-md-12"></div><div><button class="sound-btn" style='font-size:24px' onclick='playAudio("${question["data"]["link"]}")'><i class='fa fa-volume-up'></i></button></div>
                            <div class="col-md-12"></div><div><h6>${question["instructions"]}</h6></div>`);
    generatePlaceHolders(question["answer"]);
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
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div>
                            <div class="col-md-12"></div><div><button class="sound-btn" style='font-size:24px' onclick='playAudio("${question["data"]["link"]}")'><i class='fa fa-volume-up'></i></button></div>
                            <div class="col-md-12"></div><div><h6>${question["instructions"]}</h6></div>
                            <div class="col-md-12"></div> <div><h1>${question["data"]["code"]}</h1></div>`);
    let buttons = [];
    let letter_ind = letters.indexOf(question["data"]);
    buttons.push(letter_ind);
    buttons = fillButtonArray(4, buttons);
    generateLetterButtons(buttons, checkLetter);
    generatePlaceHolders(question["answer"]);
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
  
    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
function generateLetterButtons(buttons, func) {
    for(let button of buttons) {
        let letter = letters[button]
        $('#middle-row').append(`<div><button class="letter-btn" letter=${letter["letter"]}><div>${letter["letter"]}<div></button></div>`);
    }
    $('.letter-btn').click(func);
}
function generatePlaceHolders(answer){
    console.log("generating place holders")
    for(let i = 0; i < answer.length; i++) {
        $('#place-holder').append(`<span class="place-hold justify-content-center" id="placehold-${i}"></span>`);
    }
}
function displayGuessLetter(question){
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div><div class="col-md-12"></div><div class=""><h6>${question["instructions"]}</h6></div>`);
    generatePlaceHolders(question["answer"]);
    $('#middle-row').append(createDashButton());
    $('#middle-row').append(createDotButton());
    $('.dash-btn, .dot-btn').click(checkSeq);
}
function displayGuessWord(question){
    $('#upper-row').append(`<div><h1>${question["prompt"]}</h1></div><div class="col-md-12"></div><div class=""><h1>${question["data"][1].join('  ')}</h1></div>`);
    let buttons = [...question["data"][2]]
    buttons = fillButtonArray(8, buttons);
    generatePlaceHolders(question["answer"]);
    generateLetterButtons(buttons, checkWord);
}
function checkSeq() {
   let code = $(this).attr('val');
   let {state, answer, question_id} = question;
   state["input"] += code + " ";
   if(code === answer[state["index"]]) {
       if(state["index"] === answer.length - 1) {
            $('.dash-btn, .dot-btn').prop("disabled", true);
            $(`#placehold-${state["index"]}`).removeClass('place-hold').addClass(code === '.' ? 'small-dot' : 'small-dash');
            createFeedback(true, "Correct!");
            sendJsonRequest({answer: true, question_id: question_id});
       } else {
           console.log(state["index"]);
           $(`#placehold-${state["index"]}`).removeClass('place-hold').addClass(code === '.' ? 'small-dot' : 'small-dash');
           state["index"] += 1;
           console.log(state["index"]);
           question["state"] = state;
       }
   } else {
       $('.dash-btn, .dot-btn').prop("disabled", true);
       createFeedback(false, `Not quite! you tapped sequence "${state["input"]}".\nThe answer is ${question["answer"].split('').join(' ')}`);
       sendJsonRequest({answer: false, question_id: question_id});
   }
}
function checkLetter(){
    let btn_letter = $(this).attr('letter')
    let {state, answer, question_id} = question;
    if(btn_letter === answer) {
        $(`#placehold-${state["index"]}`).removeClass('place-hold').append(`<h1>${btn_letter}</h1>`);
        createFeedback(true, "Correct!");
        $('.letter-btn').prop("disabled", true);
        sendJsonRequest({answer: true, question_id: question_id});
    } else {
        sendJsonRequest({answer: false, question_id: question_id});
        $('.letter-btn').prop("disabled", true);
        createFeedback(false, `Not quite! you selected "${btn_letter}".\nThe answer is ${question["answer"].split('').join(' ')}`);
    }
}
function checkWord(){
    let letter = $(this).attr('letter');
    let {state, answer, question_id} = question;
    state["input"] += letter + " ";
    if(letter === answer[state["index"]]) {
        if(state["index"] === answer.length -1) {
             $('.letter-btn').prop("disabled", true);
             $(`#placehold-${state["index"]}`).removeClass('place-hold').append(`<h1>${letter}</h1>`);
             createFeedback(true, "Correct!");
             sendJsonRequest({answer: true, question_id: question_id});
        } else {
            $(`#placehold-${state["index"]}`).removeClass('place-hold').append(`<h1>${letter}</h1>`);
            state["index"] += 1;
            question["state"] = state;
        }
    } else {
        $('.letter-btn').prop("disabled", true);
        createFeedback(false, `Not quite! you clicked "${state["input"]}".\nThe answer is ${question["answer"].split('').join(' ')}`);
        sendJsonRequest({answer: false, question_id: question_id});
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
    console.log(JSON.stringify(data));
    $.ajax({
      type: "POST",
      url: '/update',
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (result) {
        let new_score=result["score"]
        console.log(new_score)
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
    $('#feedback').addClass(function() {return answer ? 'bg-success' : 'bg-danger'});
}
function playAudio(url) {
    new Audio(url).play();
}
function displayCurrentScore(score, page) {
    if ( page > 1) {
        $('#current-score').append(`<h3> Current Score  ${score} / ${page - 1} </h3>`)
    }
}