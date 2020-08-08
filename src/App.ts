import { Application, LoaderResource, utils } from "pixi.js";
import WebFont from "./webfont";

class App extends Application {
	private static _assets: Partial<Record<string, LoaderResource>>;
	private static _renderer: PIXI.Renderer;
	private static _emitter: PIXI.utils.EventEmitter;

	constructor(options: any) {
		super(options);

		document.addEventListener("contextmenu", e => e.preventDefault());
		document.body.append(this.view);

		this.stage.interactive = true;
		this.init();
		this.start();
	}

	private init() {
		App._renderer = this.renderer;
		App._emitter = new utils.EventEmitter();
	}

	public async uploadResources() {
		await this.loadPictures();
		await this.loadFonts();
	}

	private async loadPictures() {
		App._assets = await new Promise<Partial<Record<string, LoaderResource>>>(resolve => {
			this.loader
				.add("sprites", "assets/sprites.json")
				.load(({ resources }) => resolve(resources));
		});
	}

	private loadFonts() {
		return new Promise((resolve) => {
			WebFont.load({
				custom: {
					families: ["FB"],
				},
				active: resolve,
			});
		});
	}

	public static get assets(): { [key: string]: PIXI.Texture } {
		return this._assets.sprites.textures;
	}

	public static get renderer(): PIXI.Renderer {
		return this._renderer;
	}

	public static get emitter(): PIXI.utils.EventEmitter {
		return this._emitter;
	}
}

export { App };

