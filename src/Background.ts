import App from "./App";
import { Sprite, Container, RenderTexture, BaseRenderTexture, TilingSprite } from "pixi.js";

export default class Background extends Container {
	private readonly _bg: PIXI.Sprite;
	private readonly _ground: PIXI.TilingSprite;

	constructor() {
		super();

		this._bg = new Sprite(App.assets['background.png']);
		this._bg.anchor.set(0.5, 0);
		this.addChild(this._bg);

		const container = new Container();

		Array.from({ length: Math.ceil(this._bg.width / App.assets['ground.png'].width) }, (_, index) => {
			const img = new Sprite(App.assets['ground.png']);
			img.x = index * App.assets['ground.png'].width;
			container.addChild(img);
		});

		const newGroundTexture = new RenderTexture(
			new BaseRenderTexture({
				width: App.assets['background.png'].width,
				height: App.assets['ground.png'].height,
			})
		);

		App.renderer.render(container, newGroundTexture);

		this._ground = new TilingSprite(newGroundTexture, this._bg.width, App.assets['ground.png'].height);
		this._ground.anchor.set(0.5, 0);
		this._ground.y = this._bg.y + this._bg.height;
		this.addChild(this._ground);

		App.ticker.add(() => {
			this._ground.tilePosition.x -= 3;
		})
	}
}
