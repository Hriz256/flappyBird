import { Container } from "pixi.js";
import App from "./App";
import Bird from "./Bird";
import Background from "./Background";
import Ground from "./Ground";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";

class Scene extends Container {
	private readonly _app: App;
	private _bg: Background;
	private _bird: Bird;
	private _ground: Ground;

	constructor() {
		super();

		this._app = new App({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
			resolution: 1,
			resizeTo: window
		});

		PixiPlugin.registerPIXI(PIXI);
		gsap.registerPlugin(PixiPlugin);

		(async () => {
			await this._app.uploadPictures();

			this._bg = new Background();
			Bird.createBird(this._bg);
			this._ground = new Ground(this._bg);

			this.addChild(this._bg, Bird.bird, this._ground);
			this.refreshSize();
		})();

		this._app.stage.addChild(this);

		window.addEventListener("resize", this.refreshSize.bind(this));
	}

	private refreshSize(): void {
		const ratio = this.height / window.innerHeight;

		this.height = window.innerHeight;
		this.width /= ratio;

		this.position.x = this._app.view.width / 2;
	}
}

new Scene();

