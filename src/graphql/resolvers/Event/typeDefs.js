export const Query = `
	event ( 
		_id: String
		ID: String
	): EventType

	events ( 
		sport: String
		league: String
		isFinished: Boolean
		isPicked: Boolean
		status: String
	): [EventType]

	reviewEvents: [EventType]
`;

export const Mutation = `
	manuallyUpdateEventResult (
		_id: String
		ID: String
		MK: String!
		awayScore: Int!
		homeScore: Int!
		status: String!
	): EventType
`