export const Query = `
	user: UserType

	agent: UserAgentType
	
	player: UserPlayerType

	agentPlayers: [UserPlayerType]

	agentPlayer ( Player: String ): UserPlayerType

	playerCurrentCredit: UserCreditType
`;

export const Mutation = `
	switchPlayerActivate ( Player: String!, isActivate: Boolean! ): NoteType
	
	switchUserNotification ( afterWager: Boolean, afterPick: Boolean, afterBetOrder: Boolean ): NoteType

	playerMutation ( 
		Player: String!
		newNickname: String
		newPassword: String
		newPasscode: String
		newInitial: String
		newMaxWin: String
		newMinRisk: String
		isSetNewWagerLimit: Boolean
		newParlay: Boolean
		newParlayTeam: Int
		newBasicTeaser: Boolean
		newBasicTeaserTeam: Int
		newSpecialTeaser: Boolean
		newSpecialTeaserTeam: Int
		newBigTeaser: Boolean
		newBigTeaserTeam: Int
		newSuperTeaser: Boolean
		newWinReverse: Boolean
		newWinReverseTeam: Int
		newActionReverse: Boolean
		newActionReverseTeam: Int
		passcode: String!
	): NoteType
`;




