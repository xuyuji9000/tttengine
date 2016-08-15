var ml = {
  "updateConstant": 0.4,
  "hypothesis": [0.5,0.5,0.5,0.5,0.5,0.5, 0.5],
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
  checkEnd: function(currentBoard) {
    var end = false;
    // check win sitution
    for (var i = 0; i < ml.winners.length; i++) {
      var win = ml.winners[i];
      if (currentBoard[win.a-1] === currentBoard[win.b-1] && currentBoard[win.b-1] === currentBoard[win.c-1]) {
        end = true;
      }
    }

    // check tie situation
    if(!end) {
      var flag = 0;
      for(var i = 0; i<=8; i++) {
        if('-' != currentBoard[i]) {
          flag++;
        }
      }
      if(9 == flag) {
        end = true;
      }
    }
    return end;
  },
  getTrainingExamples: function(history) {
    var mockPlayer = 'x'; // mock this is the selected player
    var trainingExamples = new Array();
    for(var i = 0; i < history.length; i++) {
      if(ml.checkEnd(history[i])) { // if end
        if(ml.getWinner(history[i]) == mockPlayer) {
          trainingExamples.push(new Array(ml.getFeatures(history[i]), 100));
        } else if(false == ml.getWinner(history[i])) {
          trainingExamples.push(new Array(ml.getFeatures(history[i]), 0));
        } else {
          trainingExamples.push(new Array(ml.getFeatures(history[i]), -100));
        }
      } else { // not end
        if(i+2 >= (history.length-1)) {
          if(false == ml.getWinner(history[(history.length-1)-1])) {
            trainingExamples.push(new Array(ml.getFeatures(history[i]), 0));
          } else {
            trainingExamples.push(new Array(ml.getFeatures(history[i]), -100));
          }
        } else {
          trainingExamples.push(new Array(ml.getFeatures(history[i]), ml.evaluateBoard(history[i+2])));
        }
      }
    }

    return trainingExamples;
  },
  evaluateBoard: function(currentBoard) {
    var features = ml.getFeatures(currentBoard);
    var sum = 0;
    for(var i = 0; i< features.length; i++) {
      sum += features[i]* ml.hypothesis[i];
    }
    return sum;
  },
  getBoardArray: function(currentBoard) {
    return currentBoard.split('');
  },
  getWinner: function(currentBoard) {
    var winner = false;
    // check win sitution
    for (var i = 0; i < ml.winners.length; i++) {
      var win = ml.winners[i];
      if (currentBoard[win.a-1] === currentBoard[win.b-1] && currentBoard[win.b-1] === currentBoard[win.c-1]) {
        winner = win[win.a-1];
        break;
      }
    }
    return winner;
  },
  getFeatures: function(currentBoard) {
    //x1 = number of instances of 2 x's in a row with an open subsequent square
    //x2 = number of instances of 2 o's in a row with an open subsequent square
    //x3 = number of instances of an x in an open row or column
    //x4 = number of instances of an o in an open row or column
    //x5 = number of instances of 3 xs in a row
    //x6 = number of instances of 3 os in a row
    var possibilities = new Array();
    possibilities = ml.getPossibilities(currentBoard);
    var x1 = 0      
    var x2 = 0
    var x3 = 0
    var x4 = 0
    var x5 = 0
    var x6 = 0
    possibilities.forEach(function(element, index, array){
      var zeros = 0;
      var Xs = 0;
      var Os = 0;
      element.forEach(function(element0, index0, array0){
        if("-" == element0)
          zeros++;
        else if("x" == element0)
          Xs++;
        else if('o' == element0)
          Os++;
      });

      if (Xs == 2 && zeros == 1)
        x1 += 1
      else if( Os == 2 && zeros == 1)
          x2 += 1
      else if( Xs == 1 && zeros == 2)
          x3 += 1
      else if (Os == 1 && zeros == 2)
          x4 += 1
      else if (Xs == 3)
          x5 += 1
      else if (Os == 3)
          x6 += 1
    });    
    return new Array(x1,x2,x3,x4,x5,x6);

  },
  getPossibilities: function(currentBoard) {
    var possibilities = new Array();
    possibilities = possibilities.concat(ml.getRows(currentBoard));
    possibilities = possibilities.concat(ml.getColumns(currentBoard));
    possibilities = possibilities.concat(ml.getDiagonals(currentBoard));
    return possibilities;
  },
  getBoard: function(currentBoard) {
    var thisBoard = new Array(new Array(),new Array(),new Array());
    thisBoard[0] = currentBoard.slice(0,3);
    thisBoard[1] = currentBoard.slice(3,6);
    thisBoard[2] = currentBoard.slice(6,9);
    return thisBoard;
  },
  getRows: function(currentBoard) {
    currentBoard = ml.getBoard(currentBoard);
    return currentBoard;
  },
  getColumns: function(currentBoard) {
    currentBoard = ml.getBoard(currentBoard);
    var columns = new Array(new Array(),new Array(),new Array());
    for(var i=0; i<currentBoard.length; i++) {
      columns[0].push(currentBoard[i][0]);
      columns[1].push(currentBoard[i][1]);
      columns[2].push(currentBoard[i][2]);
    }
    return columns;
  },
  getDiagonals: function(currentBoard) {
    currentBoard = ml.getBoard(currentBoard);
    var diagonals = new Array(new Array(),new Array());
    diagonals[0].push(currentBoard[0][0]);
    diagonals[0].push(currentBoard[1][1]);
    diagonals[0].push(currentBoard[2][2]);

    diagonals[1].push(currentBoard[0][2]);
    diagonals[1].push(currentBoard[1][1]);
    diagonals[1].push(currentBoard[2][0]);

    return diagonals;
  }, 
  updateWeights: function(history, trainingExamples) {
    for(var i = 0; i< history.length; i++) {
      var w0 = ml.hypothesis[0];
      var w1 = ml.hypothesis[1];
      var w2 = ml.hypothesis[2];
      var w3 = ml.hypothesis[3];
      var w4 = ml.hypothesis[4];
      var w5 = ml.hypothesis[5];
      var w6 = ml.hypothesis[6];

      var vEst = ml.evaluateBoard(history[i])
      x1 = trainingExamples[i][0][0]
      x2 = trainingExamples[i][0][1]
      x3 = trainingExamples[i][0][2]
      x4 = trainingExamples[i][0][3]
      x5 = trainingExamples[i][0][4]
      x6 = trainingExamples[i][0][5]
      vTrain = trainingExamples[i][1]            

      w0 = w0 + ml.updateConstant*(vTrain - vEst)
      w1 = w1 + ml.updateConstant*(vTrain - vEst)*x1
      w2 = w2 + ml.updateConstant*(vTrain - vEst)*x2
      w3 = w3 + ml.updateConstant*(vTrain - vEst)*x3
      w4 = w4 + ml.updateConstant*(vTrain - vEst)*x4
      w5 = w5 + ml.updateConstant*(vTrain - vEst)*x5
      w6 = w6 + ml.updateConstant*(vTrain - vEst)*x6

      ml.hypothesis[0] = w0;
      ml.hypothesis[1] = w1;
      ml.hypothesis[2] = w2;
      ml.hypothesis[3] = w3;
      ml.hypothesis[4] = w4;
      ml.hypothesis[5] = w5;
      ml.hypothesis[6] = w6;
    }
  }
};


