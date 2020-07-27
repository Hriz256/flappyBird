import App from "./App";
import { Sprite, Container } from "pixi.js";

export default class Background extends Container {
	private readonly _bg: PIXI.Sprite;

	constructor() {
		super();

		this._bg = new Sprite(App.assets['background.png']);
		this._bg.anchor.set(0.5, 0);
		this.addChild(this._bg);
	}
}
