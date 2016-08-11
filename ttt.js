	var board = {
  'stage': null,
  'stage1': null,
  'end': false,
  'start': false,
  'play': [],
  'delay':2000,
  'currPlayer': 'x',
  'x': {
    color: 'Red'
  },
  'o': {
    color: 'Yellow'
  },
  'square': {
    size: 100,
    color: "DeepSkyBlue"
  },
  "winner":"",
  'winners': [
    // rows
    {
      a: 1,
      b: 2,
      c: 3
    }, {
      a: 4,
      b: 5,
      c: 6
    }, {
      a: 7,
      b: 8,
      c: 9
    },

    // columns
    {
      a: 1,
      b: 4,
      c: 7
    }, {
      a: 2,
      b: 5,
      c: 8
    }, {
      a: 3,
      b: 6,
      c: 9
    },

    // diagonals
    {
      a: 1,
      b: 5,
      c: 9
    }, {
      a: 3,
      b: 5,
      c: 7
    }
  ],
  init: function() {
	// init player
	board.stage1 = new createjs.Stage("player");
	addSelector(drawPlayer(board.stage1, 225, 50, 'x'), 'x');
	addSelector(drawPlayer(board.stage1, 325, 50, 'o'), 'o');
	board.stage1.update();

	// init board
	board.stage = new createjs.Stage("demoCanvas");
	drawBoard(board.stage);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", board.stage);

  },
  getStatus: function(){
  	var boardStatus = [];
	for(var i=1; i<=9; i++)	 {
		boardStatus.push(board[i].player?board[i].player:'-');
	}
	return boardStatus;
  },
  isSelected: function() {
  	return board.selectedPlayer?true:false;
  },
  chooseRole: function(v) {
	if('x' === v)
		board.stage1.children[0].dispatchEvent('mousedown');
	else if('o' === v)
		board.stage1.children[1].dispatchEvent('mousedown');
	else
		console.log("choose wrong role");
  },
};

// opposite player
function notPlayer(player) {
  return player !== 'o' ? 'o' : 'x';
}

function handlePress(id, event) {
	var player = board.selectedPlayer;
	if (!board.end && board.selectedPlayer && !board[id].player &&player==board.currPlayer) {
		drawPlayer(board.stage, board[id].x, board[id].y, board.selectedPlayer);
		board[id].player = board.selectedPlayer;
		checkEndCondition();
		board.currPlayer = oppositPlayer(board.currPlayer);
	}
}

function drawPlaySurface(stage, x, y, id) {
  var square = new createjs.Shape();
  square.graphics.beginFill(board.square.color).drawRect(0, 0, board.square.size, board.square.size);
  square.x = 50;
  square.y = 50;
  stage.addChild(square)
  createjs.Tween.get(square, {
      loop: false
    })
    .to({
      x: x,
      y: y
    }, 100, createjs.Ease.getPowInOut(4))
    .to({
      alpha: 1
    }, 50, createjs.Ease.getPowInOut(2))

  board[id] = {
    x: x + board.square.size / 2,
    y: y + board.square.size / 2,
    player: null
  };

  square.addEventListener("mousedown", handlePress.bind(null, id));
}

function drawWinner(win, player) {
  console.log('draw winner');
  var winLine = new createjs.Shape();
  winLine.graphics.setStrokeStyle(3);
  winLine.graphics.beginStroke(board[player].color);
  winLine.graphics.moveTo(board[win.a].x, board[win.a].y);
  winLine.graphics.lineTo(board[win.c].x, board[win.c].y);
  winLine.graphics.endStroke();
  board.play.push(winLine);
  board.stage.addChild(winLine);
}

function checkEndCondition() {
  if (board.end) return true;
  for (var i = 0; i < board.winners.length; i++) {
    var win = board.winners[i];
    console.log('' + board[win.a].player + board[win.b].player + board[win.c].player);
    if (!!board[win.a].player && board[win.a].player === board[win.b].player && board[win.b].player === board[win.c].player) {
      console.log('Win: ' + JSON.stringify(win));
      drawWinner(win, board[win.a].player);
      board.end = true;
      board.winner = board[win.a].player;
    }
  }
  if(board.end) {
  	clearInterval(board.interval);
  }
  return board.end;
}