var board = {
  'stage': null,
  'stage1': null,
  'end': false,
  'start': false,
  'play': [],
  'delay':20,
  'currPlayer': 'x',
  'selectedPlayer': null,
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
  "ml_loop": 100,
  'type': 1, // 1 common, 2 machine learning training, 3 ml competing
  "botai": 1, // 1-random, 2- heuristic
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
    // get parameter
    var query_string = board.getQueryString();
    if(query_string.type) {
      board.type = parseInt(query_string.type); 
      board.botai = parseInt(query_string.botai); 
    }



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

    // machine learning

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

  // get url parameters
  getQueryString: function() {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
          // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
          // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
        query_string[pair[0]] = arr;
          // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    } 
    return query_string;
  },
  isEnd: function() {
    if(board.end)
      return true;
    else
      return false;
  },
  // 1 'x', 2 'o', 3 (tie)
  addData:function(status) {
    switch(status) {
      case 1:
        var current = parseInt(document.getElementsByClassName("xwin")[0].innerHTML);
        current++;
        document.getElementsByClassName("xwin")[0].innerHTML = current;
      break;
      case 2:
        var current = parseInt(document.getElementsByClassName("owin")[0].innerHTML);
        current++;
        document.getElementsByClassName("owin")[0].innerHTML = current;
      break;
      case 3:
        var current = parseInt(document.getElementsByClassName("tie")[0].innerHTML);
        current++;
        document.getElementsByClassName("tie")[0].innerHTML = current;
      break;
    }
  },
  botTurn: function() {
    var player = oppositPlayer(board.selectedPlayer);
    if(player==board.currPlayer) {
      if(1 == board.botai) // 1 random
        var pos = board.selectRandomPos(player);
      else { // 2 heuristic
        var pos = board.selectNextPos(player);        
      }
      // console.log(board.getStatus());
      console.log("next pos" + pos);
      board[pos].player = player;
      board.recordHistory();
      drawPlayer(board.stage, board[pos].x, board[pos].y, player);
      checkEndCondition();    
      board.currPlayer = oppositPlayer(board.currPlayer);
    }
  },
  getBoardArray: function(curBoard) {
    return curBoard.split('');
  },
  selectNextPos: function(player) {
    var winners = board.winners.slice();
    var win = winners.sort(function(a, b) {
      return score(b, player) > score(a, player);
    });
    var top = win[0];
    if (!board[top.b].player) return top.b;
    if (!board[top.a].player) return top.a;
    if (!board[top.c].player) return top.c;
    throw 'not supposed to happen';
  },
  selectRandomPos: function() {
    var flag = true;
    var index = 0;
    while(flag)
    {
      index = Math.floor(Math.random()*9)+1;
      var status = board.getStatus();
      if("-" == status[index-1])
        flag = false;
    }
    return index;
  },
  // use cookie record board history
  recordHistory:function() {
    var boardStatus = board.getStatus();
    boardStatus = boardStatus.join('');
    var history = board.getCookie("history");
    if("" == history)
      history = new Array();
    else
      history = history.split(',');
    history.push(boardStatus);
    board.setCookie("history", history, 30);

  },
  getHistory: function(){
    var history = board.getCookie("history");
    if("" == history)
      history = new Array();
    else 
    {
      history = history.split(',');
      history.forEach(function(element, index, array) {
        array[index] = array[index].split("");
      })
    }
    return history;
  },
  getHypothesis:function() {
    var hypothesis = board.getCookie("hypothesis");
    if("" == hypothesis)
      hypothesis = ml.hypothesis
    else
    {
      hypothesis = hypothesis.split(",");
      hypothesis.forEach(function(element,index,array) {
        array[index] = parseFloat(array[index]);
      })
    }
    return hypothesis;
  },

  getCookie: function(c_name){
    if (document.cookie.length>0){　　
      c_start=document.cookie.indexOf(c_name + "=")　　
      if (c_start!=-1){
        c_start=c_start + c_name.length+1　　
        c_end=document.cookie.indexOf(";",c_start)　　
        if (c_end==-1) c_end=document.cookie.length　　
        return unescape(document.cookie.substring(c_start,c_end))
      } 
    }
    return ""
　},
  setCookie:function(c_name, value, expiredays){
　  var exdate=new Date();
　  exdate.setDate(exdate.getDate() + expiredays);
　　document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
　},
  getSuccessorsX: function() {
    var status = board.getStatus();
    var successor = new Array();
    for(var i = 0; i<8; i++)
    {
      if('-' == status[i])
      {
        status[i] = 'x';
        successor.push(new Array(i+1, status));
      }
    }
    return status;
  },

  getSuccessors: function(){
    var status = board.getStatus();
    var successor = new Array();
    for(var i = 0; i<=8; i++)
    {
      var temp = status;
      if('-' == temp[i])
      {
        temp[i] = board.selectedPlayer;
        successor.push(new Array(i+1, temp));
      }
    }
    return successor;
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
    board.recordHistory();
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
  console.log('draw winner '+player);
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
  // get winner
  for (var i = 0; i < board.winners.length; i++) {
    var win = board.winners[i];
    // console.log('' + board[win.a].player + board[win.b].player + board[win.c].player);
    if (!!board[win.a].player && board[win.a].player === board[win.b].player && board[win.b].player === board[win.c].player) {
      console.log('Win: ' + JSON.stringify(win));
      drawWinner(win, board[win.a].player);
      board.end = true;
      board.winner = board[win.a].player;
      board[win.a].player == "x"?board.addData(1):board.addData(2);
      
    }
  }

  // get tie
  if(!board.end) {
    var flag = 0;
    for(var i = 1; i<=9; i++) {
      if(null != board[i].player) {
        flag++;
      }
    }
    if(9 == flag) {
      board.end = true;
      board.addData(3);
      console.log("reach a tie");
    }
  }

  if(board.end) {
  	clearInterval(board.interval);
    if(3 == board.type && board.ml_loop >1) // if machine learning && still got loop number
    {
      board.ml_loop--;
      reset();
      board.interval = setInterval("action()", board.delay);

      // machine training
      ml.updateWeights(board.getHistory(),ml.getTrainingExamples(board.getHistory()));
      board.setCookie("hypothesis",ml.hypothesis,30);
    }
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
  board.selectedPlayer = null;
}

function drawBoard(stage) {
  var multiplierWithMargin = board.square.size * 1.1;

  for (var i = 1; i <= 3; i++) {
    for (var j = 1; j <= 3; j++) {
      drawPlaySurface(stage, multiplierWithMargin * j, multiplierWithMargin * i, (i - 1) * 3 + j);
    }
  }
}

function chooseMachineMove() {
  var successors = board.getSuccessors();
  var bestSuccessor = successors[0];
  var bestValue = ml.evaluateBoard(bestSuccessor[1]);

  successors.forEach(function(element,index, array){
    value = ml.evaluateBoard(element[1]);
    if(value > bestValue) {
      bestValue = value;
      bestSuccessor = element;
    }
  });
  console.log(board.getStatus());
  console.log("machine move "+bestSuccessor[0]);
  move(bestSuccessor[0]);
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

// "x" || "o" || ""
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
  switch(board.type)
  {
    case 1: // common
      if(!board.isSelected()) {
        chooseYourRole();
      }
      if(board.start&&!board.end) {
        if(board.currPlayer == board.selectedPlayer)
        {
          yourAI();
        }else {
          board.botTurn(oppositPlayer(board.selectedPlayer))
        }
      }
      break;
    case 2: // machine learning
      if(!board.isSelected()) {
        chooseYourRole();
      }

      if(board.start&&!board.end) {

        if(board.currPlayer == board.selectedPlayer)
        {
          yourAI();
        }else {
          board.botTurn(oppositPlayer(board.selectedPlayer))
        }
      }
    break;
    case 3:  // machine learning action
      if(!board.isSelected()) {
        chooseYourRole();
      }

      if(board.start&&!board.end) {

        if(board.currPlayer == board.selectedPlayer)
        {
          machineAI();
        }else {
          board.botTurn(oppositPlayer(board.selectedPlayer))
        }
      }
    break;
  }
}

function machineAI(){
  chooseMachineMove();
}

window.onload = function() {
	board.init();

	// working process
	board.interval = setInterval("action()", board.delay);
}
