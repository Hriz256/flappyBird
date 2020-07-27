import { Application, LoaderResource, Renderer } from "pixi.js";

export default class App extends Application {
	private static _assets: Partial<Record<string, LoaderResource>>;
	private static _renderer: Renderer;
	private static _view: HTMLCanvasElement;

	constructor(options: any) {
		super(options);

		document.addEventListener('contextmenu', e => e.preventDefault());
		document.body.append(this.view);

		this.stage.interactive = true;
		App._renderer = this.renderer;
		App._view = this.view;
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

	public static get view() {
		return this._view;
	}
}

