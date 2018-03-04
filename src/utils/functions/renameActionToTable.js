const renameActionToTable = action => {
	switch(action){
	case 'parlay':
	case 'actionReverse':
	case 'winReverse':
		return 'special';
	case 'basicTeaser':
	case 'specialTeaser':
	case 'bigTeaser':
	case 'superTeaser':
		return 'modify';
	case 'straight':
	default:
		return 'standard';
	}
};

export default renameActionToTable;