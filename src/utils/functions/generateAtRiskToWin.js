import teaserOddLine from '../collections/teaserOddLine';

const generateAtRiskToWin = (action, betType, betAmount, wagerPicks) => {
	let line = 0;
	let atRisk = 0;
	let toWin = 0;
	switch(action){
	case 'straight':
		line = wagerPicks[0].marked.oddLine;
		break;
	case 'parlay':
		let parlayLine = wagerPicks.map(({ marked: { oddLine }}) => oddLine > 0 ? (oddLine + 100) / 100 : (Math.abs(oddLine) + 100) / Math.abs(oddLine)).reduce((a, b) => a * b ) -1;
		line = parlayLine > 1 ? parlayLine * 100 : -(100 / parlayLine);
		break;
	case 'basicTeaser':
	case 'specialTeaser':
	case 'bigTeaser':
	case 'superTeaser':
		line = teaserOddLine[action][wagerPicks.length];
		break;
	case 'actionReverse':
	case 'winReverse':
		line = wagerPicks.map(({ marked: { oddLine }}) => oddLine > 0 ? betAmount * oddLine / 100 : betAmount / Math.abs(oddLine) * 100 ).reduce((a, b) => a += b);
		break;
	default:
		break;
	}
	
	if(action !== 'actionReverse' || action !== 'winReverse'){
		if(betType === 'wager'){
			if(line > 0) {
				atRisk = betAmount;
				toWin = betAmount * line / 100;
			}else{
				atRisk = betAmount * Math.abs(line) / 100;
				toWin = betAmount;
			}
		}else if(betType === 'risk'){
			atRisk = betAmount;
			if(line > 0){
				toWin = betAmount * line / 100;
			}else{
				toWin = betAmount / Math.abs(line) * 100;
			}
		}
	}

	if(action === 'actionReverse' || action === 'winReverse'){
		if(betType === 'wager'){
			atRisk = ( wagerPicks.length - 1 ) * wagerPicks.length * betAmount;
			toWin = ( wagerPicks.length - 1 ) * 2 * line;
		}else if(betType === 'risk'){
			atRisk = betAmount;
			toWin = line / ( wagerPicks.length / 2 );
		}
	}
	return { atRisk: Math.round(atRisk) || 0, toWin: Math.round(toWin) || 0 };
};

export default generateAtRiskToWin;