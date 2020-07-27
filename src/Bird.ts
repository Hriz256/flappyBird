import App from "./App";
import { AnimatedSprite, Container } from "pixi.js";
import { TweenLite, gsap, TimelineMax } from "gsap";

export default class Bird extends Container {
	private readonly _bird: AnimatedSprite;
	private _downTween: TweenLite;

	constructor() {
		super();

		const skins = [
			App.assets['bird-0.png'],
			App.assets['bird-1.png'],
			App.assets['bird-2.png']
		];

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
				console.log(1)
			}
		});
	}

	private down() {
		gsap.killTweensOf(this._bird);

		const timeline = new TimelineMax();

		timeline
			.to(this._bird, 1, {
				y: App.view.height,
			})
			.to(this._bird, 0.2, {
				rotation: 1.57,
				onComplete: () => console.log(2)
			}, 0.2)
	}
}
