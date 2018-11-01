var lastUpdate = 0;
var player, ball, opponent, ai;
var distance = 24;
var score  = [0, 0];

var Ball = function () {
    var velocity = [0, 0];
    var position = [0, 0];
    var element = $('#ball');
    var owner;
    var halfTile = 32;
    var paused = false;

    function move(t) {
        //console.log("hi!");
        if (owner !== undefined) {
            var ownerPosition = owner.getPosition();
            position[1] = ownerPosition[1] + owner.getSize() / 2;
            position[0] = ownerPosition[0] + owner.getSize();
        } else {
            if (position[1] - halfTile <= 0 ||
                  position[1] + halfTile >= innerHeight) {
                velocity[1] = -velocity[1];
            }
            position[0] += velocity[0] * t; 
            position[1] += velocity[1] * t;     
        }   

        element.css('left', (position[0] - halfTile) + 'px');
        element.css('top', (position[1] - halfTile) + 'px');
    }

    function update(t) {
        move(t);
    }

    return {
        update: update,
        getOwner:     function()  { return owner; },
        getVelocity:  function()  { return velocity }, 
        getPosition:  function(p) { return position; },
    }
};

var Player = function (elementName) {
    var position = [0,0];
    var tileSize = 128;

    var element = $('#'+elementName);

    var move = function(y) {
        console.log("hi");
        position[1] += y;

        if (position[1] <= 0)  {
            position[1] = 0;
        }

        if (position[1] >= innerHeight - tileSize) {
            position[1] = innerHeight - tileSize;
        }

    element.css('left', position[0] + 'px'); 
    element.css('top', position[1] + 'px'); 
  }

    return {
        move: move,
        getPosition:  function()  { return position; },
        getSize:      function()  { return tileSize; }
    }
};

function Follower(playerToControl) {
    var ctl = playerToControl;
    var State = {
        WAITING: 0,
        FOLLOWING: 1
    }
    var currentState = State.FOLLOWING;

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
        console.log("hhhhh");
    if(ball.getPosition()[1] >= ctl.getPosition()[1] + ctl.getSize()/2) {
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
          break;
                
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

    ball.update(t);
    ai.update();

    requestAnimationFrame(update);
}

$(document).ready(function() {
  lastUpdate = 0;
  player = Player('hoodle');
  player.move(0);
  opponent = Player('gwinkie');
  opponent.move(0);
  ball = Ball();
  ai = Follower(opponent);
    
  $('#up')    .bind("pointerdown", function() {player.move(-distance);});
  $('#down')  .bind("pointerdown", function() {player.move(distance);});

  requestAnimationFrame(update);
});

$(document).keydown(function(event) {
  var tevent = event || window.event;
  switch(String.fromCharCode(tevent.keyCode).toUpperCase()) {
    case 'A':
      player.move(-distance);
      break;
    case 'Z':
      player.move(distance);
      break;
    case ' ':
      player.fire();
      break;
  }

  return false;
});