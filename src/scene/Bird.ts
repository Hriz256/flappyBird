import { AnimatedSprite } from "pixi.js";
import { TweenLite, gsap, TimelineMax, Linear, Sine } from "gsap";
import { App } from "../App";
import { GAME_OVER } from "./Events";

export class Bird extends AnimatedSprite {
	private readonly _multiplier: number = 12;
	private readonly _jumpHeight: number = this.height * 1.8;
	private readonly _upFunctionLink: (event: KeyboardEvent | MouseEvent) => void;

	constructor() {
		super(Array.from({ length: 3 }, (_, index) => App.assets[`bird-${index}.png`]));

		this.anchor.set(0.5);
		this.position.set(-this.width / 2, App.assets["background.png"].height / 2);
		this.animationSpeed = 0.1;

		this._upFunctionLink = this.up.bind(this);
		this.startFlight();
		this.createControlEvents();
	}

	private startFlight(): void {
		this.play();

		TweenLite.to(this, 0.4, {
			ease: Linear.easeNone,
			y: `+=${this.height * 0.4}`,
			yoyo: true,
			repeat: -1,
		});
	}

	public get vertexArray() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		return this.vertexData;
	}

	private up(event: KeyboardEvent | MouseEvent): void {
		if (event instanceof KeyboardEvent && event.code !== "Space") {
			return;
		}

		gsap.killTweensOf(this);

		TweenLite.to(this, 0.2, {
			ease: Sine.easeOut,
			y: `-=${this.y > -this.height ? this._jumpHeight : 0}`,
			angle: -20,
			onComplete: () => this.down(),
		});
	}

	public down(): void {
		gsap.killTweensOf(this);

		const timeline = new TimelineMax();
		const speed = ((App.assets["background.png"].height - this.y) / this.height) / this._multiplier;

		const initY = this.y;
		let isComeback = false;

		timeline
			.to(this, speed, {
				ease: Sine.easeIn,
				y: App.assets["background.png"].height - this.height / 3,

				onUpdate: () => {
					if (!isComeback && this.y - initY > this._jumpHeight) {
						isComeback = true;

						TweenLite.to(this, 0.2, {
							ease: Linear.easeNone,
							angle: 90,
						});
					}
				},

				onComplete: () => {
					if (this.playing) {
						App.emitter.emit(GAME_OVER);
						gsap.killTweensOf(this, "angle");
					}
				},
			});
	}

	public gameOver(): void {
		this.stop();
		window.removeEventListener("pointerdown", this._upFunctionLink);
		window.removeEventListener("keydown", this._upFunctionLink);
	}

	private createControlEvents(): void {
		window.addEventListener("pointerdown", this._upFunctionLink);
		window.addEventListener("keydown", this._upFunctionLink);
	}

	public restart(): void {
		gsap.killTweensOf(this);

		this.position.y = App.assets["background.png"].height / 2;
		this.angle = 0;
		this.startFlight();
		this.createControlEvents();
	}
}
