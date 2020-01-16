# Wheen

A lite-weight animation solution.

Integrated with Cocos Creator.

Even possible to tween nested attributes!

### Usage

#### Simple

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.to({x: 10, y: 20}, 1000)		// lerp x to 10, y to 20 after 1 second
	.start();
```

#### Delay

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.wait(1000)				// wait 1 second first
	.to({x: 10, y: 20}, 1000)		// lerp x to 10, y to 20 after 1 second
	.start();
```

#### From Attributes

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.from({x: -10})				// set x to -10 as soon as the wheen is started
	.to({x: 10, y: 20}, 1000)		// lerp x to 10, y to 20 after 1 second
	.start();
```

#### Call Function

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.to({x: 10, y: 20}, 1000)				// lerp x to 10, y to 20 after 1 second
	.callFunc(()=>{ console.log('Finished!') })		// call this function while approaching this point
	.start();
```

#### Loop

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.to({x: 10, y: 20}, 1000)		// lerp x to 10, y to 20 after 1 second
	.to({x: 0, y: 0}, 1000)			// lerp x to 0, y to 0 after 1 second
	.loop(3)				// loop the whole wheen for 3 times
	.start();
```

#### Easing

```javascript
const obj = {x: 0, y: 0};

new Wheen(obj)
	.to({x: 10, y: 20}, 1000, Wheen.Easing.Cubic.easeOut)		// lerp x to 10, y to 20 after 1 second using cubic easing out function
	.start();
```

#### Nested Attributes

```javascript
const obj = { 
	x: 0, 
	y: 0, 
	child: {x: 0, y: 0} 
};

new Wheen(obj)
	.to({
		x: 10, 
		child: {
			x: 20
		}
	}, 1000)		// lerp x to 10, x of it's child to 20 after 1 second
	.start();
```


#### Differentiate Assignment

```javascript
const obj = {x: 0, y: 0};

new Wheen(obj)
	.to(
		{x: 10, y: 20}, 						// lerp x to 10, y to 20
		1000
		{x: Wheen.Easing.Back.easeOut, y: Wheen.Easing.Linear}	// x using back easing out function, y using linear easing function
	)		
	.start();
```

#### Pre-assign methods

```javascript
const box = document.getElementById('box');

new Wheen(obj)
	.to(
		{ marginLeft: 200 }
		1000
		Wheen.Easing.Linear,
		{
			get: value => value.replace('px', ''),			// While getting the value, get rid of the 'px'
			set: value => value + 'px'						// While setting the value, put a 'px' at the end of the value
		}
	)		
	.start();
```


#### Events

```javascript
const obj = {x: 0, y: 0};

wheen(obj)
	.to({x: 10}, 1000, Wheen.Easing.Linear)
	.on('start', ()=> console.log('Tween start'));
	.on('update', () => console.log('Tween update'));
	.on('finish', ()=> console.log('Tween end'));
	.start();
```

#### Full Usage

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
	.on('finish', function(){ console.log(`Finished at ${this.x}!`); }, obj)
	
// Start the animation
wheen.start();

// Pause the animation
wheen.pause();

// Resume all the animation on an object
Wheen.resume(obj);

// Stop all animations on an object
Wheen.stop(obj);
```