import _ from 'lodash';
const straight = ({ toWin, atRisk }, Picks) => {

	let isClosed = false;
	let status = 'Pending';
	let resultAmount = null;
	let note = {};

	switch(Picks[0].status){
	case 'Pending':
		break;
	case 'Won':
		isClosed = true;
		status = 'Won';
		resultAmount = Number(toWin);
		break;
	case 'Won Half':
		isClosed = true;
		status = 'Won';
		resultAmount = Number(toWin) / 2;
		break;
	case 'Lost':
		isClosed = true;
		status = 'Lost';
		resultAmount = -Number(atRisk);
		break;
	case 'Lost Half':
		isClosed = true;
		status = 'Lost';
		resultAmount = -Number(atRisk / 2);
		break;
	case 'Push':
		isClosed = true;
		status = 'Push';
		resultAmount = 0;
		break;
	case 'Postponed':
	case 'Cancelled':
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

export default straight;
