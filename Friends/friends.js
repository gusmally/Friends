var lastUpdate = 0;
var gwinkie, hoodle, lisa, spider;
var distance = 24;
var score  = 0;

var Player = function (elementName) {
  var position = [0,0];
  var tileSize = 128;
  var element = $('#'+elementName);

  var move = function(x, y) {
    console.log("hi");
    position[0] += x,
    position[1] += y;

    if (position[0] <= 0)  {
      position[0] = 0;
    }

    if (position[1] <= 0)  {
      position[1] = 0;
    }

    if (position[0] >= innerHeight - tileSize) {
      position[0] = innerHeight - tileSize;
    }

    if (position[1] >= innerHeight - tileSize) {
      position[1] = innerHeight - tileSize;
    }

    element.css('left', position[0] + 'px'); 
    element.css('top', position[1] + 'px'); 
  }

  return {
    move: move,
    getSide:      function()  { return side; },
    getPosition:  function()  { return position; },
    getSize:      function()  { return tileSize; }
  }
};

function AI(characterToControl, characterToFollow) {
    var ctl = characterToControl;
    var friend = characterToFollow;
    var State = {
        WAITING: 0,
        FOLLOWING: 1
    }
    var currentState = State.FOLLOWING;

    console.log("hi");

    function repeat(cb, cbFinal, interval, count) {
        var timeout = function() {
        repeat(cb, cbFinal, interval, count-1);
        }

        if (count <= 0) {
            cbFinal();
        } else {
            cb();
            setTimeout(function() {
                repeat(cb, cbFinal, interval, count-1);
            }, interval);
        }
    }

    function moveTowardsPlayer() {
        if(friend.getPosition()[1] >= ctl.getPosition()[1] + ctl.getSize()/2) {
            ctl.move(distance);
        } else {
            ctl.move(-distance);
        }
        setTimeout(function() {
            currentState = State.FOLLOWING;
        }, 400);
    }

  function update() {
    switch (currentState) {
      case State.FOLLOWING:          
        moveTowardsPlayer();
        currentState = State.WAITING;    
      case State.WAITING:
        break;
    }
  }

  return {
    update: update
  }
}

function update(time) {
  var t = time - lastUpdate;
  lastUpdate = time;

  ai.update();

  requestAnimationFrame(update);
}

$(document).ready(function() {
  lastUpdate = 0;
  player = Player('hoodle');
  player.move(0, 0);
  opponent = Player('gwinkie');
  opponent.move(500, 100);
  ai = AI(opponent, player);
    
  $('#up')    .bind("pointerdown", function() {player.move(0, -distance);});
  $('#down')  .bind("pointerdown", function() {player.move(0, distance);});
  $('#left')  .bind("pointerdown", function() {player.move(-distance, 0);});
  $('#right') .bind("pointerdown", function() {player.move(distance, 0);});

  requestAnimationFrame(update);
});

$(document).keydown(function(event) {
  var event = event || window.event;
  switch(String.fromCharCode(event.keyCode).toUpperCase()) {
    case 'W':
      player.move(0, -distance);
      break;
    case 'S':
      player.move(0, distance);
      break;
    case 'A':
      player.move(-distance, 0);
      break;
    case 'D':
      player.move(distance, 0);
      break;
    case ' ':
      player.fire();
      break;
  }

  return false;
});