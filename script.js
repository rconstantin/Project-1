var scrollTotal = 1000;
var scrolled = 0; // A variable to keep track of how far we've scrolled.
var fractionScrolled = scrolled / scrollTotal;
var newContent = null;
var animateId = null;
var curActiveWaypoint = 0;
var animationInProgess = 0;
// You can read more about the mousewheel event at https://developer.mozilla.org/en-US/docs/DOM/DOM_event_reference/mousewheel
if (document.addEventListener) {
	document.addEventListener("mousewheel", MouseWheelHandler, false);	
}


var waypoints = document.getElementsByClassName('waypoint');
for (i = 0; i < waypoints.length; i++) {
	// Here we attach a handler to the click event for every waypoint,
	// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
	waypoints[i].addEventListener("click", waypointClickHandler, false);
	waypoints[i].addEventListener("mouseover", MouseOverHandler, false);
	waypoints[i].addEventListener("mouseout", MouseOutHandler, false);

}
// RC: Add Click Handler for the "next-triangle": 
var nextTriangle = document.getElementById('next-triangle');
nextTriangle.addEventListener("click", nextTriangleClickHandler,false);


function updateWaypoints() {
	fractionScrolled = scrolled / scrollTotal;
	console.log ('fractionScrolled :', fractionScrolled);
	// 0 <= fractionScrolled <= 1, so *10 gives us 10; Math.floor rounds down
	// RC: -1 in the Math.floor is causing a problem for first transition from 0 -> 1
	var whichWaypoint = Math.max(0, Math.floor(fractionScrolled * 10));
	console.log('calculated waypoint: ', whichWaypoint);
	if (whichWaypoint != curActiveWaypoint && animationInProgess == 0) {
        console.log("new active Waypoint, replacing Previous: ", curActiveWaypoint);
        animateWaypoint();
        curActiveWaypoint = whichWaypoint;
    }

	for (i = 0; i < 10; i++) {
		// Notice we constructed our li#id names to make this easy
		var currentWaypoint = document.getElementById('waypoint-' + i);
		if ( i == whichWaypoint ) {

			currentWaypoint.classList.add('active-waypoint');

		}
		
		else {
			currentWaypoint.classList.remove('active-waypoint');
		}
		
	}

	// Seek to the proportional time of the 38s clip of Bey's "Countdown"
	document.getElementById('Countdown').currentTime = fractionScrolled * 38.0;
}

function waypointClickHandler(e) {
	console.log('click');
	for (i = 0; i < waypoints.length; i++) {
		if (waypoints[i] === this) {
			// RC: No need for the +1 since we fixed the floor in update waypoint
			scrolled = (i)*100;
			updateWaypoints();

			//animateWaypoint();

			console.log(scrolled);
		}
	}
}

// use to add text description for each waypoint
function MouseOverHandler(e) {
	console.log('waypoint:', this);
	my_div = document.getElementById("wp-desc");
	for (i = 0; i < waypoints.length; i++) {
		if (waypoints[i] === this) {
			// RC: change cursor to pointer and add html text describing waypoint
			//new_div = document.createElement("div");
			//my_div = document.getElementById('wp-' + i);
			newContent = document.createTextNode(document.getElementById('waypoint-' + i).title);
  			
  			// add the newly created element and its content into the DOM
  			//my_div.style.textAlign = 'right';
  			//new_div.appendChild(newContent); //add the text node to the newly created div.
  			my_div.appendChild(newContent);
  			my_div.style.top = (15 + 60*i)+'px';
  			//my_div.style.textIndent = -10em;
  			//var parentDiv = my_div.parentNode;

			// Insert the new element into the DOM before my_div
			//parentDiv.insertBefore(new_div, my_div);

		}
	}
}
// clear text
function MouseOutHandler(e) {
	
	for (i = 0; i < waypoints.length; i++) {
		if (waypoints[i] === this) {
			// my_div = document.getElementById("wp-desc");
			//my_div = document.getElementById('wp-' + i);
			my_div.removeChild(newContent);
			newContent = null;
			//var parentDiv = my_div.parentNode;
  			//parentDiv.removeChild(new_div);
  			//new_div = null;
		}
	}
}

function MouseWheelHandler(e) {
	// This function is called every time there's a mousewheelevent

	var rawScrolled = Math.max(-1, Math.min(1, e.wheelDelta));
	scrolled = Math.min(Math.max(0, scrolled - rawScrolled), scrollTotal);

	document.getElementsByTagName('header')[0].innerHTML = scrolled;
	updateWaypoints();
}
// this function updates waypoint to next on next-tri click
function nextTriangleClickHandler(e) {
	if (scrolled < scrollTotal) {
		scrolled += 100;
		updateWaypoints();
		//animateWaypoint();
	}
	else { 
		console.log ("reached the end, scrolled = ", scrolled);

	}

}

function animateWaypoint() {
    // flag to prevent user from interrupting animation in progress
    animationInProgess = 4;

	elem1 = document.getElementById('left-top');
	xMax = getPosition(elem1, 'left');
	yMax = getPosition(elem1, 'top');
	//elem1.style.position= 'relative'; 
	elem1.style.left = '0px';
	elem1.style.top = '0px';
	moveRightDown();

	elem2 = document.getElementById('left-bottom');
	xMax = getPosition(elem2, 'left');
	yMin = getPosition(elem2, 'top');
	elem2.style.left = '0px';
	elem2.style.top = '300px';
	moveRightUp();

	elem3 = document.getElementById('right-top');
	xMin3 = getPosition(elem3, 'left');
	xMin3 = 830;
	yMax3 = getPosition(elem3, 'top');
	elem3.style.left = '1040px';
	elem3.style.top = '0px';
	moveLeftDown();

	elem4 = document.getElementById('right-bottom');
	xMin4 = getPosition(elem4, 'left');
	xMin4 = 830;
	yMax4 = getPosition(elem4, 'top');
	elem4.style.left = '1040px';
	elem4.style.top = '300px';
	moveLeftUp();
}

