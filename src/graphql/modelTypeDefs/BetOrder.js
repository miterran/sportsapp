const type = `
	type BetOrderType {
		_id: ID
		ID: String
		Player: UserPlayerType
		Agent: UserAgentType
		Picks: [PickType]
		bet: BetType
		title: String
		resultAmount: Int
		isClosed: Boolean
		status: String
		note: NoteType,
		updatedAt: Date
		createdAt: Date
	}

	type BetType {
		action: String
		type: String
		amount: Int
		toWin: Int
		atRisk: Int
	}
`;
export default type;