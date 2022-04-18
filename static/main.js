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