const type = `
	type PickType {
		_id: ID
		ID: String
		Player: UserPlayerType
		Agent: UserAgentType
		BetOrder: BetOrderType
		Event: EventType
		marked: MarkedType
		isClosed: Boolean
		status: String
		note: NoteType,
		updatedAt: Date
		closedAt: Date
		createdAt: Date
	}

	type MarkedType {
		oddLine: Int
		oddPoint: Float
		oddTarget: String
		oddType: String
		oddLineTarget: String
		oddPointTarget: String
	}
`;
export default type;