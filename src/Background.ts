import App from "./App";
import { Sprite, Container } from "pixi.js";
import Pipe from "./Pipe";
import { Power1, TweenLite } from "gsap/gsap-core";

export default class Background extends Container {
	private readonly _bg: PIXI.Sprite;

	constructor() {
		super();

		this._bg = new Sprite(App.assets['background.png']);
		this._bg.anchor.set(0.5, 0);
		this.addChild(this._bg);
		this.addChild(new Pipe(this));
	}
}
