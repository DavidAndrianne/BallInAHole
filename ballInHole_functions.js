var intervalId;
var time = 0;
var ticking = false;

function play(){
    if(!ticking){intervalId = setInterval(tick, 1000);}
    ticking = true;
    return false;
}

function pause(){
    clearInterval(intervalId);
    ticking = false;
    return false;
}

function stop(){
    time = 0;
    updateP();
    return pause();
}

function tick(){
    time = time+1;
    updateP();
}

function updateP(){
    var timeP = document.getElementById("time");
    killTheChildren(timeP);
    timeP.appendChild(document.createTextNode(timeString()));
}

function timeString(){
    var sec = Math.round(time % 60);
    var min = Math.round(time/60 % 60);
    var hr = Math.round(time / 3600);
    return (format(hr)+":"+format(min)+":"+format(sec));
}

function format(timeVar){
    if(timeVar < 10){
        return "0"+timeVar;
    } else {
        return timeVar;
    }
}

function killTheChildren(element) { //vernietig alle kinderen
    for (var j = element.childNodes.length - 1; j >= 0; j--) {
        var child = element.childNodes[j];
        element.removeChild(child);
    }
}