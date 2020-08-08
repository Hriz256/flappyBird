import { BaseRenderTexture, Container, RenderTexture, Sprite, TilingSprite } from "pixi.js";
import { Linear, TweenLite } from "gsap/gsap-core";
import { App } from "../App";

export class Ground extends Container {
	private readonly _ground: PIXI.TilingSprite;
	private readonly _tween: TweenLite;

	constructor() {
		super();

		const container = new Container();
		const length = Math.ceil(App.assets["background.png"].width / App.assets["ground.png"].width);

		Array.from({ length }, (_, index) => {
			const img = new Sprite(App.assets["ground.png"]);
			img.x = index * App.assets["ground.png"].width;
			container.addChild(img);
		});

		const newGroundTexture = new RenderTexture(
			new BaseRenderTexture({
				width: App.assets["background.png"].width,
				height: App.assets["ground.png"].height,
			}),
		);

		App.renderer.render(container, newGroundTexture);

		this._ground = new TilingSprite(
			newGroundTexture, App.assets["background.png"].width, App.assets["ground.png"].height,
		);
		this._ground.anchor.set(0.5, 0);
		this._ground.y = App.assets["background.png"].height;
		this.addChild(this._ground);

		this._tween = TweenLite.to(this._ground, 3, {
			pixi: { tilePositionX: -App.assets["background.png"].width - App.assets["pipe.png"].width },
			ease: Linear.easeNone,
			repeat: -1,
		});
	}

	public gameOver(): void {
		this._tween.pause();
	}

	public restart(): void {
		this._tween.resume();
	}
}