function count(pos, counts) {
  if(board[pos].player === null) {
    return;
  }
  
  counts[board[pos].player]++;
  counts.total++;
}

function score(play, player) {
  var counts = { x: 0, o: 0, total: 0 };
  count(play.a, counts);
  count(play.b, counts);
  count(play.c, counts);
  
  // this winning case not gonna work
  if(counts.total === 3) {
    return -1;
  }

  // stop the opposite from winning
  if(counts[notPlayer(player)] == 2) {
    return 7;
  }

  // winning position
  if(counts[player] == 2) {
    return 6;
  }
  if(counts[player] == 1) {
    return 5;
  }
  if(counts[notPlayer(player)] == 1) {
    return 4;
  }
  if(counts.total === 0) {
    return 3;
  }
  if(counts.x + counts.o === 2) {
    return 2;
  }  
  return 0;
}

function selectNextPos(player) {
  var winners = board.winners.slice();
  var win = winners.sort(function(a, b) {
    return score(b, player) > score(a, player);
  });
  var top = win[0];
  if (!board[top.b].player) return top.b;
  if (!board[top.a].player) return top.a;
  if (!board[top.c].player) return top.c;
  throw 'not supposed to happen';
}

function botTurn() {
	var player = oppositPlayer(board.selectedPlayer);
	if(player==board.currPlayer) {
		// console.log(2);
		var pos = selectNextPos(player);
		board[pos].player = player;
		drawPlayer(board.stage, board[pos].x, board[pos].y, player);
		checkEndCondition();	  
		board.currPlayer = oppositPlayer(board.currPlayer);
	}
		
}

function oppositPlayer(player) {
	return 'x'==player?'o':'x';
}

function selectPlayer(player, event) {
  reset();
  board.selectedPlayer = player;
  board.start = true;
  console.log('Selected player: ' + player);
}

function addSelector(playerShape, player) {
  playerShape.addEventListener("mousedown", selectPlayer.bind(null, player));
}

function drawPlayer(stage, x, y, player) {
	console.log('drawing ' + player);
	var o = new createjs.Shape();	
	o.graphics.beginFill(board[player].color).drawCircle(x, y, 50);
	stage.addChild(o);
	board.play.push(o);
	return o;
	  
}

function reset() {
  for (var i = 1; i <= 9; i++) {
    board[i].player = null;
  }
  board.play.forEach(function(e) {
    board.stage.removeChild(e);
  });
  board.end = false;
  board.winner = "";
  board.start = false;
}

function drawBoard(stage) {
  var multiplierWithMargin = board.square.size * 1.1;

  for (var i = 1; i <= 3; i++) {
    for (var j = 1; j <= 3; j++) {
      drawPlaySurface(stage, multiplierWithMargin * j, multiplierWithMargin * i, (i - 1) * 3 + j);
    }
  }
}

// 'x' or 'o'


// move 
// i from 1~9
function move(i) {
	var rtn = [];
	if(checkMove(i))
	{
		board.stage.children[i-1].dispatchEvent('mousedown');
		rtn = board.getStatus();
	} else {
		rtn = false;
	}
	return rtn;	
}

function checkMove(i) {
	var flag = true;
	if(!(i>=0 && i <=9))
	{
		flag = false;
		console.log('move out of 1~9!');
	}
	if(board[i].player)
	{
		flag = false
		console.log('move to occupied space!');
	}
	return flag;
}

function getWinner() {
	if(board.end)
		return board.winner;
	else 
		return false;
}

function isEnd() {
	if(board.end)
		return true;
	else
		return false;
}

function action() {
	if(!board.isSelected()) {
		chooseYourRole();
	}
	if(board.start&&!board.end) {
		if(board.currPlayer == board.selectedPlayer)
		{
			yourAI();
		}else {
			botTurn(oppositPlayer(board.selectedPlayer))
		}
	}
}

window.onload = function() {
	board.init();

	// working process
	board.interval = setInterval("action()", board.delay);
}
