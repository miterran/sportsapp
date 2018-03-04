const type = `
	type TableType {
		_id: ID
		name: String
		sports: [TableSportType]
	}

	type TableSportType {
		_id: ID
		name: String
		leagues: [TableLeagueType]
	}

	type TableLeagueType {
		_id: ID
		name: String
		region: String
		periods: [TablePeriodType]
	}

	type TablePeriodType {
		_id: ID
		name: String
	}
`;
export default type;