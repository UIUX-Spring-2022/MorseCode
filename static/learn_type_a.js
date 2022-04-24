$(document).ready(function(){

    $("#dash").click(function(){
        $("#ans_bubble").append("_ ")
    });
    $("#dot").click(function(){
        $("#ans_bubble").append(". ")
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

