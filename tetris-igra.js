
const scaler=25;

let board=document.getElementById("tetris");
let pen=board.getContext("2d");

let generatedBoard=document.getElementById("generatedBlock");
let penG=generatedBoard.getContext("2d");

board.height = board.height * 5;
pen.scale(scaler, scaler);
penG.scale(scaler,scaler);

const ROWS=board.getBoundingClientRect().height/scaler;
const COLUMNS=board.getBoundingClientRect().width/scaler;

let storage=[];
let BLOCKS=[];
let COLORS=[];
let level=1;
let speed=600;
let lastGame=null;
let pack=null;
let next=null;
let background=[];
let change=[];
handle=null;
for(let i=0;i<COLUMNS;i++){
    change.push("bisque");
}

$(document).ready(function(){
    setStorage();
    speed=speed/level;
    if(BLOCKS.length==0) {
        alert("BLOCKS ARE NOT CHOSEN");
        window.location.replace("tetris-uputstvo.html");
    }
    document.getElementById("score").innerHTML=0;
    clearBackground();
    next=generateBlock();
    handle=setInterval(function(){
        fullRow();
        if(pack==null){
            pack=next;
            next=generateBlock();
            penG.clearRect(0, 0, generatedBoard.width, generatedBoard.height);
            generateDrawing();
        }
        down();
    },speed);

    document.addEventListener("keydown",function(e){
        let key=e.code;
        switch(key){
            case "ArrowDown":
                down();
                break;
            case "ArrowLeft":
                left();
                break;
            case "ArrowRight":
                right();
                break;
            case "ArrowUp":
                rotate();
                break;
        }

    });
});

function setStorage(){
    let last=localStorage.getItem("lastGame");
    let results = localStorage.getItem("results");
    if (results != null) {
        storage = JSON.parse(results);
        lastGame=JSON.parse(last);
    } else {
        localStorage.setItem("results", JSON.stringify(storage));
        localStorage.setItem("lastGame",JSON.stringify(lastGame));
    }
    let choiceB=localStorage.getItem("chosenBlocks");
    let choiceC=localStorage.getItem("chosenColors");
    let range=localStorage.getItem("level");
    if (choiceB!='') {
        BLOCKS = JSON.parse(choiceB);
        COLORS = JSON.parse(choiceC);
        level = JSON.parse(range);
        document.getElementById("progres").value=level;
        document.getElementById("labelLevel").innerHTML=level.toString();
    }
}

function generateBlock(){
    let block_index=Math.floor(Math.random()*BLOCKS.length);
    let color_index=block_index+1;
    let block=BLOCKS[block_index];
    let color=COLORS[color_index];
    let x=(board.getBoundingClientRect().width/2)/scaler-1;
    let y=0;
    return{block,color,x,y};
}

function drawBlock(){
    for(let i=0;i<pack.block.length;i++){
        for(let j=0;j<pack.block[i].length;j++){
            if(pack.block[i][j]==1){
                pen.shadowOffsetX = 0; 
                pen.shadowOffsetY = 0;  
                pen.shadowBlur = 0;    
                pen.shadowColor = 'rgba(0, 0, 0, 0)'; 
                pen.fillStyle=pack.color;
                pen.fillRect(pack.x+j,pack.y+i,1,1);
            }
        }
    }
}

function generateDrawing(){
    for(let i=0;i<next.block.length;i++){
        for(let j=0;j<next.block[i].length;j++){
            if(next.block[i][j]==1){
                penG.fillStyle=next.color;
                penG.fillRect(next.x+j,next.y+generatedBoard.height/3/scaler+i,1,1);
            }
        }
    }

}

function clearBackground(){
    background=[];
    for(let i=0;i<ROWS;i++){
        background.push([]);
        for(let j=0;j<COLUMNS;j++){
            background[i].push("bisque");
        }
    }
}

function setBackground(){
    for(let i=0;i<background.length;i++){
        for(let j=0;j<background[i].length;j++){
            pen.fillStyle=background[i][j];
            pen.fillRect(j,i,1,1);
        }
    }
}

