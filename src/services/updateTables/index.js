import _ from 'lodash';
import moment from 'moment';
import Table from '../../models/Table';
import Event from '../../models/Event';

const generateTableSports = (actionEvents) => {
	let sports = [];
	if(_.isEmpty(actionEvents)) return [];
	for ( let event of actionEvents ) {
		if(!_.some(sports, { name: event.sport})) sports.push({ name: event.sport, leagues: [] });
		const sportIndex = sports.findIndex(sport => sport.name === event.sport);
		if(!_.some(sports[sportIndex].leagues, { name: event.league })) sports[sportIndex].leagues.push({ name: event.league, region: event.region, periods: [] });
		const leagueIndex = sports[sportIndex].leagues.findIndex(league => league.name === event.league && league.region === event.region);
		if(leagueIndex < 0) continue;
 		if(!_.some(sports[sportIndex].leagues[leagueIndex].periods, { name: event.period })) sports[sportIndex].leagues[leagueIndex].periods.push({ name: event.period });
	}
	return sports;
};

const generateActionEvents = (action, events) => _.compact(events.map(event => { event.action = action; if(event.isActionOddActivate) return _.pick(event, ['sport', 'league', 'region', 'period']); return null; }));

const updateTable = async () => {
	try {
		// eslint-disable-next-line
		console.log('update table');
		const events = await Event.find({ cutOffAt: { $gte: moment() }}, 'sport period league region odd');
		const standardEvents = generateActionEvents('straight', events);
		const modifyEvents = generateActionEvents('superTeaser', events);
		const specialEvents = generateActionEvents('parlay', events);
		await Table.findOneAndUpdate({ name: 'standard' }, { $set: { sports: generateTableSports(standardEvents) } });
		await Table.findOneAndUpdate({ name: 'modify' }, { $set: { sports: generateTableSports(modifyEvents) } });
		await Table.findOneAndUpdate({ name: 'special' }, { $set: { sports: generateTableSports(specialEvents) } });
	} catch (e) {
		throw new Error(__dirname + '\n' + e);
	}
};
export default updateTable;