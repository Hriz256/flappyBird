export const doPolygonsIntersect = (a: { x: number; y: number }[], b: { x: number; y: number }[]) => {
	const polygons = [a, b];
	let minA, maxA, projected, j, minB, maxB;

	for (let i = 0; i < polygons.length; i++) {
		const polygon = polygons[i];

		for (let i1 = 0; i1 < polygon.length; i1++) {
			const i2 = (i1 + 1) % polygon.length;
			const p1 = polygon[i1];
			const p2 = polygon[i2];

			const normal = { x: p2.y - p1.y, y: p1.x - p2.x };

			minA = undefined;
			maxA = undefined;

			for (j = 0; j < a.length; j++) {
				projected = normal.x * a[j].x + normal.y * a[j].y;
				if (minA === undefined || projected < minA) {
					minA = projected;
				}
				if (maxA === undefined || projected > maxA) {
					maxA = projected;
				}
			}

			minB = undefined;
			maxB = undefined;

			for (j = 0; j < b.length; j++) {
				projected = normal.x * b[j].x + normal.y * b[j].y;
				if (minB === undefined || projected < minB) {
					minB = projected;
				}
				if (maxB === undefined || projected > maxB) {
					maxB = projected;
				}
			}

			if (maxA < minB || maxB < minA) {
				return false;
			}
		}
	}

	return true;
}
