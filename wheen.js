const wheens = new Map();

var wheen = (window => {
	let initiated = false;

	const update = dt => {
		wheens.forEach(wheenChains => wheenChains.forEach(wheenChain => wheenChain._update(dt)));
	};

	const initiate = () => {
		if (typeof cc !== 'undefined' && cc.ENGINE_VERSION) {
			if (cc.Canvas.instance) {
				try {
					cc.Canvas.instance.node.addComponent(cc.Class({
						extends: cc.Component,
						update: dt => update(dt * 1000)
					}));
					initiated = true;
					console.log('Wheen has been successfully intergrated with Cocos Creator, enjoy!');
				} catch (ex) {
					console.error(ex);
				}
			}
		} else {
			let lastUpdateTime = new Date().getTime();
			const loop = () => {
				let now = new Date().getTime();
				update(now - lastUpdateTime);
				lastUpdateTime = now;
				requestAnimationFrame(loop);
			};
			loop();
			initiated = true;
			console.log('Wheen activated!');
		}
	}

	class WheenChain {
		constructor(target, config) {
			this.target = target;
			this.config = config;
			this.chain = [];
			this.pointer = -1;
			this.started = false;
			this.stopped = false;
			this.paused = false;
			this.currentNode = null;
			this.flags = new Map();
			this.events = [];
		}

		from(args) {
			this.chain.push(new WheenNode(this, {
				type: 'FROM',
				args
			}));
			return this;
		}

		wait(delay) {
			this.chain.push(new WheenNode(this, {
				type: 'WAIT',
				delay,
			}));
			return this;
		}

		to(args, delay, easing, options) {
			this.chain.push(new WheenNode(this, {
				type: 'TO',
				args,
				delay,
				easing,
				options
			}));
			return this;
		}

		on(event, func, thisArg, ...args) {
			if (!this.events[event]) {
				this.events[event] = [{
					event,
					func,
					thisArg,
					args
				}];
			} else {
				this.events[event].push({
					event,
					func,
					thisArg,
					args
				});
			}
			return this;
		}

		by(args, delay, easing, options) {
			this.chain.push(new WheenNode(this, {
				type: 'BY',
				args,
				delay,
				easing,
				options
			}));
			return this;
		}

		setFlag(flag) {
			this.flags.set(flag, this.chain.length);
			return this;
		}

		loop(count, flag) {
			this.chain.push(new WheenNode(this, {
				type: 'LOOP',
				options: {
					count: count || 0,
					flag,
					laps: count || 0
				}
			}));
			return this;
		}

		invoke(func, thisArg, ...args) {
			this.chain.push(new WheenNode(this, {
				type: 'INVOKE',
				options: {
					func,
					thisArg,
					args
				}
			}));
			return this;
		}

		start() {
			this.started = true;
			this._nextNode();
			if (this.events['start']) {
				this.events['start'].forEach(({ func, thisArg, args }) => {
					if (thisArg) {
						func.call(thisArg, ...args);
					} else {
						func(...args);
					}
				})
			}
			return this;
		}

		stop() {
			wheens.set(this.target, wheens.get(this.target).filter(tweenChain => tweenChain !== this));
			this.stopped = true;
			if (this.events['finish']) {
				this.events['finish'].forEach(({ func, thisArg, args }) => {
					if (thisArg) {
						func.call(thisArg, ...args);
					} else {
						func(...args);
					}
				})
			}
			return this;
		}

		pause() {
			this.paused = true;
		}

		resume() {
			this.paused = false;
		}

		_nextNode() {
			this._setNode(this.pointer + 1);
		}

		_setNode(index) {
			this.pointer = index;
			if (this.pointer >= this.chain.length) {
				this.stop();
				return;
			}

			this.currentNode = this.chain[this.pointer];
			this.currentNode.start();
		}

		_update(dt) {
			if (!this.started || this.stopped || this.paused) {
				return;
			}

			if (this.currentNode.finished) {
				this._nextNode();
				this._update(dt);
				return;
			}

			if (['TO', 'BY', 'WAIT'].includes(this.currentNode.type)) {
				this.currentNode.update(dt);
			}

			if (this.events['update']) {
				this.events['update'].forEach(({ func, thisArg, args }) => {
					if (thisArg) {
						func.call(thisArg, ...args);
					} else {
						func(...args);
					}
				})
			}
		}
	}

	class WheenNode {
		constructor(chain, { type, args, delay, easing, options }) {
			this.chain = chain;
			this.type = type;
			this.delay = delay;
			this.args = args;
			this.easing = easing || Wheen.Easing.Linear;
			this.options = options || {};
			this.snapshot = null;
		}

		start() {
			console.log(this.type);
			if (this.type === 'SET_FLAG') {
				this.finished = true;
			} else if (this.type === 'INVOKE') {
				const { func, thisArg, args } = this.options;
				if (thisArg) {
					func.call(thisArg, ...args);
				} else {
					func(...args);
				}
				this.finished = true;
			} else if (this.type === 'FROM') {
				const apply = (args, target) => {
					Object.entries(args).forEach(([key, value]) => {
						if (typeof value === 'object') {
							apply(value, target[key]);
						} else {
							target[key] = value;
						}
					});
				};
				apply(this.args, this.chain.target);
				this.finished = true;
			} else if (this.type === 'LOOP') {
				if (this.options.count <= 0 || this.options.laps > 0) {
					let index = 0;
					if (this.options.flag) {
						index = this.chain.flags.get(this.options.flag) || 0;
					}
					this.chain._setNode(index);
					this.options.laps--;
					this.finished = true;
				} else {
					this.finished = true;
				}
			} else if (this.type === 'WAIT') {
				this.finished = false;
				this.elapsedTime = 0;
			} else if (['TO', 'BY', 'WAIT'].includes(this.type)) {
				this.finished = false;
				this.elapsedTime = 0;
				this.makeSnapshot();
			}
		}

		makeSnapshot() {
			this.snapshot = {};

			const snap = (args, snapshot, target, getter) => {
				Object.entries(args).forEach(([key, value]) => {
					if (typeof value === 'object') {
						snapshot[key] = {};
						snap(value, snapshot[key], target[key])
					} else {
						if (getter) {
							snapshot[key] = getter(target[key]);
						} else {
							snapshot[key] = target[key];
						}
					}
				});
			}

			snap(this.args, this.snapshot, this.chain.target, this.options.get);
		}

		update(dt) {
			if (this.elapsedTime >= this.delay) return;

			this.elapsedTime += dt;

			if (this.elapsedTime >= this.delay) {
				this.finished = true;
				this.elapsedTime = this.delay;
			}

			if (this.type === 'WAIT') {
				return;
			}

			this.applyArgs(this.args, this.snapshot, this.chain.target, this.easing, this.options.set);
		}

		applyArgs(args, snapshot, target, easing, setter) {
			Object.entries(args).forEach(([key, value]) => {
				if (typeof easing === 'object') {
					easing = easing[key];
				}

				if (typeof value === 'object') {
					this.applyArgs(value, snapshot[key], target[key], easing, setter)
				} else {
					const startValue = snapshot[key];
					const targetValue = this.type === 'BY' ? snapshot[key] + args[key] : args[key];
					const computedValue = easing(this.elapsedTime, startValue, targetValue - startValue, this.delay);
					if (setter) {
						target[key] = setter(computedValue);
					} else {
						target[key] = computedValue;
					}
				}
			});
		}
	}

	initiate();

	return (target, config) => {
		if (!initiated) {
			initiate();
		}
		const chain = new WheenChain(target, config);
		if (wheens.has(target)) {
			wheens.get(target).push(chain);
		} else {
			wheens.set(target, [chain]);
		}
		return chain;
	};

})(window);

