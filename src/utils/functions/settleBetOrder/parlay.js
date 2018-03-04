import _ from 'lodash';

const parlay = ({ atRisk, type: betType, amount: betAmount }, Picks) => {

	const picksHaveWon       = _.some(Picks, { status: 'Won' });			
	const picksHaveLost      = _.some(Picks, { status: 'Lost' });		
	const picksHavePush      = _.some(Picks, { status: 'Push' });		
	const picksHavePostponed = _.some(Picks, { status: 'Postponed' });
	const picksHaveCancelled = _.some(Picks, { status: 'Cancelled' });
	const picksHaveReview    = _.some(Picks, { status: 'Review' });
	const picksHavePending   = _.some(Picks, { status: 'Pending' });
	
	//	const allPicksWon        = _.every(Picks, { status: 'Won' });
	//	const allPicksLost       = _.every(Picks, { status: 'Lost' })
	//	const allPicksPush       = _.every(Picks, { status: 'Push' });
	//	const allPicksCancelled  = _.every(Picks, { status: 'Postponed' })
	//	const allPicksPostponed  = _.every(Picks, { status: 'Cancelled' })
	//	const allPicksReview     = _.every(Picks, { status: 'Review' })
	//	const allPicksPending    = _.every(Picks, { status: 'Pending' })

	let isClosed = false;
	let status = 'Pending';
	let resultAmount = null;
	let note = {};

	switch(true){

	case picksHaveLost:
		isClosed = true;
		status = 'Lost';
		resultAmount = -Number(atRisk);
		break;

	case picksHaveReview:
		status = 'Review';
		note = { title: 'Review', content: 'To be determine!', status: 'warning' };
		break;

	case picksHavePending:
		break;

	case picksHaveWon:
		const parlayLine = _.compact(Picks.map(({ status, marked: { oddLine } }) => status === 'Won' ? oddLine > 0 ? (oddLine + 100) / 100 : (Math.abs(oddLine) + 100) / Math.abs(oddLine) : null )).reduce((a, b) => a * b ) -1;
		const line = parlayLine > 1 ? parlayLine * 100 : -(100 / parlayLine);
		const wagerResultAmount = line > 0 ? (betAmount * line / 100) : betAmount;
		const riskResultAmount = line > 0 ? (betAmount * line / 100) : betAmount / Math.abs(line) * 100;
		resultAmount = betType === 'wager' ? wagerResultAmount : riskResultAmount;
		isClosed = true;
		status = 'Won';
		break;

	case picksHavePush:
		isClosed = true;
		status = 'Push';
		resultAmount = 0;
		break;

	case picksHavePostponed:
	case picksHaveCancelled:
		isClosed = true;
		status = 'Cancelled';
		resultAmount = 0;
		break;

	default:
		status = 'Review';
		note = { title: 'Review', content: 'To be determine!', status: 'warning' };
		break;
	}
	return { isClosed: isClosed, status: status, resultAmount: _.isNumber(resultAmount) ? Math.round(resultAmount) : null, note: note };
};

export default parlay;