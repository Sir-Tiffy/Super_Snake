var fps = 60
var gameDots = 16
var moveDelay = .1
var backgroundColour = "#202020"
var gameBottomColour = "#000000"
var gameTopColour = "#404040"
var snakeColour = "white"
var snakeHeadColour = "blue"
var foodColour = "red"
var title = "SUPER SNAKE"
var squareGapFraction = 1/8

var canvas
var ctx
var foodSound
var dieSound
var song

var snake = []
var food = {}
var snakeSize
var score = 0
var moveTime = 0
var rotationSpeed = 0
var backgroundFade = 0
var titleFade = 0
var titleWobble = 0
var titleSize = 96
var currentRotation = 0
var gameTop = 190
var snakeDir = 0
var time = 0
var squareSize
var squareGap
var squareSpacing
var gameDiag
var gameScreenWidth
var gameScreenHeight
var gameSize
var gameCentreX
var gameCentreY
var deltaTime

function GetColourFromHue(hue, scale, defaultR, defaultG, defaultB){
	var modx = (hue%360.0)/60.0
	return "rgb("+Math.round((Math.abs(modx-3)-1)*scale*(255-defaultR)+defaultR)+','+Math.round((2-Math.abs(modx-2))*scale*(255-defaultG)+defaultG)+','+Math.round((2-Math.abs(modx-4))*scale*(255-defaultB)+defaultB)+')'
}

function isDot(x,y,i){
	if (x < 0) x = gameDots - 1
	if (y < 0) y = gameDots - 1
	if (x > gameDots - 1) x = 0
	if (y > gameDots - 1) y = 0
	return snake[i].x == x && snake[i].y == y
}

function isEmptySpot(x,y,start){
	if (!start) start = 0;
	for (var i = start; i < snakeSize; i++){
		if (isDot(x,y,i)) return false
	}
	return true
}

function placeFood(){
	while (true) {
		var X = Math.floor(Math.random()*gameDots)
		var Y = Math.floor(Math.random()*gameDots)
		if (isEmptySpot(X,Y)) return {x:X, y:Y}
	}
}


function drawDot(x,y,colour){
	if (!!colour) ctx.fillStyle = colour
	ctx.fillRect(gameCentreX - gameSize/2 + squareGap + x*squareSpacing, 
	gameCentreY - gameSize/2 + squareGap + y*squareSpacing, 
	squareSize,squareSize)
}

function startGame(){
	song.pause()
	snakeDir = 0
	score = 0
	snakeSize = 2
	snake[0] = {x:Math.floor(gameDots/2),y:Math.floor(gameDots/2)}
	snake[1] = {x:Math.floor(gameDots/2),y:Math.floor(gameDots/2)+1}
	food = placeFood()
	title = "SUPER SNAKE"
	titleSize = 96
	document.body.style.backgroundImage = "url('superText.png')"
}

function onKeyDown(event){
	switch(event.keyCode){
		case 38: case 87:
			if (!isDot(snake[0].x,snake[0].y-1,1)) snakeDir = 0;
			break;
		case 39: case 68:
			if (!isDot(snake[0].x+1,snake[0].y,1)) snakeDir = 1;
			break;
		case 40: case 83: 
			if (!isDot(snake[0].x,snake[0].y+1,1)) snakeDir = 2;
			break;
		case 37: case 65:
			if (!isDot(snake[0].x-1,snake[0].y,1)) snakeDir = 3;
			break;
		case 82:
			startGame();
			break;
	}
}

function renderTitle(){
	var rotAmount = Math.cos(time*5)*Math.PI/64 * titleWobble
	ctx.translate(canvas.width/2, 64)//canvas.height/2)
	ctx.rotate(rotAmount)
	ctx.translate(-canvas.width/2, -64)//-canvas.height/2)

	ctx.fillStyle = GetColourFromHue(time*90, titleFade, 96,96,96)
	ctx.font = titleSize+"px Comic Sans MS"
	var x = canvas.width/2 - ctx.measureText(title).width/2 + 8*Math.cos(time*3)*titleWobble
	var y = 128 + 32*Math.sin(time)*titleWobble
	ctx.fillText(title,x,y)
	ctx.fillStyle = "Black"
	ctx.strokeText(title,x,y)

	ctx.translate(canvas.width/2, 64)//canvas.height/2)
	ctx.rotate(-rotAmount)
	ctx.translate(-canvas.width/2, -64)//-canvas.height/2)
}

