import App from "./App";
import { AnimatedSprite, Container } from "pixi.js";
import { TweenLite, gsap, TimelineMax } from "gsap";
import Background from "./Background";

export default class Bird extends Container {
	private readonly _bird: AnimatedSprite;
	private readonly _multiplier: number;
	private readonly _bgContainer: Background;

	constructor(bgContainer: Background) {
		super();

		const skins = Array.from({length: 3}, (_, index) => App.assets[`bird-${index}.png`])

		this._bgContainer = bgContainer;
		this._multiplier = 11;

		this._bird = new AnimatedSprite(skins);
		this._bird.anchor.set(0.5);
		this._bird.position.set(-this._bird.width / 2, App.view.height / 2);
		this._bird.animationSpeed = 0.3;
		this._bird.play();
		this.addChild(this._bird);

		window.addEventListener("keydown", (e) => e.code === "Space" && this.up());
	}

	private up() {
		gsap.killTweensOf(this._bird);

		TweenLite.to(this._bird, 0.2, {
			y: `-=${this._bird.height * 2}`,
			rotation: -0.5,
			onComplete: () => {
				this.down();
			}
		});
	}

	private down() {
		gsap.killTweensOf(this._bird);

		const timeline = new TimelineMax();
		const speed = ((App.view.height - this._bird.y) / this._bird.height) / this._multiplier;

		timeline
			.delay(0.07)
			.to(this._bird, speed, {
				y: this._bgContainer.y + this._bgContainer.height - this._bird.height / 2,
			})
			.to(this._bird, 0.2, {
				rotation: 1.57,
				// onComplete: () => console.log(2)
			}, 0.3)
	}
}
