const BLOCKS=[ 
    [[1,1,1,1]],

    [[1,0,0],
     [1,1,1]],

    [[0,0,1],
     [1,1,1]],

    [[1,1],
     [1,1]],

    [[0,1,1],
     [1,1,0]],

    [[0,1,0],
     [1,1,1]],

    [[1,1,0],
     [0,1,1]]
];

const COLORS=[
    "bisque",
    "#00ffff",
    "#0000ff",
    "#ff6a0c",
    "#e4007c",
    "#97f78a",
    "#9457eb",
    "#e8000d"
];

let scaler=25;
let chosenBlocks=[];
let chosenColors=[];
let level=1;

function setStorage(){
    localStorage.setItem("chosenBlocks",chosenBlocks);
    localStorage.setItem("chosenColors",chosenColors);
    localStorage.setItem("level",level);
}

$(document).ready(function(){
    //localStorage.clear();
    setStorage();
    let slider = document.getElementById("level");
    let rangeLabels = ["beginer", "medium", "advanced"];
    let output = document.getElementById("levelValue");

   slider.oninput = function() {
     output.innerHTML = rangeLabels[this.value-1];
     level=this.value;
   }

    for(let i=0;i<7;i++){
        let canvas=document.getElementById(i+'canvas');
        let pen=canvas.getContext("2d");
        canvas.height = canvas.height /3;
        pen.scale(scaler, scaler);
    
        for(let p=0;p<BLOCKS[i].length;p++){
            for(let q=0;q<BLOCKS[i][p].length;q++){
                if(BLOCKS[i][p][q]==1){
                    pen.fillStyle=COLORS[i+1];
                    pen.fillRect(q,p,1,1);
                }
            }
        }    
    }

    document.getElementById("results-btn").addEventListener('click', function() {
        window.location.replace("tetris-rezultati.html");
    });

    document.getElementById("play-btn").addEventListener('click', function() {
        let checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        if(checkedCheckboxes.length==0){
            alert("YOU MUST SELECT AT LEAST ONE BLOCK");
            return;
        }
        let checkedIds = checkedCheckboxes.map(checkbox => checkbox.id);
        chosenColors.push("bisque");
        for(let i=0;i<checkedIds.length;i++){
            chosenBlocks.push(BLOCKS[parseInt(checkedIds[i])]);
            chosenColors.push(COLORS[(parseInt(checkedIds[i])+1)]);
        }
        localStorage.setItem("chosenBlocks",JSON.stringify(chosenBlocks));
        localStorage.setItem("chosenColors",JSON.stringify(chosenColors));
        localStorage.setItem("level",JSON.stringify(level));
        window.location.replace("tetris-igra.html");
    });
    
});