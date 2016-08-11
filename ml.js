
var ml = {
	"updateConstant": 0.4,
	"hypothesis": [0.5,0.5,0.5,0.5,0.5,0.5],
	chooseMove: function() {

	},
	getTrainingExamples: function(history){

	},
	getHistory: function() {

	},
	getRows: function(board) {

	},
	getColumns: function(board) {

	},
	getDiagonals: function(board) {

	},
	getPossibilities: function(board) {
		var possibilities = [];

	},
	getFeatures: function( board) {

	},
	evaluateBoard: function(board) {
		x1,x2,x3,x4,x5,x6 = ml.getFeatures(board);
		w0,w1,w2,w3,w4,w5,w6 = ml.hypothesis;
		return w0 + w1*x1 + w2*x2 + w3*x3 + w4*x4 + w5*x5 + w6*x6
	},
	updateWeights: function(history, trainingExamples) {

	}

}
