/**
 * Created on: 30/12/15
 *     Author: Bobby Lin
 */
    
var sequencePattern;
var sequenceInterval;
var currentPatternInterval;
var playerTurnInterval;
var playerTurn;
var isPlayerTurn;
var sequenceSpeed = [1500,1250,1000,750];
var speed;

function init() {
    resetInterval();
    removeLight();
    sequencePattern = [];
    playerTurn = 0;
    isPlayerTurn = false;
    getNextSequence();
}

function toggleStrictMode() {
    var indicator = $('#strict-indicator');
    if(indicator.hasClass('green-bg')) {
        indicator.removeClass('green-bg');
    }
    else {
        indicator.addClass('green-bg');
    }
}

function removeLight() {
    $('#item0').removeClass('red-bg');
    $('#item1').removeClass('green-bg');
    $('#item2').removeClass('yellow-bg');
    $('#item3').removeClass('blue-bg');
}

function resetInterval() {
    clearInterval(sequenceInterval);
    clearInterval(currentPatternInterval);
    clearInterval(playerTurnInterval);
}

function getNextSequence() {
    var sequenceNum = sequencePattern.length;
    if(sequenceNum < 20) {
        speed = sequenceSpeed[0];
        if(sequenceNum >= 4 && sequenceNum < 8) {
            speed = sequenceSpeed[1];
        }
        else if(sequenceNum >= 8 && sequenceNum < 13) {
            speed = sequenceSpeed[2];
        }
        else if(sequenceNum >= 13) {
            speed = sequenceSpeed[3];
        }
        console.log("Speed is " + speed);
        var count = sequenceNum + 1;
        if(count < 10) {
            count = "0" + count;
        }
        sequencePattern.push(randomPattern());
        displaySequence(count);
    }
    else {
        var i = 0;
        var interval = setInterval(function(){
            $('#count').html("WIN");
            i++;
            if (i === 2) {
                clearInterval(interval);
                init();
            }
        },2000);
    }
}

function randomPattern() {
    return Math.floor(Math.random() * (4));
}

function displaySequence(count) {
    var i = 0;
    console.log(sequencePattern);
    sequenceInterval = setInterval(function() {
        showCurrentPattern(sequencePattern[i], 300);
        if(i === 0) {
            $('#count').html(count);
        }
        i++;
        if(i === sequencePattern.length) {
            clearInterval(sequenceInterval);
            isPlayerTurn = true;
        }
    }, speed);
}

function showCurrentPattern(num, time) {
    var id = "#item" + num;
    var style = "-bg";
    var itemSound = "sound" + num;
    
    if(num === 0) {
        style = "red" + style;
    }
    else if (num === 1) {
        style = "green" + style;
    }
    else if(num === 2) {
        style = "yellow" + style;
    }
    else {
        style = "blue" + style;
    }
    
    var count = 0;
    currentPatternInterval = setInterval(function() {
        count++;
        if(count === 1) {
            document.getElementById(itemSound).play();
            $(id).addClass(style);
        }
        if(count === 2) {
            $(id).removeClass(style);
            clearInterval(currentPatternInterval);
        }
    }, time);
}

$('.game-button').click(function() {
    if(isPlayerTurn === false) {
        console.log("Please wait for sequence");
    } 
    else {
        var clickedNum = parseInt((this.id).charAt(4));
        showCurrentPattern(clickedNum, 100);

        if(clickedNum === sequencePattern[playerTurn]) {
            playerTurn++;
            if(playerTurn === sequencePattern.length) {
                console.log("Passed " + playerTurn);
                playerTurn = 0;
                isPlayerTurn = false;
                getNextSequence();
            }
        }
        else {
            var i = 0;
            if($('#strict-indicator').hasClass('green-bg')) {
                init();
                $('#count').html("X");
                var interval = setInterval(function(){
                    i++;
                    if (i === 2) {
                        clearInterval(interval);
                    }
                },1000);
            } else {
                isPlayerTurn = false;
                var currentCount = $('#count').html();
                $('#count').html("! !");
                playerTurnInterval = setInterval(function () {
                    i++;
                    if (i === 2) {
                        clearInterval(playerTurnInterval);
                        $('#count').html(currentCount);
                        displaySequence();
                        playerTurn = 0;
                    }
                }, 1000);
            }
        }
    }
});
