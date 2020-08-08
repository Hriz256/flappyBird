import { Container, Sprite, Graphics } from "pixi.js";
import { TweenLite, Linear, gsap } from "gsap/gsap-core";
import { Bird } from "./Bird";
import { App } from "../App";
import { GAME_OVER, INCREASE_POINTS } from "./Events";
import { convertArrayToObjectsArray } from "./utils/ConvertArrayToObjectsArray";
import { doPolygonsIntersect } from "./utils/DoPolygonsIntersect";

export class Pipe extends Container {
	private readonly _pipeMask: Graphics;
	private readonly _gap: number;
	private readonly _bird: Bird;
	private _currentPipesContainer: Container;
	private _previousPipesContainer: Container;
	private _pipesCreateTimeout: number;

	constructor(bird: Bird) {
		super();

		this._bird = bird;
		this._gap = App.assets["bird-0.png"].height;

		this._pipeMask = this.createMask();
		this._pipeMask.visible = false;
		this.addChild(this._pipeMask);
	}

	private createPipeContainer(): void {
		this._pipeMask.visible = true;

		this._currentPipesContainer = new Container();
		this._currentPipesContainer.x = App.assets["background.png"].width / 2 + App.assets["pipe.png"].width / 2;
		this.addChild(this._currentPipesContainer);

		const upPipe = new Sprite(App.assets["pipe.png"]);
		upPipe.anchor.set(0.5, 0);
		upPipe.angle = 180;
		upPipe.y = this.random(this._gap * 2, upPipe.height - this._gap * 4);
		upPipe.mask = this._pipeMask;
		this._currentPipesContainer.addChild(upPipe);

		const downPipe = new Sprite(App.assets["pipe.png"]);
		downPipe.anchor.set(0.5, 0);
		downPipe.y = upPipe.y + this._gap * 4;
		downPipe.mask = this._pipeMask;
		this._currentPipesContainer.addChild(downPipe);

		let isHalfAnimation = false;

		TweenLite.to(this._currentPipesContainer.children, 3, {
			x: -App.assets["background.png"].width - App.assets["pipe.png"].width,
			ease: Linear.easeNone,

			onUpdate: () => {
				const progress = gsap.getTweensOf(this._currentPipesContainer.children[0])[0].progress();

				if (!isHalfAnimation && +progress.toFixed(2) === 0.52) {
					isHalfAnimation = true;
					this._previousPipesContainer = this._currentPipesContainer;
					this.createPipeContainer();
					App.emitter.emit(INCREASE_POINTS);
				}

				let collisionArray = [...this._currentPipesContainer.children];

				if (this._previousPipesContainer) {
					collisionArray = [...collisionArray, ...this._previousPipesContainer.children];
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				const vertexArray = collisionArray.map(sprite => sprite.vertexData);

				this.checkCollision(vertexArray) && App.emitter.emit(GAME_OVER);
			},

			onComplete: () => this._previousPipesContainer.destroy(),
		});
	}

	public startMovement(): void {
		this._pipesCreateTimeout = window.setTimeout((this.createPipeContainer.bind(this)), 3500);
	}

	public gameOver(): void {
		gsap.killTweensOf(this._currentPipesContainer?.children);
		gsap.killTweensOf(this._previousPipesContainer?.children);
		clearTimeout(this._pipesCreateTimeout);
	}

	public restart(): void {
		this._currentPipesContainer?.destroy();
		this._previousPipesContainer?.destroy();
	}

	private checkCollision(spritesVertexArray: number[][]): boolean {
		return spritesVertexArray.some(vertexArray => {
			return doPolygonsIntersect(
				convertArrayToObjectsArray(this._bird.vertexArray),
				convertArrayToObjectsArray(vertexArray),
			);
		});
	}

	private createMask(): Graphics {
		return new Graphics()
			.beginFill(0xFFF)
			.drawRect(
				-App.assets["background.png"].width / 2, 0,
				App.assets["background.png"].width, App.assets["background.png"].height,
			)
			.endFill();
	}

	private random(min: number, max: number): number {
		return Math.floor(min + Math.random() * (max + 1 - min));
	}
}
