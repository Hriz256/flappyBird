import { Container } from "pixi.js";
import App from "./App";
import Bird from "./Bird";
import Background from "./Background";

class Scene extends Container {
	private _app: App;

	constructor() {
		super();

		this._app = new App({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
			resolution: 1,
			resizeTo: window
		});

		(async () => {
			await this._app.uploadPictures();

			this.addChild(new Background(), new Bird());
			this.refreshSize();
		})();

		this._app.stage.addChild(this);

		window.addEventListener("resize", this.refreshSize.bind(this));
	}

	private refreshSize(): void {
		let nvw;
		let nvh;

		if (window.innerHeight / window.innerWidth < window.screen.height / window.screen.width) {
			nvh = window.innerHeight;
			nvw = (nvh * window.screen.width) / window.screen.height;
		} else {
			nvw = window.innerWidth;
			nvh = (nvw * window.screen.height) / window.screen.width;
		}

		this.scale.set(nvw / window.screen.width, nvh / window.screen.height);

		this.position.x = this._app.view.width / 2;
		this.position.y = this._app.view.height / 2 - this.height / 2;
	}
}

new Scene();

