import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { App } from "./App";
import { Scene } from "./scene/Scene";

class Main {
	private readonly _app: App;
	private _scene: Scene;

	constructor() {
		this._app = new App({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
			resolution: 1,
			resizeTo: window,
		});

		PixiPlugin.registerPIXI(PIXI);
		gsap.registerPlugin(PixiPlugin);

		this._app.uploadResources().then(this.init.bind(this));

		window.addEventListener("resize", this.refreshSize.bind(this));
	}

	private init() {
		this._scene = new Scene();
		this._app.stage.addChild(this._scene);
		this.refreshSize();
	}

	private refreshSize(): void {
		const height = App.assets["background.png"].height + App.assets["ground.png"].height;

		const vpw = window.innerWidth;
		const vph = window.innerHeight;
		let nvw;
		let nvh;

		if (vph / vpw < height / App.assets["background.png"].width) {
			nvh = vph;
			nvw = (nvh * App.assets["background.png"].width) / height;
		} else {
			nvw = vpw;
			nvh = (nvw * height) / App.assets["background.png"].width;
		}

		App.renderer.resize(nvw, nvh);
		this._scene.scale.set(nvw / App.assets["background.png"].width, nvh / height);
		this._scene.position.x = this._app.view.width / 2;
	}
}

new Main();