var Wheen = {
	Easing: {
		Linear: function (t, s, e, i) {
			return (e * t) / i + s;
		},
		Quad: {
			easeIn: function (t, s, e, i) {
				return e * (t /= i) * t + s;
			},
			easeOut: function (t, s, e, i) {
				return -e * (t /= i) * (t - 2) + s;
			},
			easeInOut: function (t, s, e, i) {
				return (t /= i / 2) < 1 ? (e / 2) * t * t + s : (-e / 2) * (--t * (t - 2) - 1) + s;
			}
		},
		Cubic: {
			easeIn: function (t, s, e, i) {
				return e * (t /= i) * t * t + s;
			},
			easeOut: function (t, s, e, i) {
				return e * ((t = t / i - 1) * t * t + 1) + s;
			},
			easeInOut: function (t, s, e, i) {
				return (t /= i / 2) < 1 ? (e / 2) * t * t * t + s : (e / 2) * ((t -= 2) * t * t + 2) + s;
			}
		},
		Quart: {
			easeIn: function (t, s, e, i) {
				return e * (t /= i) * t * t * t + s;
			},
			easeOut: function (t, s, e, i) {
				return -e * ((t = t / i - 1) * t * t * t - 1) + s;
			},
			easeInOut: function (t, s, e, i) {
				return (t /= i / 2) < 1 ? (e / 2) * t * t * t * t + s : (-e / 2) * ((t -= 2) * t * t * t - 2) + s;
			}
		},
		Quint: {
			easeIn: function (t, s, e, i) {
				return e * (t /= i) * t * t * t * t + s;
			},
			easeOut: function (t, s, e, i) {
				return e * ((t = t / i - 1) * t * t * t * t + 1) + s;
			},
			easeInOut: function (t, s, e, i) {
				return (t /= i / 2) < 1 ? (e / 2) * t * t * t * t * t + s : (e / 2) * ((t -= 2) * t * t * t * t + 2) + s;
			}
		},
		Sine: {
			easeIn: function (t, s, e, i) {
				return -e * Math.cos((t / i) * (Math.PI / 2)) + e + s;
			},
			easeOut: function (t, s, e, i) {
				return e * Math.sin((t / i) * (Math.PI / 2)) + s;
			},
			easeInOut: function (t, s, e, i) {
				return (-e / 2) * (Math.cos((Math.PI * t) / i) - 1) + s;
			}
		},
		Expo: {
			easeIn: function (t, s, e, i) {
				return 0 == t ? s : e * Math.pow(2, 10 * (t / i - 1)) + s;
			},
			easeOut: function (t, s, e, i) {
				return t == i ? s + e : e * (1 - Math.pow(2, (-10 * t) / i)) + s;
			},
			easeInOut: function (t, s, e, i) {
				return 0 == t ? s : t == i ? s + e : (t /= i / 2) < 1 ? (e / 2) * Math.pow(2, 10 * (t - 1)) + s : (e / 2) * (2 - Math.pow(2, -10 * --t)) + s;
			}
		},
		Circ: {
			easeIn: function (t, s, e, i) {
				return -e * (Math.sqrt(1 - (t /= i) * t) - 1) + s;
			},
			easeOut: function (t, s, e, i) {
				return e * Math.sqrt(1 - (t = t / i - 1) * t) + s;
			},
			easeInOut: function (t, s, e, i) {
				return (t /= i / 2) < 1 ? (-e / 2) * (Math.sqrt(1 - t * t) - 1) + s : (e / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + s;
			}
		},
		Elastic: {
			easeIn: function (t, s, e, i, n, h) {
				if (0 == t) return s;
				if (1 == (t /= i)) return s + e;
				if ((h || (h = 0.3 * i), !n || n < Math.abs(e))) {
					n = e;
					var a = h / 4;
				} else a = (h / (2 * Math.PI)) * Math.asin(e / n);
				return -n * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) + s;
			},
			easeOut: function (t, s, e, i, n, h) {
				if (0 == t) return s;
				if (1 == (t /= i)) return s + e;
				if ((h || (h = 0.3 * i), !n || n < Math.abs(e))) {
					n = e;
					var a = h / 4;
				} else a = (h / (2 * Math.PI)) * Math.asin(e / n);
				return n * Math.pow(2, -10 * t) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) + e + s;
			},
			easeInOut: function (t, s, e, i, n, h) {
				if (0 == t) return s;
				if (2 == (t /= i / 2)) return s + e;
				if ((h || (h = i * (0.3 * 1.5)), !n || n < Math.abs(e))) {
					n = e;
					var a = h / 4;
				} else a = (h / (2 * Math.PI)) * Math.asin(e / n);
				return t < 1
					? n * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) * -0.5 + s
					: n * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) * 0.5 + e + s;
			}
		},
		Back: {
			easeIn: function (t, s, e, i, n) {
				return null == n && (n = 1.70158), e * (t /= i) * t * ((n + 1) * t - n) + s;
			},
			easeOut: function (t, s, e, i, n) {
				return null == n && (n = 1.70158), e * ((t = t / i - 1) * t * ((n + 1) * t + n) + 1) + s;
			},
			easeInOut: function (t, s, e, i, n) {
				return null == n && (n = 1.70158), (t /= i / 2) < 1 ? (e / 2) * (t * t * ((1 + (n *= 1.525)) * t - n)) + s : (e / 2) * ((t -= 2) * t * ((1 + (n *= 1.525)) * t + n) + 2) + s;
			}
		},
		Bounce: {
			easeIn: function (t, s, e, i) {
				return e - Easing.Bounce.easeOut(i - t, 0, e, i) + s;
			},
			easeOut: function (t, s, e, i) {
				return (t /= i) < 1 / 2.75
					? e * (7.5625 * t * t) + s
					: t < 2 / 2.75
						? e * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + s
						: t < 2.5 / 2.75
							? e * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + s
							: e * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + s;
			},
			easeInOut: function (t, s, e, i) {
				return t < i / 2 ? 0.5 * Easing.Bounce.easeIn(2 * t, 0, e, i) + s : 0.5 * Easing.Bounce.easeOut(2 * t - i, 0, e, i) + 0.5 * e + s;
			}
		}
	},
	get: (...args) => wheen(...args),
	start: target => {
		const _wheens = wheens.get(target);
		if (_wheens) {
			_wheens.forEach(w => w.start());
		}
	},
	stop: target => {
		const _wheens = wheens.get(target);
		if (_wheens) {
			_wheens.forEach(w => w.stop());
		}
	},
	pause: target => {
		const _wheens = wheens.get(target);
		if (_wheens) {
			_wheens.forEach(w => w.pause());
		}
	},
	resume: target => {
		const _wheens = wheens.get(target);
		if (_wheens) {
			_wheens.forEach(w => w.resume());
		}
	}
};