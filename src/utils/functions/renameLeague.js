const renameLeague = (sport, league) => {
	switch(true){
	case sport === 'Basketball' && league === 'NBA':
		return 'NBA';
	case sport === 'Basketball' && league === 'College':
		return 'NCAAB';
	case sport === 'Football' && league === 'NFL':
		return 'NFL';
	case sport === 'Football' && league === 'College':
		return 'NCAAF';
	case sport === 'Football' && league === 'Canadian':
		return 'CFL';
	default:
		return league;
	}
};

export default renameLeague;