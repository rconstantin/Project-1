var scrollTotal = 1000;
var scrolled = 0; // A variable to keep track of how far we've scrolled.
var fractionScrolled = scrolled / scrollTotal;
var newContent = null;

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
	
	var animateId = document.getElementById('left-top');
	animateId.classList.remove('animate');
	animateId.classList.add('animate');

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
	animateId.classList.remove('animate');
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
	}
	else { 
		console.log ("reached the end, scrolled = ", scrolled);

	}
}