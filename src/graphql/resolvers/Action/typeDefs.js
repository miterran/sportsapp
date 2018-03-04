export const Query = `
	playerWagerLimit: PlayerWagerLimitType
	table (
		action: String
	): TableType

	actionEvents (
		action: String
		tablePicks: [TablePickType]!
	): [EventType]

	wagerPicks (
		action: String!
		eventOddPicks: [EventOddPicksType]!
	): [PickType]
`;

export const Mutation = `
	createBetOrder (
		action: String!
		betType: String!
		betAmount: Int!
		atRisk: Int!
		toWin: Int!
		passcode: String!
		picks: [InPutPickType!]!
	): NoteType
`;

export const Input = `
	input TablePickType {
		sport: String
		league: String
		region: String
		period: String
	}

	input EventOddPicksType {
		ID: String
		Event: String
		marked: InPutMarkedType
	}

	input InPutPickType {
		Event: String
		ID: String
		marked: InPutMarkedType
	}

	input InPutMarkedType {
		oddLine: Int
		oddPoint: Float
		oddTarget: String
		oddType: String
		oddLineTarget: String
		oddPointTarget: String
	}

`;

