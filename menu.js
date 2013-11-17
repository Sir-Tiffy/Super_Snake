
game.initFunc = function(){
	document.body.removeChild(document.getElementById("javascriptWarning"))
	if (!ctx){
		document.body.getElementById("html5Warning").innerHTML = "Please use a modern HTML5-Compatible browser!"
	}
	document.getElementById("startButton").hidden = false
	game.backgroundColour = "#202020"
	ctx.fillStyle = game.backgroundColour
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.font = "96px Comic Sans MS"
}

game.renderFunc = function(){
	var title = "SUPER SNAKE"
	var rotAmount = Math.cos(game.time*5)*Math.PI/64
	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.rotate(rotAmount)
	ctx.translate(-canvas.width/2, -canvas.height/2)
	ctx.fillStyle = GetColourFromHue(game.time*90)
	var x = canvas.width/2 - ctx.measureText(title).width/2 + 8*Math.cos(game.time*3)
	var y = 128 + 32*Math.sin(game.time)
	ctx.fillText(title,x,y)
	ctx.fillStyle = "Black"
	ctx.strokeText(title,x,y)
	ctx.translate(canvas.width/2, canvas.height/2)
	ctx.rotate(-rotAmount)
	ctx.translate(-canvas.width/2, -canvas.height/2)
}

main()