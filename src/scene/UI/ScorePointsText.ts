import { Text } from "pixi.js";

export class ScorePointsText extends Text {
	constructor(
		private fontSize: number,
		public text: string = "0",
	) {
		super(
			text,
			{
				fontFamily: "FB",
				fontSize,
				fill: 0xFFFFFF,
				stroke: 0x000000,
				strokeThickness: 10,
			},
		);

		this.anchor.set(0.5);
	}
}
