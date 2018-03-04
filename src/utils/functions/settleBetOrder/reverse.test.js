import reverse from './reverse';

const bet = {
	'action': 'winReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 364,
	'atRisk': 200
};
const picks1 = [
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet, picks1).status).toBe('Won');
	expect(reverse(bet, picks1).resultAmount).toBe(364);
});

const bet2 = {
	'action': 'winReverse',
	'type': 'risk',
	'amount': 200,
	'toWin': 364,
	'atRisk': 200
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
test('test reverse result', () => {
	expect(reverse(bet2, picks2).status).toBe('Won');
	expect(reverse(bet2, picks2).resultAmount).toBe(364);
});

const bet3 = {
	'action': 'winReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 364,
	'atRisk': 200
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
test('test reverse result', () => {
	expect(reverse(bet3, picks3).status).toBe('Lost');
	expect(reverse(bet3, picks3).resultAmount).toBe(-109);
});

const bet4 = {
	'action': 'winReverse',
	'type': 'risk',
	'amount': 200,
	'toWin': 364,
	'atRisk': 200
};
const picks4 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet4, picks4).status).toBe('Lost');
	expect(reverse(bet4, picks4).resultAmount).toBe(-109);
});

const bet5 = {
	'action': 'winReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 2182,
	'atRisk': 1200
};
const picks5 = [
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet5, picks5).status).toBe('Won');
	expect(reverse(bet5, picks5).resultAmount).toBe(2182);
});

const bet6 = {
	'action': 'winReverse',
	'type': 'risk',
	'amount': 1200,
	'toWin': 2182,
	'atRisk': 1200
};
const picks6 = [
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet5, picks5).status).toBe('Won');
	expect(reverse(bet5, picks5).resultAmount).toBe(2182);
});

const bet7 = {
	'action': 'winReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 2182,
	'atRisk': 1200
};
const picks7 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet7, picks7).status).toBe('Won');
	expect(reverse(bet7, picks7).resultAmount).toBe(227);
});

const bet8 = {
	'action': 'winReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 2182,
	'atRisk': 1200
};
const picks8 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet8, picks8).status).toBe('Lost');
	expect(reverse(bet8, picks8).resultAmount).toBe(-527);
});

const bet9 = {
	'action': 'actionReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 2182,
	'atRisk': 1200
};
const picks9 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet9, picks9).status).toBe('Lost');
	expect(reverse(bet9, picks9).resultAmount).toBe(-636);
});

const bet10 = {
	'action': 'actionReverse',
	'type': 'wager',
	'amount': 100,
	'toWin': 2182,
	'atRisk': 1200
};
const picks10 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet10, picks10).status).toBe('Won');
	expect(reverse(bet10, picks10).resultAmount).toBe(309);
});

const bet11 = {
	'action': 'actionReverse',
	'type': 'risk',
	'amount': 1200,
	'toWin': 2182,
	'atRisk': 1200
};
const picks11 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet11, picks11).status).toBe('Won');
	expect(reverse(bet11, picks11).resultAmount).toBe(309);
});

const bet12 = {
	'action': 'actionReverse',
	'type': 'risk',
	'amount': 1200,
	'toWin': 2182,
	'atRisk': 1200
};
const picks12 = [
	{'status': 'Lost',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Review',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet12, picks12).status).toBe('Review');
	expect(reverse(bet12, picks12).resultAmount).toBe(null);
});

const bet13 = {
	'action': 'actionReverse',
	'type': 'risk',
	'amount': 1200,
	'toWin': 2182,
	'atRisk': 1200
};
const picks13 = [
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': -110
		}}
];
test('test reverse result', () => {
	expect(reverse(bet13, picks13).status).toBe('Push');
	expect(reverse(bet13, picks13).resultAmount).toBe(0);
});

const bet14 = {
	'action': 'actionReverse',
	'type': 'risk',
	'amount': 1200,
	'toWin': 4800,
	'atRisk': 1200
};
const picks14 = [
	{'status': 'Won',
		'marked': {
			'oddLine': 200
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': 200
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': 200
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': 200
		}}
];
test('test reverse result', () => {
	expect(reverse(bet14, picks14).status).toBe('Won');
	expect(reverse(bet14, picks14).resultAmount).toBe(3600);
});

const bet15 = {
	'action': 'winReverse',
	'type': 'risk',
	'amount': 1200,
	'toWin': 4800,
	'atRisk': 1200
};
const picks15 = [
	{'status': 'Won',
		'marked': {
			'oddLine': 200
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': 200
		}},
	{'status': 'Push',
		'marked': {
			'oddLine': 200
		}},
	{'status': 'Won',
		'marked': {
			'oddLine': 200
		}}
];
test('test reverse result', () => {
	expect(reverse(bet15, picks15).status).toBe('Won');
	expect(reverse(bet15, picks15).resultAmount).toBe(3000);
});