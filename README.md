# Wheen

A lite-weight animation solution.

Integrated with Cocos Creator.

### Usage

```javascript
	const obj = {x: 0, y: 0, scaleX: 1, scaleY: 1};

	// Create new wheen
	let wheen = new Wheen(obj)
		// Set the starting point(optional)
		.from({x: 0, y: 0, scaleX: 1, scaleY: 1})
		// Move to (50, 0) in 1 second
		.to({x: 50}, 1000)
		// Set a flag for looping
		.setFlag('START')
		// Compress
		.to({scaleX: 1.2, scaleY: 0.8}, 50, Wheen.Easing.Cubic.easeIn)
		// Stretch
		.to({scaleX: 0.8, scaleY: 1.2}, 50, Wheen.Easing.Cubic.easeOut)
		// Jump to the air
		.to({y: 500}, 1000, Wheen.Easing.Cubic.easeOut)
		// Make a function call
		.callFunc(()=>{console.log("I'm on the air!")})
		// Fall down
		.to({y: 0}, 1000, Wheen.Easing.Cubic.easeIn)
		// Compress
		.to({scaleX: 1.2, scaleY: 0.8}, 50, Wheen.Easing.Cubic.easeIn)
		// Restore
		.to({scaleX: 1, scaleY: 1}, 50, Wheen.Easing.Cubic.easeOut)
		// Loop from 'START' point, twice
		.loop(2, 'START')
		// Finish callback
		.callFunc(function(){console.log(`Finished at ${this.x}!`)}, obj)
		
	// Start the animation
	wheen.start();

	// Pause the animation
	setTimeout(()=>{
		wheen.pause();
	}, 2000);

	// Resume the animation
	setTimeout(()=>{
		wheen.resume();
	}, 3000);
```