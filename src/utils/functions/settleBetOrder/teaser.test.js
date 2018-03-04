import teaser from './teaser';

const bet1 = {
	type: 'wager',
	'toWin': 100,
	'toRisk': 100,
	'amount': 100,
	'action': 'basicTeaser'
};
const picks1 = [
	{'status': 'Won'},
	{'status': 'Won'}
];
test('test teaser result', () => {
	expect(teaser(bet1, picks1).status).toBe('Won');
	expect(teaser(bet1, picks1).resultAmount).toBe(100);
});

const bet2 = {
	'type': 'wager',
	'amount': 100,
	'action': 'basicTeaser'
};
const picks2 = [
	{'status': 'Won'},
	{'status': 'Won'},
	{'status': 'Push'}
];
test('test teaser result', () => {
	expect(teaser(bet2, picks2).status).toBe('Won');
	expect(teaser(bet2, picks2).resultAmount).toBe(100);
});

const bet3 = {
	'type': 'wager',
	'amount': 100,
	'action': 'basicTeaser'
};
const picks3 = [
	{'status': 'Won'},
	{'status': 'Won'},
	{'status': 'Push'}
];
test('test teaser result', () => {
	expect(teaser(bet3, picks3).status).toBe('Won');
	expect(teaser(bet3, picks3).resultAmount).toBe(100);
});

const bet4 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'basicTeaser'
};
const picks4 = [
	{'status': 'Lost'},
	{'status': 'Won'},
	{'status': 'Push'}
];
test('test teaser result', () => {
	expect(teaser(bet4, picks4).status).toBe('Lost');
	expect(teaser(bet4, picks4).resultAmount).toBe(-110);
});

const bet5 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks5 = [
	{'status': 'Lost'},
	{'status': 'Won'},
	{'status': 'Push'}
];
test('test teaser result', () => {
	expect(teaser(bet5, picks5).status).toBe('Lost');
	expect(teaser(bet5, picks5).resultAmount).toBe(-110);
});

const bet6 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks6 = [
	{'status': 'Won'},
	{'status': 'Won'},
	{'status': 'Review'}
];
test('test teaser result', () => {
	expect(teaser(bet6, picks6).status).toBe('Review');
	expect(teaser(bet6, picks6).resultAmount).toBe(null);
});

const bet7 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks7 = [
	{'status': 'Won'},
	{'status': 'Cancelled'},
	{'status': 'Push'}
];
test('test teaser result', () => {
	expect(teaser(bet7, picks7).status).toBe('Push');
	expect(teaser(bet7, picks7).resultAmount).toBe(0);
});

const bet8 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks8 = [
	{'status': 'Won'},
	{'status': 'Cancelled'},
	{'status': 'Push'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet8, picks8).status).toBe('Push');
	expect(teaser(bet8, picks8).resultAmount).toBe(0);
});

const bet9 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks9 = [
	{'status': 'Postponed'},
	{'status': 'Cancelled'},
	{'status': 'Push'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet9, picks9).status).toBe('Push');
	expect(teaser(bet9, picks9).resultAmount).toBe(0);
});

const bet10 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks10 = [
	{'status': 'Pending'},
	{'status': 'Cancelled'},
	{'status': 'Push'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet10, picks10).status).toBe('Pending');
	expect(teaser(bet10, picks10).resultAmount).toBe(null);
});

const bet11 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks11 = [
	{'status': 'Review'},
	{'status': 'Cancelled'},
	{'status': 'Push'},
	{'status': 'Postponed'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet11, picks11).status).toBe('Review');
	expect(teaser(bet11, picks11).resultAmount).toBe(null);
});

const bet12 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks12 = [
	{'status': 'Review'},
	{'status': 'Cancelled'},
	{'status': 'Won'},
	{'status': 'Postponed'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet12, picks12).status).toBe('Review');
	expect(teaser(bet12, picks12).resultAmount).toBe(null);
});


const bet13 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks13 = [
	{'status': 'Won'},
	{'status': 'Cancelled'},
	{'status': 'Won'},
	{'status': 'Postponed'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet13, picks13).status).toBe('Won');
	expect(teaser(bet13, picks13).resultAmount).toBe(100);
});

const bet14 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'bigTeaser'
};
const picks14 = [
	{'status': 'Lost'},
	{'status': 'Cancelled'},
	{'status': 'Won'},
	{'status': 'Postponed'},
	{'status': 'Postponed'}
];
test('test teaser result', () => {
	expect(teaser(bet14, picks14).status).toBe('Lost');
	expect(teaser(bet14, picks14).resultAmount).toBe(-110);
});

const bet15 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'superTeaser'
};
const picks15 = [
	{'status': 'Lost'},
	{'status': 'Cancelled'},
	{'status': 'Won'}
];
test('test teaser result', () => {
	expect(teaser(bet15, picks15).status).toBe('Lost');
	expect(teaser(bet15, picks15).resultAmount).toBe(-110);
});

const bet16 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'superTeaser'
};
const picks16 = [
	{'status': 'Won'},
	{'status': 'Review'},
	{'status': 'Won'}
];
test('test teaser result', () => {
	expect(teaser(bet16, picks16).status).toBe('Review');
	expect(teaser(bet16, picks16).resultAmount).toBe(null);
});

const bet17 = {
	'type': 'wager',
	'amount': 100,
	'atRisk': 110,
	'action': 'superTeaser'
};
const picks17 = [
	{'status': 'Won'},
	{'status': 'Cancelled'},
	{'status': 'Won'}
];
test('test teaser result', () => {
	expect(teaser(bet17, picks17).status).toBe('Cancelled');
	expect(teaser(bet17, picks17).resultAmount).toBe(0);
});