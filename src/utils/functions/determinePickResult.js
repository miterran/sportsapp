const determinePickResult = ({ Event: { sport, score: { home: homeScore, away: awayScore } }, marked: { oddType, oddTarget, oddPoint } }) => {
	switch(true){
	case sport === 'Soccer' && oddType === 'Spread' && oddTarget === 'Home'  && homeScore + oddPoint - awayScore === 0.25:
	case sport === 'Soccer' && oddType === 'Spread' && oddTarget === 'Away'  && awayScore + oddPoint - homeScore === 0.25:
	case sport === 'Soccer' && oddType === 'Total'  && oddTarget === 'Over'  && homeScore + awayScore - oddPoint === 0.25:
	case sport === 'Soccer' && oddType === 'Total'  && oddTarget === 'Under' && oddPoint - homeScore + awayScore === 0.25:
		return 'Won Half';
	case sport === 'Soccer' && oddType === 'Spread' && oddTarget === 'Home'  && homeScore + oddPoint - awayScore === -0.25:
	case sport === 'Soccer' && oddType === 'Spread' && oddTarget === 'Away'  && awayScore + oddPoint - homeScore === -0.25:
	case sport === 'Soccer' && oddType === 'Total'  && oddTarget === 'Over'  && homeScore + awayScore - oddPoint === -0.25:
	case sport === 'Soccer' && oddType === 'Total'  && oddTarget === 'Under' && oddPoint - homeScore + awayScore === -0.25:
		return 'Lost Half';
	case oddType === 'MLine' && oddTarget === 'Home'  && homeScore > awayScore:
	case oddType === 'MLine' && oddTarget === 'Away'  && awayScore > homeScore:
	case oddType === 'Spread' && oddTarget === 'Home'  && ( homeScore + oddPoint ) > awayScore:
	case oddType === 'Spread' && oddTarget === 'Away'  && ( awayScore + oddPoint ) > homeScore:
	case oddType === 'Total'  && oddTarget === 'Over'  && ( homeScore + awayScore ) > oddPoint:
	case oddType === 'Total'  && oddTarget === 'Under' && ( homeScore + awayScore ) < oddPoint:
	case oddType === 'Draw'   && homeScore === awayScore:
		return 'Won';
	case sport   === 'Soccer' && oddType === 'MLine' && homeScore === awayScore:
	case sport   === 'Hockey' && oddType === 'MLine' && homeScore === awayScore:
	case oddType === 'MLine' && oddTarget === 'Home'  && homeScore < awayScore:
	case oddType === 'MLine' && oddTarget === 'Away'  && awayScore < homeScore:
	case oddType === 'Spread' && oddTarget === 'Home'  && ( homeScore + oddPoint )  < awayScore:
	case oddType === 'Spread' && oddTarget === 'Away'  && ( awayScore + oddPoint )  < homeScore:
	case oddType === 'Total'  && oddTarget === 'Over'  && ( homeScore + awayScore ) < oddPoint:
	case oddType === 'Total'  && oddTarget === 'Under' && ( homeScore + awayScore ) > oddPoint:
	case oddType === 'Draw'   && homeScore !== awayScore:
		return 'Lost';
	case sport   !== 'Soccer' && oddType === 'MLine'  && homeScore === awayScore:
	case sport   !== 'Hockey' && oddType === 'MLine'  && homeScore === awayScore:
	case oddType === 'Spread' && oddTarget === 'Home'  && ( homeScore + oddPoint ) === awayScore:
	case oddType === 'Spread' && oddTarget === 'Away'  && ( awayScore + oddPoint ) === homeScore:
	case oddType === 'Total'  && ( homeScore + awayScore ) === oddPoint:
		return 'Push';
	default:
		return 'Review';	
	}
};
export default determinePickResult;