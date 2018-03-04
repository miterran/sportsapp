import _ from 'lodash';

const permutation = (arr) => {
	let permutations = [];
	const swap = (a, b) => {
		let tmp = arr[a];
		arr[a] = arr[b];
		arr[b] = tmp;
	};
	const generate = (n) => {
		if(n === 1){
			let newArr = arr.slice(0, 2);
			permutations.push(newArr);
		}else{
			for(let i = 0; i !== n; ++i){
				generate(n - 1);
				swap(n % 2 ? 0 : i, n - 1);
			}
		}
	};
	generate(arr.length);
	return permutations;
};

const multiDimensionalUnique = (arr) => {
	let uniques = [];
	let itemsFound = {};
	for(let i = 0, l = arr.length; i < l; i++) {
		let stringified = JSON.stringify(arr[i]);
		if(itemsFound[stringified]) { continue; }
		uniques.push(arr[i]);
		itemsFound[stringified] = true;
	}
	return uniques;
};

const reverse = ({ action, atRisk, type: betType, amount: betAmount }, Picks) => {

//	const picksHaveWon       = _.some(Picks, { status: 'Won' });			
//	const picksHaveLost      = _.some(Picks, { status: 'Lost' });		
//	const picksHavePush      = _.some(Picks, { status: 'Push' });		
//	const picksHavePostponed = _.some(Picks, { status: 'Postponed' });
//	const picksHaveCancelled = _.some(Picks, { status: 'Cancelled' });
	const picksHaveReview    = _.some(Picks, { status: 'Review' });
	const picksHavePending   = _.some(Picks, { status: 'Pending' });
	
	//	const allPicksWon        = _.every(Picks, { status: 'Won' });
	const allPicksLost       = _.every(Picks, { status: 'Lost' });
	//	const allPicksPush       = _.every(Picks, { status: 'Push' });
	const allPicksCancelled  = _.every(Picks, { status: 'Postponed' });
	const allPicksPostponed  = _.every(Picks, { status: 'Cancelled' });
	//	const allPicksReview     = _.every(Picks, { status: 'Review' });
	//	const allPicksPending    = _.every(Picks, { status: 'Pending' });

	const picksRange = _.range(Picks.length);
	const inOrders = permutation(picksRange);
	const orders = multiDimensionalUnique(inOrders);

	let isClosed = false;
	let status = 'Pending';
	let resultAmount = null;
	let note = {};

	switch(true){

	case allPicksLost:
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

	case allPicksCancelled:
	case allPicksPostponed:
		isClosed = true;
		status = 'Cancelled';
		resultAmount = 0;
		break;

	default:

		orders.forEach(order => {
			for(let idx of order){
				let { status, marked: { oddLine } } = Picks[idx];
				let pickRiskAmount = atRisk / (( Picks.length - 1 ) * Picks.length);
				switch(status){
				case 'Won':
					resultAmount += oddLine > 0 ? pickRiskAmount * oddLine / 100 : pickRiskAmount / Math.abs(oddLine) * 100;
					break;
				case 'Lost':
					resultAmount -= pickRiskAmount;
					return;
				case 'Push':
				case 'Cancelled':
				case 'Postponed':
					resultAmount += 0;
					//					if(action === 'actionReverse') break;
					if(action === 'winReverse') return;
					break;
				default:
					break;

				}
			}
		});

		isClosed = true;
		if(resultAmount === 0) {
			status = 'Push';
		}
		if(resultAmount > 0) {
			status = 'Won';
		}
		if(resultAmount < 0) {
			status = 'Lost';
		}
		break;

	}
	
	return { isClosed: isClosed, status: status, resultAmount: _.isNumber(resultAmount) ? Math.round(resultAmount) : null, note: note };
};

export default reverse;