function updateGame(){
	if (time >= moveTime){
		moveTime += moveDelay
		var newX = snake[0].x
		var newY = snake[0].y
		switch(snakeDir){
			case 0:
				newY -= 1
				if (newY < 0) newY = gameDots - 1
				break;
			case 1:
				newX += 1
				if (newX > gameDots-1) newX = 0
				break;
			case 2:
				newY += 1
				if (newY > gameDots-1) newY = 0
				break;
			case 3:
				newX -= 1
				if (newX < 0) newX = gameDots - 1
				break;
		}
		var newDot
		if (newX == food.x && newY == food.y){
			snake.unshift({x:newX, y:newY})
			food = placeFood()
			score += 1
			snakeSize += 1
			foodSound.play()
			if (score == 9) song.play()
			else if (score == 10) song.pause()
			else if (score == 20){
				title = "SUPER DUPER SNAKE"
				titleSize = 64
				document.body.style.backgroundImage = "url('superDuperText.png')"
				song.play()
			}
		} else {
			newDot = snake.pop()
			snakeSize = snakeSize - 1
			if (isEmptySpot(newX,newY)){
				snakeSize = snakeSize + 1
				newDot.x = newX
				newDot.y = newY
				snake.unshift(newDot)
			} else {
				dieSound.play()
				startGame()
			}
		}
	}

	if (score < 3 && titleWobble > 0){
		titleWobble -= deltaTime*titleWobble/2
		if (titleWobble < 0.01){
			titleWobble = 0
			ctx.clearRect(0,0,gameScreenWidth, gameTop)
		}
	} else if (score >= 3 && titleWobble < 1){
		titleWobble +=deltaTime*(1-titleWobble)/8;
	}
	if (score < 6 && titleFade > 0){
		titleFade -= deltaTime*titleFade/2
	} else if (score >= 6 && titleFade < 1){
		titleFade +=deltaTime*(1-titleFade)/8;
	}
	rotationSpeed += deltaTime*(score-rotationSpeed-10)/4;
	if (score > 10) currentRotation += deltaTime*(rotationSpeed*5);
	else currentRotation -= deltaTime*currentRotation;

	if (currentRotation > 360) currentRotation -= 360
	if (currentRotation < 0) currentRotation += 360

	if (backgroundFade < .75 && score > 8){
		backgroundFade += deltaTime/8.0;
		if (backgroundFade > .75) backgroundFade = .75;
	} else if (score <= 8 && backgroundFade > 0){
		backgroundFade -= deltaTime/8.0;
		if (backgroundFade < 0) backgroundFade = 0;
	}
	backgroundColour = GetColourFromHue(currentRotation, backgroundFade,31,31,31)
}

function renderGame(){
	ctx.clearRect(Math.floor(gameCentreX-gameDiag/2-1),Math.floor(gameCentreY-gameDiag/2-2),Math.ceil(gameDiag+3),Math.ceil(gameDiag+3))

	ctx.translate(gameCentreX, gameCentreY)
	ctx.rotate(currentRotation*Math.PI/180)
	ctx.translate(-gameCentreX, -gameCentreY)

	var grad = ctx.createLinearGradient(0,gameCentreY - gameSize/2,0,gameCentreY + gameSize/2)
	grad.addColorStop(0,gameTopColour)
	grad.addColorStop(1,gameBottomColour)
	ctx.fillStyle = grad
	ctx.fillRect(gameCentreX-gameSize/2,gameCentreY-gameSize/2,gameSize,gameSize)

	ctx.font = "96px Comic Sans MS"
	var textSize = ctx.measureText(score)
	ctx.fillStyle = GetColourFromHue(score*15,score/20,0,0,0)
	ctx.fillText(score,gameCentreX-textSize.width/2,gameCentreY+37)

	ctx.fillStyle = snakeColour
	for (var i = 1; i < snakeSize; i++){
		drawDot(snake[i].x,snake[i].y)
	}
	drawDot(food.x, food.y, foodColour)
	drawDot(snake[0].x, snake[0].y, snakeHeadColour)

	ctx.translate(gameCentreX, gameCentreY)
	ctx.rotate(-currentRotation*Math.PI/180)
	ctx.translate(-gameCentreX, -gameCentreY)

	document.body.style.backgroundColor = backgroundColour
}

function loop(){
	time += deltaTime
	updateGame()
}

function renderLoop(){
	requestAnimFrame(renderLoop)
	renderTitle()
	renderGame()
}


document.body.removeChild(document.getElementById("javascriptWarning"))

canvas = document.getElementById("screen");
ctx = canvas.getContext("2d")
if (!ctx){
	document.body.getElementById("html5Warning").innerHTML = "Please use a modern HTML5-Compatible browser!"
} else {

	foodSound = document.getElementById("foodSound")
	dieSound = document.getElementById("dieSound")
	song = document.getElementById("song")

	deltaTime = 1/fps

	gameScreenWidth = canvas.width
	gameScreenHeight = canvas.height-gameTop
	gameDiag = (gameScreenWidth < gameScreenHeight)?gameScreenWidth:gameScreenHeight
	gameSize = gameDiag/Math.sqrt(2)
	gameCentreX = gameScreenWidth/2
	gameCentreY = gameTop+gameScreenHeight/2

	squareSize = gameSize/(gameDots*(1+squareGapFraction))
	squareGap = squareSize*squareGapFraction
	squareSpacing = squareSize + squareGap

	startGame()
	setInterval(loop, 1000.0/fps)
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(func){window.setTimeout(func,1000/fps);};})();
	renderLoop();
}
