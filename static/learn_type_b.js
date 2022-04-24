$(document).ready(function(){
    $(".letter-btn").click(function(){
        console.log("clicked")
        $("#ans").append("The Correct Answer is '"+letter+"'");
        $('#option1').attr('disabled','disabled');
        $('#option2').attr('disabled','disabled');
        $('#option3').attr('disabled','disabled');
        $('#option4').attr('disabled','disabled');
    });
    let answer_button= Math.floor(Math.random() * 4)+1
    button= "option" + answer_button
    $('#'+ button).append(letter)
    option1= document.getElementById("option1").innerHTML
    option2=document.getElementById("option2").innerHTML
    option3=document.getElementById("option3").innerHTML
    option4=document.getElementById("option4").innerHTML
    let ids_used=[parseInt(id)]
    if (option1=="")
    {
        let random=Math.floor(Math.random() * 8)
        while (ids_used.includes(random))
        {
            random=Math.floor(Math.random() * 8)
        }
        ids_used.push(random)
        $("#option1").append((letter_sounds[random]["letter"]).toUpperCase())
    }
    if (option2=="")
    {
        let random=Math.floor(Math.random() * 8)
        while (ids_used.includes(random))
        {
            random=Math.floor(Math.random() * 8)
        }
        ids_used.push(random)
        $("#option2").append((letter_sounds[random]["letter"]).toUpperCase())

    }
    if (option3=="")
    {
        let random=Math.floor(Math.random() * 8)
        while (ids_used.includes(random))
        {
            random=Math.floor(Math.random() * 8)
        }
        ids_used.push(random)
        $("#option3").append((letter_sounds[random]["letter"]).toUpperCase())

    }
    if (option4=="")
    {
        let random=Math.floor(Math.random() * 8)
        while (ids_used.includes(random))
        {
            random=Math.floor(Math.random() * 8)
        }
        ids_used.push(random)
        $("#option4").append((letter_sounds[random]["letter"]).toUpperCase())
    
        

    }
    
    
});

function playAudio(url) {
    new Audio(url).play();
}