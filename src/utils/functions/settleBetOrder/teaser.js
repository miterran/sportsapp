import _ from 'lodash';
import teaserOddLine from '../../collections/teaserOddLine';

const teaser = ({ action, toWin, atRisk, amount: betAmount, type: betType }, Picks) => {

//	const picksHaveWon       = _.some(Picks, { status: 'Won' });			
	const picksHaveLost      = _.some(Picks, { status: 'Lost' });		
	const picksHavePush      = _.some(Picks, { status: 'Push' });		
	const picksHavePostponed = _.some(Picks, { status: 'Postponed' });
	const picksHaveCancelled = _.some(Picks, { status: 'Cancelled' });
	const picksHaveReview    = _.some(Picks, { status: 'Review' });
	const picksHavePending   = _.some(Picks, { status: 'Pending' });
	
	//	const allPicksWon        = _.every(Picks, { status: 'Won' });
	//	const allPicksLost       = _.every(Picks, { status: 'Lost' });
	//	const allPicksPush       = _.every(Picks, { status: 'Push' });
	//	const allPicksCancelled  = _.every(Picks, { status: 'Postponed' });
	//	const allPicksPostponed  = _.every(Picks, { status: 'Canceled' });
	//	const allPicksReview     = _.every(Picks, { status: 'Review' });
	//	const allPicksPending    = _.every(Picks, { status: 'Pending' });

	const picksWonCounter = Picks.reduce((total, pick) => total + ( pick.status === 'Won' ), 0 );
	//	const picksLength = Picks.length;

	let isClosed = false;
	let status = 'Pending';
	let resultAmount = null;
	let note = {};

	if(action !== 'superTeaser'){
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
		case picksWonCounter >= 2:
			const line = teaserOddLine[action][picksWonCounter];
			const wagerResultAmount = line > 0 ? (betAmount * line / 100) : betAmount;
			const riskResultAmount = line > 0 ? (betAmount * line / 100) : betAmount / Math.abs(line) * 100;
			resultAmount = betType === 'wager' ? wagerResultAmount : riskResultAmount;
			isClosed = true;
			status = 'Won';
			break;
		case picksHavePush:
		case picksWonCounter === 1:
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
	}else{
		switch(true){
		case picksHavePush:
		case picksHaveLost:
			isClosed = true;
			status = 'Lost';
			resultAmount = -Number(atRisk);
			break;
		case picksWonCounter === 3:
			isClosed = true;
			status = 'Won';
			resultAmount = Number(toWin);
			break;
		case picksHavePending:
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
	}
	return { isClosed: isClosed, status: status, resultAmount: _.isNumber(resultAmount) ? Math.round(resultAmount) : null, note: note };
};
export default teaser;