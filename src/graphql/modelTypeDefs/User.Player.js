const type = `
	type UserPlayerType {
		_id: ID
		role: String
		username: String
		portrait: String
		lastOnlineAt: Date
		updatedAt: Date
		createdAt: Date
		email: String
		notification: UserNotificationType
		isActivate: Boolean
		isDeleted: Boolean
		isUnderAgent: Boolean
		Agent: ID
		wagerLimit: PlayerWagerLimitType
		weekNum: Int
	}

	type PlayerWagerLimitType {
		initialCredit: Int
		straight: Boolean
		parlay: Boolean
		basicTeaser: Boolean
		specialTeaser: Boolean
		bigTeaser: Boolean
		superTeaser: Boolean
		actionReverse: Boolean
		winReverse: Boolean
		maxWin: Int
		minRisk: Int
		straightTeam: Int
		parlayTeam: Int
		basicTeaserTeam: Int
		specialTeaserTeam: Int
		bigTeaserTeam: Int
		superTeaserTeam: Int
		actionReverseTeam: Int
		winReverseTeam: Int
		updatedAt: Date
	}

`;
export default type;