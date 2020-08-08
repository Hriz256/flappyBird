import { Container, Sprite } from "pixi.js";
import { Ground } from "./Ground";
import { Pipe } from "./Pipe";
import { Bird } from "./Bird";
import { App } from "../App";
import { Menu } from "./UI/Menu";
import { ScorePointsText } from "./UI/ScorePointsText";
import { GAME_OVER, INCREASE_POINTS, RESTART } from "./Events";

export class Scene extends Container {
	private readonly _bg: PIXI.Sprite;
	private readonly _ground: Ground;
	private readonly _pipe: Pipe;
	private readonly _bird: Bird;
	private readonly _currentPoints: ScorePointsText;
	private readonly _startGameFunctionLink: (event: KeyboardEvent | MouseEvent) => void;

	constructor() {
		super();

		this.interactive = true;

		this._bg = new Sprite(App.assets["background.png"]);
		this._bg.anchor.set(0.5, 0);
		this.addChild(this._bg);

		this._bird = new Bird();
		this._pipe = new Pipe(this._bird);
		this.addChild(this._pipe, this._bird);

		this._ground = new Ground();
		this.addChild(this._ground);

		this._currentPoints = new ScorePointsText(70);
		this._currentPoints.y = App.assets["background.png"].height * 0.15;
		this._currentPoints.visible = false;
		this.addChild(this._currentPoints);

		App.emitter.on(INCREASE_POINTS, this.increasePoints.bind(this));
		App.emitter.on(GAME_OVER, this.gameOver.bind(this));
		App.emitter.on(RESTART, this.restart.bind(this));

		this._startGameFunctionLink = this.startGame.bind(this);
		this.createStartEvents();
	}

	private increasePoints(): void {
		this._currentPoints.text = `${+this._currentPoints.text + 1}`;
	}

	private gameOver(): void {
		this.addChild(
			new Menu(
				this._currentPoints.text,
				`${Math.max(+localStorage.getItem("record"), +this._currentPoints.text)}`,
			),
		);

		if (+this._currentPoints.text > +localStorage.getItem("record")) {
			localStorage.setItem("record", this._currentPoints.text);
		}

		this._currentPoints.visible = false;
		[this._bird, this._pipe, this._ground].forEach(item => item.gameOver());
	}

	private restart(): void {
		[this._bird, this._pipe, this._ground].forEach(item => item.restart());
		this._currentPoints.text = "0";
		this.createStartEvents();
	}

	private startGame(event: KeyboardEvent | MouseEvent) {
		if (event instanceof KeyboardEvent && event.code !== "Space") {
			return;
		}

		this._currentPoints.visible = true;
		this._pipe.startMovement();

		window.removeEventListener("keydown", this._startGameFunctionLink);
		window.removeEventListener("pointerdown", this._startGameFunctionLink);
	}

	private createStartEvents(): void {
		window.addEventListener("keydown", this._startGameFunctionLink);
		window.addEventListener("pointerdown", this._startGameFunctionLink);
	}
}
