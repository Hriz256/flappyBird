import { Container, Sprite } from "pixi.js";
import { App } from "../../App";
import { ScorePointsText } from "./ScorePointsText";
import { RESTART } from "../Events";
import { TweenLite } from "gsap";

export class Menu extends Container {
	private readonly _scoreboard: PIXI.Sprite;
	private readonly _restartButton: PIXI.Sprite;
	private readonly _currentPoints: ScorePointsText;
	private readonly _recordOfScoredPoints: ScorePointsText;
	private readonly _restartFunctionLink: (event: KeyboardEvent | MouseEvent) => void;

	constructor(
		private readonly _currentPointsText: string,
		private readonly _recordPointsText: string,
	) {
		super();

		this._scoreboard = new Sprite(App.assets["score.png"]);
		this._scoreboard.anchor.set(0.5, 1);
		this._scoreboard.y = App.assets["background.png"].height * 0.55;
		this.addChild(this._scoreboard);

		this._restartButton = new Sprite(App.assets["restart.png"]);
		this._restartButton.anchor.set(0.5, 0);
		this._restartButton.y = this._scoreboard.y + this._restartButton.height * 0.6;
		this._restartButton.interactive = true;
		this._restartButton.buttonMode = true;
		this.addChild(this._restartButton);

		this._currentPoints = new ScorePointsText(50, this._currentPointsText);
		this._currentPoints.anchor.y = 1;
		this._currentPoints.y = this._scoreboard.y - this._scoreboard.height * 0.47;
		this.addChild(this._currentPoints);

		this._recordOfScoredPoints = new ScorePointsText(50, this._recordPointsText);
		this._recordOfScoredPoints.y = App.assets["background.png"].height * 0.49;
		this.addChild(this._recordOfScoredPoints);

		this._restartFunctionLink = this.restart.bind(this);

		TweenLite.fromTo(
			this,
			0.5,
			{ y: "-=100" },
			{ y: "+=100", onComplete: () => this.createControlEvents() },
		);
	}

	private createControlEvents() {
		window.addEventListener("keydown", this._restartFunctionLink);
		this._restartButton.once("pointerdown", this._restartFunctionLink);
	}

	private restart(event: KeyboardEvent | MouseEvent) {
		if (event instanceof KeyboardEvent && event.code !== "Space") {
			return;
		}

		App.emitter.emit(RESTART);
		window.removeEventListener("keydown", this._restartFunctionLink);
		this.destroy();
	}
}

