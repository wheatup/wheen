# Wheen

A lite-weight animation solution.

Integrated with Cocos Creator.

### Usage

```javascript
const obj = {x: 0, y: 0, scaleX: 1, scaleY: 1};

let wheen = new Wheen(obj)																// Create new animation for obj
	.from({x: 0, y: 0, scaleX: 1, scaleY: 1})										// Set the starting point(optional)
	.to({x: 50}, 1000)																	// Move to (50, 0) in 1 second
	.setFlag('START')																		// Set a flag for looping
	.to({scaleX: 1.2, scaleY: 0.8}, 50, Wheen.Easing.Cubic.easeIn)			// Compress
	.to({scaleX: 0.8, scaleY: 1.2}, 50, Wheen.Easing.Cubic.easeOut)		// Stretch	
	.to({y: 500}, 1000, Wheen.Easing.Cubic.easeOut)								// Jump to the air
	.callFunc(()=>{console.log("I'm on the air!")})								// Make a function call
	.to({y: 0}, 1000, Wheen.Easing.Cubic.easeIn)									// Fall back down
	.to({scaleX: 1.2, scaleY: 0.8}, 50, Wheen.Easing.Cubic.easeIn)			// Compress
	.to({scaleX: 1, scaleY: 1}, 50, Wheen.Easing.Cubic.easeOut)				// Restore
	.loop(2, 'START')																		// Loop from 'START' point to here, twice
	.callFunc(function(){console.log(`Finished at ${this.x}!`)}, obj)		// Finish callback
	.start();																				// Start the animation immediately

// Pause the animation
wheen.pause();

// Resume the animation
wheen.resume();

// Pause all animations on an object
Wheen.pause(obj);

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