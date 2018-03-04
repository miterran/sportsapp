const type = `
	type EventType {
		_id: ID
		ID: String
		title: String
		provider: String
		bookmaker: String
		sport: String
		period: String
		league: String
		region: String
		matchTime: Date
		team: TeamType
		score: ScoreType
		actionOdd: OddType
		cutOffAt: Date
		isFinished: Boolean
		isPicked: Boolean
		status: String
		updatedAt: Date
		teamLogo: LogoType
		isOddExpired: Boolean
		isActionOddActivate: Boolean
	}

	type TeamType {
		home: String
		homeROT: String
		homePitcher: String
		away: String
		awayROT: String
		awayPitcher: String
	}

	type ScoreType {
		home: Int
		away: Int
	}

	type OddType {
		awayMoneyLine: Int
		homeMoneyLine: Int
		awaySpreadPoint: Float
		awaySpreadLine: Int
		homeSpreadPoint: Float
		homeSpreadLine: Int
		totalOverPoint: Float
		totalOverLine: Int
		totalUnderPoint: Float
		totalUnderLine: Int
		drawLine: Int
	}

	type LogoType {
		away: String
		home: String
		default: String
	}
`;
export default type;