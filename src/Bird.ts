import App from "./App";
import { AnimatedSprite } from "pixi.js";
import { TweenLite, gsap, TimelineMax, Linear, Power1 } from "gsap";
import Background from "./Background";
import * as PIXI from "pixi.js"

export default class Bird {
	private static _bird: AnimatedSprite;
	private static _multiplier: number;
	private static _bgContainer: Background;

	public static createBird(bgContainer: Background): void {
		const skins = Array.from({ length: 3 }, (_, index) => App.assets[`bird-${index}.png`]);

		this._bgContainer = bgContainer;
		this._multiplier = 13;

		Bird._bird = new AnimatedSprite(skins);
		Bird._bird.anchor.set(0.5);
		Bird._bird.position.set(-Bird._bird.width / 2, App.view.height / 2);
		Bird._bird.animationSpeed = 0.3;
		Bird._bird.play();

		window.addEventListener("keydown", (e) => e.code === "Space" && Bird.up());
	}

	public static get bird(): PIXI.AnimatedSprite {
		return this._bird;
	}

	private static up(): void {
		gsap.killTweensOf(Bird._bird);

		TweenLite.to(Bird._bird, 0.2, {
			ease: Power1.easeInOut,
			y: `-=${Bird._bird.height * 2}`,
			rotation: -0.5,
			onComplete: () => {
				this.down();
			}
		});
	}

	private static down(): void {
		gsap.killTweensOf(Bird._bird);

		const timeline = new TimelineMax();
		const speed = ((App.view.height - Bird._bird.y) / Bird._bird.height) / Bird._multiplier;

		timeline
			.delay(0.08)
			.to(Bird._bird, speed, {
				ease: Linear.easeNone,
				y: Bird._bgContainer.y + Bird._bgContainer.height - Bird._bird.height / 2,
			})
			.to(Bird._bird, 0.2, {
				ease: Linear.easeNone,
				rotation: 1.57,
				// onComplete: () => console.log(2)
			}, 0.3)
	}

	public static checkCollision(sprites: PIXI.Sprite[]): boolean {
		return sprites.some(sprite => {
			const { x: globalBirdX } = Bird.bird.toGlobal(new PIXI.Point(Bird.bird.x, Bird.bird.y));
			const { x: spriteX } = sprite.toGlobal(new PIXI.Point(sprite.x, sprite.y));

			console.log(globalBirdX + Bird.bird.width / 2 < spriteX + sprite.width / 2
				&& globalBirdX - Bird.bird.width / 2 > spriteX - sprite.width / 2)

			return globalBirdX + Bird.bird.width / 2 < spriteX + sprite.width / 2
				&& globalBirdX - Bird.bird.width / 2 > spriteX - sprite.width / 2
				&& Bird.bird.y - Bird.bird.height / 2 < sprite.y + sprite.height
				&& Bird.bird.y + Bird.bird.height / 2 > sprite.y;
		});
	}
}
