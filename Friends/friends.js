var lastUpdate = 0;
var player, follower, ai, follower2;
var distance = 24;
var score  = [0, 0];

var Friend = function (elementName) {
    var position = [0,0];
    var tileSize = 128;

    var element = $('#'+elementName);

    var move = function(x, y) {
        position[0] += x;
        position[1] += y;

        if (position[0] <= 0)  {
            position[0] = 0;
        }        
        if (position[1] <= 0)  {
            position[1] = 0;
        }

        if (position[0] >= innerWidth - tileSize) {
            position[0] = innerWidth - tileSize;
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

function Follower(friendToControl) {
    var friend = friendToControl;
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
        if (this.getPosition()[1] >= friend.getPosition()[1] + friend.getSize()/2) {
            friend.move(distance, distance);
        } else {
            friend.move(-distance, -distance);
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

    ai.update();
    ai2.update();

    requestAnimationFrame(update);
}

$(document).ready(function() {
    lastUpdate = 0;
    player = Friend('hoodle');
    player.move(0, -150);
    follower = Friend('gwinkie');
    follower.move(500, 0);
    follower2 = Friend('spider');
    follower2.move(500, -500);
    ai = Follower(follower);
    ai2 = Follower(follower2);

    requestAnimationFrame(update);
});

// handle player movement using WASD and arrow keys
$(document).keydown(function(event) {
  switch(event.keyCode) {
    case 87:
    case 38:
      player.move(0, -distance);
      break;
    case 65:
    case 37:
      player.move(-distance, 0);
      break;
    case 83:
    case 40:
      player.move(0, distance);
      break;
    case 68:
    case 39:
      player.move(distance, 0);
      break;
  }
  return false;
});