import parlay from './parlay';

const bet = {
	'type': 'wager',
	'amount': 100,
};
const picks1 = [
	{'status': 'Pending',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Pending',
		'marked': {
			'oddLine': -110
		}}
];
test('test parlay result', () => {
	expect(parlay(bet, picks1).status).toBe('Pending');
	expect(parlay(bet, picks1).resultAmount).toBe(null);
});

const bet2 = {
	'type': 'wager',
	'amount': 100,
};
const picks2 = [
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test parlay result', () => {
	expect(parlay(bet2, picks2).status).toBe('Won');
	expect(parlay(bet2, picks2).resultAmount).toBe(264);
});

const bet3 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 300
};
const picks3 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test parlay result', () => {
	expect(parlay(bet3, picks3).status).toBe('Lost');
	expect(parlay(bet3, picks3).resultAmount).toBe(-300);
});

const bet4 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 21
};
const picks4 = [
	{'status': 'Won',
		'marked': {
			'oddLine': -1000
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -1000
		}}
];
test('test parlay result', () => {
	expect(parlay(bet4, picks4).status).toBe('Won');
	expect(parlay(bet4, picks4).resultAmount).toBe(100);
});


const bet5 = {
	'type': 'risk',
	'amount': 100,
	'atRisk': 100
};
const picks5 = [
	{'status': 'Won',
		'marked': {
			'oddLine': -1000
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -1000
		}}
];
test('test parlay result', () => {
	expect(parlay(bet5, picks5).status).toBe('Won');
	expect(parlay(bet5, picks5).resultAmount).toBe(21);
});

const bet21 = {
	'type': 'risk',
	'amount': 100,
	'atRisk': 100
};
const picks21 = [
	{'status': 'Postponed',
		'marked': {
			'oddLine': -1000
		}},
	{'status': 'Cancelled',
		'marked': {
			'oddLine': -1000
		}},
	{'status': 'Cancelled',
		'marked': {
			'oddLine': -1000
		}},
	{'status': 'Postponed',
		'marked': {
			'oddLine': -1000
		}}
];
test('test parlay result', () => {
	expect(parlay(bet21, picks21).status).toBe('Cancelled');
	expect(parlay(bet21, picks21).resultAmount).toBe(0);
});


