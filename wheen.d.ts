declare class WheenChain {
	/**
	 * set the starting point.
	 * @param args attributes for starting point
	 */
	from(args: any): WheenChain;

	/**
	 * lerp to given attributes
	 * @param args target attributes
	 * @param time total time, milliseconds
	 * @param easing easing function
	 * @param options options
	 * 
	 */
	to(args: any, time: number | object, easing?: EasingFunction | object, options?: object): WheenChain;

	/**
	 * lerp to given attributes based on real-time values
	 * @param args target attributes
	 * @param time total time, milliseconds
	 * @param easing easing function
	 * @param options options
	 * 
	 */
	by(args: any, time: number | object, easing?: EasingFunction | object, options?: object): WheenChain;

	/**
	 * event system
	 * @param event event name
	 * @param func function needs to be called
	 * @param self caller
	 * @param args extra arguments
	 * 
	 */
	on(event: 'start' | 'finish' | 'update', func: Function, self?: any, ...args?: any): WheenChain;

	/**
	 * wait a specific time
	 * @param delay target attributes
	 */
	wait(delay: number): WheenChain;

	/**
	 * set a flag for looping
	 * @param flag flag name
	 */
	setFlag(flag: string | number | symbol): WheenChain;

	/**
	 * loop animation
	 * @param count loop count, if less or equal 0, it's infinite
	 * @param flag flag name
	 */
	loop(count?: number, flag?: string | number | symbol): WheenChain;

	/**
	 * call a function
	 * @param func the function need to be called
	 * @param self this context
	 * @param args arguments
	 */
	invoke(func: Function, self?: any, ...args: any): WheenChain;

	/**
	 * start the animation
	 */
	start(): WheenChain;

	/**
	 * pause the animation
	 */
	pause(): WheenChain;

	/**
	 * resume the animation
	 */
	resume(): WheenChain;

	/**
	 * stop the animation
	 */
	stop(): WheenChain;
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

/**
 * create a new animation with given target.
 * @param target target
 * @param options extra options
 */
declare function wheen(target: any, options?: object): WheenChain;