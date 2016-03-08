var model = {
	moves: [],
	currIdx: 0,
	strict: false,
	gameInProgress: false,
	currLevel: 1,
	audio_play: null,
	audio_right: null,
	audio_wrong: null,

	init: function() {
		model.moves = [];
		model.currIdx = 0;
		model.strict = false;
		model.currLevel = 1;
		model.gameInProgress = false;
		model.audio_play = new Audio("res/play.mp3");
		model.audio_right = new Audio("res/right.mp3");
		model.audio_wrong = new Audio("res/wrong.mp3");
	}


}

var control = {
	init: function() {
		model.init();
		view.init();
	},

	startGame: function() {
		$("#startBtn").prop("disabled", true);
		gameInProgress = true;

		
		this.playMoves();

		// todo: make colored buttons clickable


	},

	playSequence: function(seq) {
		view.disableClick();

		for(var i = 0; i < seq.length; i++) {
			// todo: linght up a color, play a sound
			var colorID = 'c' + seq[i].toString();
			

			(function(id) {
				setTimeout(function() {
					$("#" + id).effect("highlight", {}, 1000);
					model.audio_play.play();
				}, i * 1000);
			})(colorID);
		}

		setTimeout(function() {
			view.enableClick();
		}, (i - 1) * 1000);

	},

	playMoves: function() {
		var randomMove = Math.floor(Math.random() * 4);
		model.moves.push(randomMove);

		this.playSequence(model.moves);
	},

	/* when player press a color, check its correctness. 
	 * if it's right, update currIdx and wait for next press.
	 * else, give error message, reset currIdx and playMoves() again.
	 */

	checkAnswer: function(colorPressed) {
		var currentColor = 'c' + model.moves[model.currIdx];
		if(currentColor === colorPressed) {
			model.audio_right.play();
			if(model.currIdx === 19) {
				console.log("You win");
				console.init();
			} else if(model.currIdx === model.moves.length-1) {
				model.currLevel++;
				view.updateMsg("LEVEL" + model.currLevel);

				model.currIdx = 0;
				setTimeout(function(){
					control.playMoves();
				}, 1000);
			} else {
				model.currIdx++;
				console.log("waiting for user press more colors")
			}
		} else {
			model.audio_wrong.play();
			if(model.strict) {
				view.updateMsg("WRONG");
				setTimeout(function(){
					location.reload();
				}, 2500);		
			} else {
				model.currIdx = 0;
				view.updateMsg("WRONG");
				setTimeout(function(){
					control.playSequence(model.moves);				
				}, 2000);
			}		
		}
	}

}

var view = {
	init: function() {
		$("#strictChkbox").attr("checked", false);
		$("#startBtn").prop("disabled", false);
		$("#msg").text("LEVEL 1");

		// attach event listeners
			// when start_btn is pressed
		$("#startBtn").click(function() {
			control.startGame();
		}),

		$("#resetBtn").click(function() {
			location.reload();
		}),

		$(".gameBtn").click(function() {
			$(this).effect("highlight", {}, 200);
			var colorPressed = $(this).attr("id");
			control.checkAnswer(colorPressed);
		}),

		$("#strictChkbox").change(function() {
			if(this.checked) {
				model.strict = true;
			} else {
				model.strict = false;
			}
		});

		view.disableClick();

	},

	disableClick: function() {
		$(".gameBtn").addClass("unclickable");
		$(".gameBtn").removeClass("clickable");
	},

	enableClick: function() {
		$(".gameBtn").addClass("clickable");
		$(".gameBtn").removeClass("unclickable");
	},


	updateMsg: function(msg) {
		var preMsg = model.strict === true ? "LEVEL1" : $("#msg").text();
		if(msg === "WRONG") {
			$("#msg").text(msg);
			$("#msg").effect("bounce", {times: 3}, 2000);
			this.disableClick();
			setTimeout(function(){
				view.enableClick();
				$("#msg").text(preMsg);
			}, 2000);
		} else {
			$("#msg").text(msg);
		}
	}


}

control.init();