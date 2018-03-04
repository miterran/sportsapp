import generateAtRiskToWin from './generateAtRiskToWin';


const wagerPicks1 = [{marked: { oddLine: 100 }},];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('straight', 'wager', 100, wagerPicks1)).toEqual({atRisk: 100, toWin: 100});
});

const wagerPicks2 = [{marked: { oddLine: -750 }},];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('straight', 'wager', 120, wagerPicks2)).toEqual({atRisk: 900, toWin: 120});
});

test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('straight', 'wager', 100, wagerPicks2)).toEqual({atRisk: 750, toWin: 100});
});

test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('straight', 'risk', 100, wagerPicks2)).toEqual({atRisk: 100, toWin: 13});
});

const wagerPicks3 = [{marked: { oddLine: 525 }},];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('straight', 'wager', 130, wagerPicks3)).toEqual({atRisk: 130, toWin: 683});
});

test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('straight', 'risk', 130, wagerPicks3)).toEqual({atRisk: 130, toWin: 683});
});

const wagerPicks4 = [{marked: { oddLine: 125 }},{marked: { oddLine: -105 }},{marked: { oddLine: -110 }},];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'wager', 100, wagerPicks4)).toEqual({atRisk: 100, toWin: 739});
});

const wagerPicks12 = [{marked: { oddLine: 125 }},{marked: { oddLine: 125 }},{marked: { oddLine: 125 }},];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'wager', 100, wagerPicks12)).toEqual({atRisk: 100, toWin: 1039});
});

const wagerPicks13 = [{marked: { oddLine: 100 }}, {marked: { oddLine: 100 }},];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'wager', 100, wagerPicks13)).toEqual({atRisk: 100, toWin: 300});
});

const wagerPicks5 = [{marked: { oddLine: -1525 }},{marked: { oddLine: -675 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'risk', 100, wagerPicks5)).toEqual({atRisk: 100, toWin: 22});
});

test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'wager', 100, wagerPicks5)).toEqual({atRisk: 448, toWin: 100});
});

const wagerPicks11 = [{marked: { oddLine: -1000 }},{marked: { oddLine: -1000 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'wager', 100, wagerPicks11)).toEqual({atRisk: 476, toWin: 100});
});

const wagerPicks10 = [{marked: { oddLine: -1000 }},{marked: { oddLine: -1000 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('parlay', 'risk', 100, wagerPicks10)).toEqual({atRisk: 100, toWin: 21});
});

const wagerPicks6 = [{marked: { oddLine: -100 }},{marked: { oddLine: -100 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('actionReverse', 'wager', 100, wagerPicks6)).toEqual({atRisk: 200, toWin: 400});
});

const wagerPicks7 = [{marked: { oddLine: -100 }},{marked: { oddLine: -100 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('actionReverse', 'risk', 200, wagerPicks7)).toEqual({atRisk: 200, toWin: 400});
});

const wagerPicks8 = [{marked: { oddLine: -700 }}, {marked: { oddLine: -700 }}, {marked: { oddLine: -700 }}, {marked: { oddLine: -700 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('actionReverse', 'risk', 1200, wagerPicks8)).toEqual({atRisk: 1200, toWin: 343});
});

test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('actionReverse', 'wager', 100, wagerPicks8)).toEqual({atRisk: 1200, toWin: 343});
});

const wagerPicks9 = [{marked: { oddLine: 150 }}, {marked: { oddLine: 100 }}, {marked: { oddLine: 200 }}, {marked: { oddLine: 300 }}];
test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('actionReverse', 'wager', 100, wagerPicks9)).toEqual({atRisk: 1200, toWin: 4500});
});

test('test generateAtRiskToWin', () => {
	expect(generateAtRiskToWin('actionReverse', 'risk', 1200, wagerPicks9)).toEqual({atRisk: 1200, toWin: 4500});
});