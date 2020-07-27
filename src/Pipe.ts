import { Container, Sprite, Graphics } from "pixi.js";
import App from "./App";
import Background from "./Background";
import {TweenLite, Linear, gsap} from "gsap/gsap-core";
import Bird from "./Bird";

export default class Pipe extends Container {
	private readonly _bgContainer: Background;
	private readonly _pipeMask: Graphics;
	private readonly _gap: number;

	constructor(bgContainer: Background) {
		super();

		this._gap = App.assets['bird-0.png'].height * 2;
		this._bgContainer = bgContainer;

		this._pipeMask = this.createMask();
		this._pipeMask.visible = false;
		this.addChild(this._pipeMask);

		setTimeout(this.createPipeContainer.bind(this), 3500);
	}

	private createPipeContainer() {
		this._pipeMask.visible = true;

		const container = new Container();
		container.x = this._bgContainer.width / 2 + App.assets['pipe.png'].width / 2;
		this.addChild(container);

		const upPipe = new Sprite(App.assets['pipe.png']);
		upPipe.anchor.set(0.5, 1);
		upPipe.angle = 180;
		upPipe.y = this._bgContainer.y - this.random(this._gap * 2, upPipe.height - this._gap);
		upPipe.mask = this._pipeMask;
		container.addChild(upPipe);

		const downPipe = new Sprite(App.assets['pipe.png']);
		downPipe.anchor.set(0.5, 0);
		downPipe.y = upPipe.y + downPipe.height + this._gap * 2;
		downPipe.mask = this._pipeMask;
		container.addChild(downPipe);

		let isHalfAnimation = false;

		TweenLite.to(container, 3, {
			pixi: {x: -this._bgContainer.width / 2 - App.assets['pipe.png'].width / 2},
			ease: Linear.easeNone,

			onUpdate: () => {
				if (!isHalfAnimation && +gsap.getTweensOf(container)[0].progress().toFixed(1) === 0.6) {
					isHalfAnimation = true;
					this.createPipeContainer();
				}

				const isCollision = Bird.checkCollision([upPipe]);

				isCollision && alert(isCollision)
			},

			onComplete: () => {
				container.destroy();
			},
		})
	}

	private createMask(): Graphics {
		return new Graphics()
			.beginFill(0xFFF)
			.drawRect(-this._bgContainer.width / 2, 0, this._bgContainer.width, this._bgContainer.height)
			.endFill()
	}

	private random(min: number, max: number): number {
		return Math.floor(min + Math.random() * (max + 1 - min));
	}
}