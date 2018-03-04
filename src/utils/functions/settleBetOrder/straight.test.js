import straight from './straight';

const bet1 = {
	'toWin': 100,
};
const picks1 = [
	{'status': 'Won'}
];
test('test straight result', () => {
	expect(straight(bet1, picks1).status).toBe('Won');
	expect(straight(bet1, picks1).resultAmount).toBe(100);
});

const bet2 = {
	'toWin': 100,
};
const picks2 = [
	{'status': 'Won Half'}
];
test('test straight result', () => {
	expect(straight(bet2, picks2).status).toBe('Won');
	expect(straight(bet2, picks2).resultAmount).toBe(50);
});

const bet3 = {
	'toWin': 100,
	'atRisk': 100
};
const picks3 = [
	{'status': 'Lost Half'}
];
test('test straight result', () => {
	expect(straight(bet3, picks3).status).toBe('Lost');
	expect(straight(bet3, picks3).resultAmount).toBe(-50);
});

const bet4 = {
	'toWin': 100,
	'atRisk': 100
};
const picks4 = [
	{'status': 'Pending'}
];
test('test straight result', () => {
	expect(straight(bet4, picks4).status).toBe('Pending');
	expect(straight(bet4, picks4).resultAmount).toBe(null);
});

const bet5 = {
	'toWin': 100,
	'atRisk': 100
};
const picks5 = [
	{'status': 'Review'}
];
test('test straight result', () => {
	expect(straight(bet5, picks5).status).toBe('Review');
	expect(straight(bet5, picks5).resultAmount).toBe(null);
	expect(straight(bet5, picks5).isClosed).toBe(false);
});

const bet6 = {
	'toWin': 100,
	'atRisk': 100
};
const picks6 = [
	{'status': 'Cancelled'}
];
test('test straight result', () => {
	expect(straight(bet6, picks6).status).toBe('Cancelled');
	expect(straight(bet6, picks6).resultAmount).toBe(0);
	expect(straight(bet6, picks6).isClosed).toBe(true);
});