
var gameWidth = 16
var gameHeight = 16
var squareSize = 24
var squareGap = 2
var squareSpacing = squareSize + squareGap
var score = 0
var rot = 0
var snakeColour = "lightgrey"
var snakeHeadColour = "blue"
var foodColour = "red"
var snakeLength = 2
var snakeDir = 0
var snake = []
var food = {}
var moveDelay = .75
var rotSpeed = 0
var moveTime

game.onKeyDown = function(event){
	if (event.keyIdentifier == "Up") snakeDir = 0;
	else if (event.keyIdentifier == "Right") snakeDir = 1;
	else if (event.keyIdentifier == "Down") snakeDir = 2;
	else if (event.keyIdentifier == "Left") snakeDir = 3;
}

game.initFunc = function(){
	moveTime = game.time + moveDelay
	snake[0] = {x:gameWidth/2, y:gameHeight/2}
	snake[1] = {x:gameWidth/2, y:gameHeight/2+1}
	food = {x:Math.floor(Math.random()*gameWidth),y:Math.floor(Math.random()*gameHeight)}
}

game.updateFunc = function(){
	rot += game.deltaTime*rotSpeed;
	if (game.time > moveTime){
		moveTime += moveDelay
		var newX = snake[0].x
		var newY = snake[0].y
		if (snakeDir == 3){
			newX -= 1;
			if (newX < 0) newX = gameWidth-1
		} else if (snakeDir == 1){
			newX += 1;
			if (newX > gameWidth - 1) newX = 0
		} else if (snakeDir == 0){
			newY -= 1;
			if (newY < 0) newY = gameHeight -1
		}else if (snakeDir == 2){
			newY += 1;
			if (newY > gameHeight-1) newY = 0
		}
		var newPiece;
		if (newX == food.x && newY == food.y){
			food = {x:Math.floor(Math.random()*gameWidth),y:Math.floor(Math.random()*gameHeight)}
			newPiece = {}
			snakeLength += 1
			score += 1
			moveDelay /= 1.1
			if (score == 3) rotSpeed = 1/100;
			else if (score > 3) rotSpeed *= 1.25;
			console.log(rotSpeed)
		} else newPiece = snake.pop()
		newPiece.x = newX
		newPiece.y = newY
		snake.unshift(newPiece)
	}
}

game.renderFunc = function(){
	ctx.fillStyle = game.backgroundColour
	ctx.fillRect(0,0,canvas.width,canvas.height)

	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.rotate(rot)
	ctx.translate(-canvas.width/2,-canvas.height/2)

	//ctx.fillStyle = squareColourDefault
	/*var xStart = canvas.width/2-(gameWidth*(squareSize+squareGap)+squareGap)/2
	var yStart = canvas.height/2-(gameWidth*(squareSize+squareGap)+squareGap)/2
	for (var x = 0; x < gameWidth; x++){
		for (var y = 0; y < gameHeight; y++){
			ctx.fillRect(xStart + x*squareSpacing,yStart + y*squareSpacing,squareSize,squareSize)
		}
	}*/

	var width = gameWidth*(squareSize+squareGap)+squareGap
	var height = gameHeight*(squareSize+squareGap)+squareGap
	var left = canvas.width/2-width/2
	var top = canvas.height/2-height/2


	var grad = ctx.createLinearGradient(0,top,0,top+height)
	grad.addColorStop(0,"#b0a0a0")
	grad.addColorStop(1,"#402020")
	ctx.fillStyle = grad
	ctx.fillRect(left,top,width,height)

	ctx.fillStyle = snakeColour
	for (var i = 1; i < snakeLength; i++){
		var piece = snake[i]
		ctx.fillRect(left+squareGap+piece.x*squareSpacing,top+squareGap+piece.y*squareSpacing,squareSize,squareSize)
	}
	ctx.fillStyle = snakeHeadColour	
	ctx.fillRect(left+squareGap+snake[0].x*squareSpacing,top+squareGap+snake[0].y*squareSpacing,squareSize,squareSize)

	ctx.fillStyle = foodColour
	ctx.fillRect(left+squareGap+food.x*squareSpacing,top+squareGap+food.y*squareSpacing,squareSize,squareSize)

	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.rotate(-rot)
	ctx.translate(-canvas.width/2,-canvas.height/2)
}

main()