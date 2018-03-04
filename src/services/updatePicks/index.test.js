import determinePickResult from '../../utils/functions/determinePickResult';

let mockPick1 = {
	'Event': {
	    'sport': 'Basketball',
	    'score': {
	        'home': 126,
	        'away': 101
	    }
	},
	'marked': {
	    'oddType': 'Spread',
	    'oddTarget': 'Home',
	    'oddPoint': -7.5,
	}
};

let mockPick2 = {
	'Event': {
	    'sport': 'Hockey',
	    'score': {
	        'home': 10,
	        'away': 10
	    }
	},
	'marked': {
	    'oddType': 'Spread',
	    'oddTarget': 'Home',
	    'oddPoint': 0,
	}
};

let mockPick3 = {
	'Event': {
	    'sport': 'Soccer',
	    'score': {
	        'home': 10,
	        'away': 10
	    }
	},
	'marked': {
	    'oddType': 'Spread',
	    'oddTarget': 'Home',
	    'oddPoint': 0,
	}
};

let mockPick6 = {
	'Event': {
	    'sport': 'Hockey',
	    'score': {
	        'home': 8,
	        'away': 7
	    }
	},
	'marked': {
	    'oddType': 'MLine',
	    'oddTarget': 'Home',
	    'oddPoint': null,
	}
};

let mockPick7 = {
	'Event': {
	    'sport': 'Hockey',
	    'score': {
	        'home': 8,
	        'away': 8
	    }
	},
	'marked': {
	    'oddType': 'MLine',
	    'oddTarget': 'Home',
	    'oddPoint': null,
	}
};

let mockPick8 = {
	'Event': {
	    'sport': 'Hockey',
	    'score': {
	        'home': 9,
	        'away': 8
	    }
	},
	'marked': {
	    'oddType': 'Spread',
	    'oddTarget': 'Home',
	    'oddPoint': -1,
	}
};

let mockPick9 = {
	'Event': {
	    'sport': 'Hockey',
	    'score': {
	        'home': 2,
	        'away': 2
	    }
	},
	'marked': {
	    'oddType': 'Total',
	    'oddTarget': 'Over',
	    'oddPoint': 4,
	}
};

test('determineResult', () => {
	expect(determinePickResult(mockPick1)).toBe('Won');
	expect(determinePickResult(mockPick2)).toBe('Push');
	expect(determinePickResult(mockPick3)).toBe('Push');
	expect(determinePickResult(mockPick6)).toBe('Won');
	expect(determinePickResult(mockPick7)).toBe('Lost');
	expect(determinePickResult(mockPick8)).toBe('Push');
	expect(determinePickResult(mockPick9)).toBe('Push');
});