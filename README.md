# Wheen

A lite-weight animation solution.

Integrated with Cocos Creator.

Even possible to tween nested attributes!

### Usage

#### Simple

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.to({x: 10, y: 20}, 1000)		// x to 10, y to 20 after 1 second
	.start();
```

#### Delay

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.wait(1000)						// wait 1 second first
	.to({x: 10, y: 20}, 1000)		// x to 10, y to 20 after 1 second
	.start();
```

#### From Attributes

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.from({x: -10})					// set x to -10 as soon as the wheen is started
	.to({x: 10, y: 20}, 1000)		// x to 10, y to 20 after 1 second
	.start();
```

#### Call Function

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.to({x: 10, y: 20}, 1000)						// x to 10, y to 20 after 1 second
	.callFunc(()=>{ console.log('Finished!') })		// call this function while approaching this point
	.start();
```

#### Loop

```javascript
const obj = {x: 0, y: 0};
new Wheen(obj)
	.to({x: 10, y: 20}, 1000)				// x to 10, y to 20 after 1 second
	.to({x: 0, y: 0}, 1000)					// x to 0, y to 0 after 1 second
	.loop(3)			// loop the whole wheen for 3 times
	.start();
```

#### Easing

```javascript
const obj = {x: 0, y: 0};

new Wheen(obj)
	.to({x: 10, y: 20}, 1000, Wheen.Easing.Cubic.easeOut)		// x to 10, y to 20 after 1 second using cubic easing out function
	.start();
```

#### Nested Attributes

```javascript
const obj = { 
	x: 0, 
	y: 0, 
	child: { 
		x: 0, 
		y: 0 
	} 
};

new Wheen(obj)
	.to({x: 10, 'child.x': 20}, 1000)		// x to 10, x of it's child to 20 after 1 second
	.start();
```


#### Differentiate Assignment

```javascript
const obj = {x: 0, y: 0};

new Wheen(obj)
	.to(
		{x: 10, y: 20}, 				// x to 10, y to 20
		{x: 1000, y: 2000}				// x finish after 1 second, y finish after 2 seconds
		{x: Wheen.Easing.Back.easeOut, y: Wheen.Easing.Linear})		// x using back easing out function, y using linear easing function
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
	// Calls every frame while the tween is running
	.on('update', args => console.log('Current args', args))
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

### API

```typescript
declare interface EasingFunction{

}

declare class Wheen {
	/**
	 * stop all animations from an object
	 * @param target target
	 */
	static stop(target: any);

	/**
	 * start all animations from an object
	 * @param target target
	 */
	static start(target: any);

	/**
	 * pause all animations from an object
	 * @param target target
	 */
	static pause(target: any);

	/**
	 * resume all animations from an object
	 * @param target target
	 */
	static resume(target: any);

	/**
	 * create a new animation with given target.
	 * @param target target
	 */
	constructor(target?: any);

	/**
	 * apply the animation to the target.
	 * @param target target
	 */
	apply(target: any): Wheen;

	/**
	 * set the starting point.
	 * @param args attributes for starting point
	 */
	from(args: any): Wheen;

	/**
	 * lerp to given attributes
	 * @param args target attributes
	 * @param time total time, milliseconds
	 * @param easing easing function
	 * 
	 */
	to(args: any, time: number, easing?: EasingFunction): Wheen;

	/**
	 * wait a specific time
	 * @param time target attributes
	 */
	wait(time: number): Wheen;

	/**
	 * set a flag for looping
	 * @param flag flag name
	 */
	setFlag(flag: string|number|symbol): Wheen;

	/**
	 * loop animation
	 * @param count loop count, if less or equal 0, it's infinite
	 * @param flag flag name
	 */
	loop(count?: number, flag?: string|number|symbol): Wheen;

	/**
	 * call a function
	 * @param func the function need to be called
	 * @param self this context
	 * @param args arguments
	 */
	callFunc(func: Function, self?: any, ...args: any): Wheen;

	/**
	 * start the animation
	 */
	start();

	/**
	 * pause the animation
	 */
	pause();

	/**
	 * resume the animation
	 */
	resume();

	/**
	 * stop the animation
	 */
	stop();

	static Easing: {
		static Linear: EasingFunction;

		static Quad: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Cubic: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Quart: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Quint: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Sine: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Expo: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Circ: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Elastic: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Back: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Bounce: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}
	}
}
```