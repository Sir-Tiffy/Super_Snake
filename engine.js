
var canvas
var ctx
var date = new Date();

function blank(){}

var game = {
	fps:60,
	time: 0,
	deltaTime:0,
	backgroundColour:"#000000",
	keys:{
		left:false,
		up:false,
		right:false,
		down:false
	},
	updateFunc:blank,
	renderFunc:blank,
	initFunc:blank,
	onKeyDown:blank,
	onKeyUp:blank
}

function clamp(num, min, max){
	if (num < min) return min;
	if (num > max) return max;
	return num;
}

function GetColourFromHue(hue){
	var modx = (hue%360.0)/60.0
	return "rgb("+Math.round((Math.abs(modx-3)-1)*255)+','+Math.round((2-Math.abs(modx-2))*255)+','+Math.round((2-Math.abs(modx-4))*255)+')'
}

function engineUpdate(){
	game.time += game.deltaTime
	game.updateFunc()
	game.renderFunc()
}

function main(){
	canvas = document.getElementById("screen");
	ctx = canvas.getContext("2d")

	game.deltaTime = 1/game.fps
	game.initFunc()

	setInterval(engineUpdate, 1000/game.fps)
}