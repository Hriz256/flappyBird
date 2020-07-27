import { Application, LoaderResource, Renderer, Container, Ticker } from "pixi.js";

export default class App extends Application {
	private static _assets: Partial<Record<string, LoaderResource>>;
	private static _renderer: Renderer;
	private static _stage: Container;
	private static _view: HTMLCanvasElement;
	private static _ticker: Ticker;

	constructor(options: any) {
		super(options);

		document.addEventListener('contextmenu', e => e.preventDefault());
		document.body.append(this.view);

		this.stage.interactive = true;
		App._renderer = this.renderer;
		App._stage = this.stage;
		App._view = this.view;
		App._ticker = this.ticker;
		this.start();
	}

	public async uploadPictures() {
		await new Promise(resolve => {
			this.loader
				.add('sprites', 'assets/sprites.json')
				.load(({ resources }) => {
					App._assets = resources;
					resolve();
				});
		})
	}

	public static get assets() {
		return this._assets.sprites.textures;
	}

	public static get renderer() {
		return this._renderer
	}

	public static get stage() {
		return this._stage;
	}

	public static get view() {
		return this._view;
	}

	public static get ticker() {
		return this._ticker;
	}
}

