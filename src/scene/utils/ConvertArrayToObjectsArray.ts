export const convertArrayToObjectsArray = (array: number[]) => {
	return array.reduce((acc, item, index) => {
		if (index % 2 !== 0) {
			acc[acc.length - 1].y = item;

			return [...acc];
		} else {
			return [...acc, { x: item }];
		}
	}, []);
};