function down(){
    if(pack==null) return;
    let flag=false;
    for(let i=0;i<pack.block.length;i++){
        for(let j=0;j<pack.block[i].length;j++){
            if(pack.block[i][j]==1){
                if(pack.y+1+i>=ROWS || background[(pack.y+1+i)][(pack.x+j)]!="bisque"){
                    flag=true;
                    break;
                }
            }
        }
        if(flag){
            break;
        }
    }
    if(!flag){
        pack.y++;
        setBackground();
        drawBlock();
    }
    else{
        if(pack.y==0){
            endGame();
        }
        else{
            for(let i=0;i<pack.block.length;i++){
                for(let j=0;j<pack.block[i].length;j++){
                    if(pack.block[i][j]==1){
                        background[(pack.y+i)][(pack.x+j)]=pack.color;
                    }
                }
            }
            setBackground();
        }
        pack=null;
    }
}

function left(){
    if(pack==null) return;
    let flag=false;
    for(let i=0;i<pack.block.length;i++){
        for(let j=0;j<pack.block[i].length;j++){
            if(pack.block[i][j]==1){
                if(pack.x-1+j<0 || background[(pack.y+i)][(pack.x-1+j)]!="bisque"){
                    flag=true;
                    break;
                }
            }
        }
        if(flag){
            break;
        }
    }
    if(!flag){
        pack.x--;
        setBackground();
        drawBlock();
    }
}

function right(){
    if(pack==null) return;
    let flag=false;
    for(let i=0;i<pack.block.length;i++){
        for(let j=0;j<pack.block[i].length;j++){
            if(pack.block[i][j]==1){
                if(pack.x+1+j>=COLUMNS || background[(pack.y+i)][(pack.x+1+j)]!="bisque"){
                    flag=true;
                    break;
                }
            }
        }
        if(flag){
            break;
        }
    }
    if(!flag){
        pack.x++;
        setBackground();
        drawBlock();
    }
}

function rotate(){
    if(pack==null) return;
    let flag=false;
    let rotatedBlock=T(pack.block);
    for(let i=0;i<rotatedBlock.length;i++){
        rotatedBlock[i]=rotatedBlock[i].reverse();
    }
    for(let i=0;i<rotatedBlock.length;i++){
        for(let j=0;j<rotatedBlock[i].length;j++){
            if(rotatedBlock[i][j]==1){
                if(pack.x+j<0 || pack.x+j>=COLUMNS || pack.y+i>=ROWS || pack.y+i<0 ||  background[(pack.y+i)][(pack.x+j)]!="bisque"){
                    flag=true;
                    break;
                }
            }
        }
        if(flag){
            break;
        }
    }
    if(!flag){
        pack.block=rotatedBlock;
        setBackground();
        drawBlock();
    }
}

function T(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}


function fullRow(){
    let cnt=0;
    let filled=true;
    for(let i=0;i<background.length;i++){
        filled=true;
        for(let j=0;j<background[i].length;j++){
            if(background[i][j]=="bisque"){
                filled=false;
            }
        }
        if(filled){
            background.splice(i,1);
            background.unshift(change.slice());
            cnt++;
            if(speed>100){
                speed=speed-20;
            }
        }
    }
    if(cnt!=0){
        let labela=document.getElementById("score");
        let score=parseInt(labela.innerHTML);
        score+=cnt*100;
        labela.innerHTML=score.toString();
    }
}

function endGame(){
    clearInterval(handle);
    alert("GAME OVER");
    let user=prompt("Unesite svoje korisnicko ime");
    let labela=document.getElementById("score");
    let points=parseInt(labela.innerHTML);
    storage.push(
        {
            userName:user,
            score:points
        }
    );
    localStorage.setItem("results", JSON.stringify(storage));
    lastGame={
        userName:user,
        score:points
    };
    localStorage.setItem("lastGame",JSON.stringify(lastGame));
    window.location.replace("tetris-rezultati.html");
}

