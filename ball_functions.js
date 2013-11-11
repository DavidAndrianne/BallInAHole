window.onload = init;

var winW, winH;
var ball;
var hole;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
                            
// Initialisation on opening of the window
function init() {
        var surface = document.getElementById('surface');
	lastOrientation = {};
	window.addEventListener('resize', doLayout, false);
	surface.addEventListener('mousemove', onMouseMove, false);
	surface.addEventListener('mousedown', onMouseDown, false);
	surface.addEventListener('mouseup', onMouseUp, false);
	surface.addEventListener('touchmove', onTouchMove, false);
	surface.addEventListener('touchstart', onTouchDown, false);
	surface.addEventListener('touchend', onTouchUp, false);
	window.addEventListener('deviceorientation', deviceOrientationTest, false);
	lastMouse = {x:0, y:0};
	lastTouch = {x:0, y:0};
	mouseDownInsideball = false;
	touchDownInsideball = false;
	doLayout(document);
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) {
	window.removeEventListener('deviceorientation', deviceOrientationTest);
	if (event.beta !== null && event.gamma !== null) {
		window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
		movementTimer = setInterval(onRenderUpdate, 10); 
	}
}

function doLayout(event) {
	winW = window.innerWidth;
	winH = window.innerHeight;
	var surface = document.getElementById('surface');
	//surface.width = winW;
	//surface.height = winH;
	var radius = 10;
	ball = {radius:radius,
		x:75,
		y:75,
		color:'rgba(0, 0, 255, 255)'};
        hole = {radius:radius,
		//x:Math.round(winW/2),
		//y:Math.round(winH/2),
                x: surface.width/2,
                y: surface.height/2,
		color:'rgba(0, 0, 0, 255)'};
	renderObject(ball);
        renderObject(hole);
}
	
function renderObject(object) {
	var surface = document.getElementById('surface');
	var context = surface.getContext('2d');
	//context.clearRect(0, 0, surface.width, surface.height);
	context.beginPath();
        console.log("Rendering ball at x:"+object.x+" y:"+object.y);
	context.arc(object.x, object.y, object.radius, 0, 2*Math.PI, false);
	context.fillStyle = object.color;
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = object.color;
	context.stroke();		
} 

function onRenderUpdate(event) {
	var xDelta, yDelta;
	switch (window.orientation) {
		case 0: // portrait - normal
			xDelta = lastOrientation.gamma;
			yDelta = lastOrientation.beta;
			break;
		case 180: // portrait - upside down
			xDelta = lastOrientation.gamma * -1;
			yDelta = lastOrientation.beta * -1;
			break;
		case 90: // landscape - bottom right
			xDelta = lastOrientation.beta;
			yDelta = lastOrientation.gamma * -1;
			break;
		case -90: // landscape - bottom left
			xDelta = lastOrientation.beta * -1;
			yDelta = lastOrientation.gamma;
			break;
		default:
			xDelta = lastOrientation.gamma;
			yDelta = lastOrientation.beta;
	}
	moveBall(xDelta, yDelta);
}

function moveBall(xDelta, yDelta) {
        var surface = document.getElementById('surface');
        var rect = surface.getBoundingClientRect();
        //console.log("add " + xDelta + " to :"+ball.x+", and add "+ yDelta+" to :"+ball.y);
	ball.x += xDelta;
	ball.y += yDelta;
        var context = surface.getContext('2d');
        console.log("moving ball: x+="+xDelta+" y+="+yDelta);
        context.clearRect(0, 0, surface.width, surface.height); //clear board
	renderObject(ball); //Re-render objects
        renderObject(hole);
}

function onMouseMove(event) {
	if(mouseDownInsideball){
		var xDelta, yDelta;
		xDelta = event.clientX - lastMouse.x;
		yDelta = event.clientY - lastMouse.y;
		moveBall(xDelta, yDelta);
		lastMouse.x = event.clientX;
		lastMouse.y = event.clientY;
	}
}

function onMouseDown(event) {
	var x = event.clientX;
	var y = event.clientY;
        var surface = document.getElementById('surface');
        var rect = surface.getBoundingClientRect();
        //console.log(x, y);
        //console.log(rect.top, rect.right, rect.bottom, rect.left);
        x -= rect.left;
        y -= rect.top;
        console.log("mouseclick: x="+x+", y="+y);
	if(	x > ball.x - ball.radius &&
		x < ball.x + ball.radius &&
		y > ball.y - ball.radius &&
		y < ball.y + ball.radius){
		mouseDownInsideball = true;
		lastMouse.x = x;
		lastMouse.y = y;
	} else {
		mouseDownInsideball = false;
	}
} 

function onMouseUp(event) {
	mouseDownInsideball = false;
}

function onTouchMove(event) {
	event.preventDefault();	
	if(touchDownInsideball){
		var touches = event.changedTouches;
		var xav = 0;
		var yav = 0;
		for (var i=0; i < touches.length; i++) {
			var x = touches[i].pageX;
			var y =	touches[i].pageY;
			xav += x;
			yav += y;
		}
		xav /= touches.length;
		yav /= touches.length;
		var xDelta, yDelta;

		xDelta = xav - lastTouch.x;
		yDelta = yav - lastTouch.y;
		moveBall(xDelta, yDelta);
		lastTouch.x = xav;
		lastTouch.y = yav;
	}
}

function onTouchDown(event) {
	event.preventDefault();
	touchDownInsideball = false;
	var touches = event.changedTouches;
	for (var i=0; i < touches.length && !touchDownInsideball; i++) {
		var x = touches[i].pageX;
		var y = touches[i].pageY;
		if(	x > ball.x - ball.radius &&
			x < ball.x + ball.radius &&
			y > ball.y - ball.radius &&
			y < ball.y + ball.radius){
			touchDownInsideball = true;		
			lastTouch.x = x;
			lastTouch.y = y;			
		}
	}
} 

function onTouchUp(event) {
	touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
	lastOrientation.gamma = event.gamma;
	lastOrientation.beta = event.beta;
}