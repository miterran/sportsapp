import straight from './straight';
import parlay from './parlay';
import teaser from './teaser';
import reverse from './reverse';

const settleBetOrder = ({ bet, Picks }) => {
	switch(bet.action){
	case 'straight':
		return straight(bet, Picks);
	case 'parlay':
		return parlay(bet, Picks);
	case 'basicTeaser':
	case 'specialTeaser':
	case 'bigTeaser':
	case 'superTeaser':
		return teaser(bet, Picks);
	case 'actionReverse':
	case 'winReverse':
		return reverse(bet, Picks);
	default: 
		return {};
	}
};

export default settleBetOrder;