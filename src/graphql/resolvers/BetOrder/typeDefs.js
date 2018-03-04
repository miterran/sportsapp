export const Query = `
	reviewBetOrders: [BetOrderType]
	
	betOrders (
		Player: String
		isClosed: Boolean
		startOfWeekNum: Int
		endOfWeekNum: Int
	): [BetOrderType]

	betOrdersOverview (
		Player: String
		isClosed: Boolean
		startOfWeekNum: Int
		endOfWeekNum: Int
	):  BetOrdersOverviewType

	betOrder (
		BetOrder: String
	): BetOrderType

`;

export const type = `

	type BetOrdersOverviewType {
		activePlayers: Int
		resultAmount: Int
		totalAtRisk: Int
		totalToWin: Int
		totalBets: Int
		overview: OverviewType
	}

	type OverviewType {
		action: ActionOverviewType
		sport: SportOverViewType
		odd: OddOverviewType
	}

	type ActionOverviewType {
		straight: OverviewRecordType
		parlay: OverviewRecordType
		basicTeaser: OverviewRecordType
		specialTeaser: OverviewRecordType
		bigTeaser: OverviewRecordType
		superTeaser: OverviewRecordType
		actionReverse: OverviewRecordType
		winReverse: OverviewRecordType
	}

	type SportOverViewType {
		Basketball: OverviewRecordType
		Football: OverviewRecordType
		Baseball: OverviewRecordType
		Hockey: OverviewRecordType
		Soccer: OverviewRecordType
		Fighting: OverviewRecordType
		ESports: OverviewRecordType
	}

	type OddOverviewType {
		MLine: OverviewRecordType
		Spread: OverviewRecordType
		Total: OverviewRecordType
		Draw: OverviewRecordType
	}

	type OverviewRecordType {
		Won: Int
		Lost: Int
		Push: Int
		Pending: Int
	}

`;