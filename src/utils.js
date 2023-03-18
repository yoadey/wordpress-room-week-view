
export function groupBy(xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

export function toTime(time) {
	return ("00" + Math.floor(time)).slice(-2) + ":" + ("00" + (60 * (time % 1))).slice(-2);
}