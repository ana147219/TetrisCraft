
let storage=[];
let lastGame=null;

function setStorage(){
    let results = localStorage.getItem("results");
    let last=localStorage.getItem("lastGame");
    if (results == null) {
        alert("Nije odigrana ni jedna partija");
    } else {
        storage = JSON.parse(results);
        lastGame=JSON.parse(last);
    }
}

$(document).ready(function(){

    setStorage();
    if(storage.length==0) return;

    storage.sort((a, b) => parseInt(b.score) - parseInt(a.score));

    if(storage.length>=10){
        for(let i=0;i<5;i++){
            let div=document.getElementById(i).innerHTML=((storage[i].userName).toString()+"<br> points: "+(storage[i].score).toString());
        }
    }
    else{
        for(let i=0;i<storage.length;i++){
            let div=document.getElementById(i).innerHTML=((storage[i].userName).toString()+"<br> points: "+(storage[i].score).toString());
        }
    }
    let div=document.getElementById("lastGame").innerHTML=((lastGame.userName).toString()+"<br> points: "+(lastGame.score).toString());

    document.getElementById("play-again-btn").addEventListener('click', function() {
        window.location.replace("tetris-igra.html");
    });

    document.getElementById("home-page-btn").addEventListener('click', function() {
        window.location.replace("tetris-uputstvo.html");
    });
    

});