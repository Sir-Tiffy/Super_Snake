var canvas
var ctx
var date = new Date();

var game = {
	fps:30,
	time: 0,
	deltaTime:0,
	width:800,
	height:600,
	backgroundColour:"#202020",
	keys:{
		left:false,
		up:false,
		right:false,
		down:false
	},
	updateFunc: updateMenu,
	renderFunc: renderMenu
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

function onMouseDown(event){
	/*var button = event.button //0: left, 1: middle, 2: right
	var x = event.offsetX
	var y = event.offsetY
	ctx.fillStyle = "Black"
	ctx.fillRect(x,y,64,64)*/
}

function onMouseUp(event){

}

function onKeyDown(event){
	/*var key = event.keyCode
	ctx.font = " 30px Arial"
	ctx.fillStyle = "#ff0000"
	ctx.fillText(key,32,32)*/
}

function onKeyUp(event){

}

function renderMenu(){
	var title = "SUPER SNAKE"
	ctx.font = "96px Comic Sans MS"
	ctx.fillStyle = GetColourFromHue(game.time*90)
	var x = game.width/2 - ctx.measureText(title).width/2 + 8*Math.cos(game.time*3)
	var y = 112 + 32*Math.sin(game.time)
	ctx.fillText(title,x,y)
	ctx.fillStyle = "Black"
	ctx.strokeText(title,x,y)
}

function initMenu(){
	ctx.fillStyle = game.backgroundColour
	ctx.fillRect(0,0,game.width,game.height)
}

function updateMenu(){
}

function updateGame(){

}

function renderGame(){

}

function update(){
	game.time += game.deltaTime
	game.updateFunc()
	game.renderFunc()
}

function begin(){
	canvas = document.getElementById("screen");
	ctx = canvas.getContext("2d")

	game.deltaTime = 1/game.fps

	game.width = canvas.width
	game.height = canvas.height
	initMenu()
	setInterval(update, 1000/game.fps)
}