function move(element, x, y) {
	element.style.left = x;
	element.style.top = y;
}

function animateRightUp(element, xFinal, yFinal) {

	var speed = 2,
        dt = 2;

    xPos = getPosition(element, 'left');
    yPos = getPosition(element, 'top');
    if (xPos < xFinal) {
    	var xMoveTo = Math.min(xPos + speed*dt,xFinal) + 'px';
    	var yMoveTo = yPos+'px';
    }
    else {
    	speed = 2;
    	var xMoveTo = xPos + 'px';
    	var yMoveTo = Math.max(yPos - speed*dt,yFinal) + 'px';
	}
    
	move(element, xMoveTo, yMoveTo);

}

function animateRightDown(element, xFinal, yFinal) {

	var speed = 2,
        dt = 2;

    xPos = getPosition(element, 'left');
    yPos = getPosition(element, 'top');
    if (xPos < xFinal) {
    	var xMoveTo = Math.min(xPos + speed*dt,xFinal) + 'px';
    	var yMoveTo = yPos+'px';
    }
    else {
    	var xMoveTo = xPos + 'px';
    	var yMoveTo = Math.min(yPos + speed*dt,yFinal) + 'px';
	}
    
	move(element, xMoveTo, yMoveTo);

}
function animateLeftDown(element, xFinal, yFinal) {

	var speed = 2,
        dt = 2;

    xPos3 = getPosition(element, 'left');
    yPos3 = getPosition(element, 'top');
    console.log(xFinal, xPos);
    if (xPos3 > xFinal) {
    	var xMoveTo = Math.max(xPos3 - speed*dt,xFinal) + 'px';
    	var yMoveTo = yPos3+'px';
    }
    else {
    	var xMoveTo = xPos3 + 'px';
    	var yMoveTo = Math.min(yPos3 + speed*dt,yFinal) + 'px';
	}
    console.log(xMoveTo,yMoveTo);
	move(element, xMoveTo, yMoveTo);

}

function animateLeftUp(element, xFinal, yFinal) {

	var speed = 2,
        dt = 2;

    xPos4 = getPosition(element, 'left');
    yPos4 = getPosition(element, 'top');
    console.log(xFinal, xPos);
    if (xPos3 > xFinal) {
    	var xMoveTo = Math.max(xPos4 - speed*dt,xFinal) + 'px';
    	var yMoveTo = yPos4+'px';
    }
    else {
    	var xMoveTo = xPos4 + 'px';
    	var yMoveTo = Math.min(yPos4 + speed*dt,yFinal) + 'px';
	}
    console.log(xMoveTo,yMoveTo);
	move(element, xMoveTo, yMoveTo);

}

function moveRightUp() {
	var animationFrame = webkitRequestAnimationFrame(moveRightUp);

	animateRightUp(elem2, xMax, yMin);

	if (xPos >= xMax && yPos <= yMin) {  
		console.log("Closing the animation frame; xPos = " + xMax + " and yPos = " + yPos);
		webkitCancelAnimationFrame(animationFrame);
        animationInProgess = animationInProgess - 1;
        console.log("Done moving RightUp, animationInProgress count: ", animationInProgess);

	}
}

function moveRightDown() {
	var animationFrame = webkitRequestAnimationFrame(moveRightDown);

	animateRightDown(elem1, xMax, yMax);

	if (xPos >= xMax && yPos >= yMax) {  
		console.log("Closing the animation frame; xPos = " + xMax + " and yPos = " + yPos);
		webkitCancelAnimationFrame(animationFrame);
		animationInProgess = animationInProgess - 1;
        console.log("Done moving RightDown, animationInProgress count: ", animationInProgess);
	}
}

function moveLeftDown() {
	var animationFrame = webkitRequestAnimationFrame(moveLeftDown);

	animateLeftDown(elem3, xMin3, yMax3);

	if (xPos3 <= xMin3 && yPos3 >= yMax3) {  
		console.log("Closing the animation frame; xPos = " + xMax + " and yPos = " + yPos);
		webkitCancelAnimationFrame(animationFrame);
		animationInProgess = animationInProgess - 1;
        console.log("Done moving RightLeftDown, animationInProgress count: ", animationInProgess);
	}
}

function moveLeftUp() {
	var animationFrame = webkitRequestAnimationFrame(moveLeftUp);

	animateLeftUp(elem4, xMin4, yMax4);

	if (xPos4 <= xMin4 && yPos4 >= yMax4) {  
		console.log("Closing the animation frame; xPos = " + xMax + " and yPos = " + yPos);
		webkitCancelAnimationFrame(animationFrame);
		animationInProgess = animationInProgess - 1;
        console.log("Done moving LeftUp, animationInProgress count: ", animationInProgess);
	}
}

function getPosition(element, attribute) {
	return parseInt(window.getComputedStyle(element)[attribute], 10);
}