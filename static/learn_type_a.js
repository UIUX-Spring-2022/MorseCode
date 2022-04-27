$(document).ready(function(){

    console.l
    $("#dash-learn").click(function(){
        $("#ans_bubble").append('<div class="learn-dash-symbol"> </div>')
        console.log("clicked")
    });
    $("#dot-learn").click(function(){
        $("#ans_bubble").append('<div class="learn-dot-symbol"> </div>')
        console.log("clicked")
    });
    $("#delete_ans").click(function(){
        let text= document.getElementById('ans_bubble').textContent.slice(0, -2)
        $("#ans_bubble").empty()
        $("#ans_bubble").append(text)
    });
    $("#sequence_ans").click(function(){
        $("#ans_bubble").empty()
        $(".ans_bub").empty()
        $(".ans_bub").css('background-color', '#6fa8dcff')
        $(".ans_bub").append("The correct answer is '"+code+"'");
    });
});

function playAudio(url) {
    new Audio(url).play();
}

