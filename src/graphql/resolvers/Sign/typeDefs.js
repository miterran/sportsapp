export const Mutation = `

	playerAloneRegister (
		username: String!
		password: String!
		passcode: String!
		email: String!
	): NoteType

	playerLogin (
		username: String!
		password: String!
	): NoteType


	agentRegister (
		username: String!
		password: String!
		passcode: String!
		email: String!
		deviceToken: String
	): NoteType

	login (
		username: String!
		password: String!
		deviceToken: String
	): NoteType

	playerRegister (
		playerUsername: String!
		playerNickname: String!
		playerPassword: String!
		playerPasscode: String!
		initial: String!
		maxWin: String!
		minRisk: String!
		parlay: Boolean!
		basicTeaser: Boolean!
		specialTeaser: Boolean!
		bigTeaser: Boolean!
		superTeaser: Boolean!
		winReverse: Boolean!
		actionReverse: Boolean!
		parlayTeam: Int!
		basicTeaserTeam: Int!
		specialTeaserTeam: Int!
		bigTeaserTeam: Int!
		winReverseTeam: Int!
		actionReverseTeam: Int!
		passcode: String!
	): NoteType

	forgotPassword (
		email: String!
		passcode: String!
	): NoteType

`;

export const Query = `
	checkUsername (
		username: String
	): NoteType

`;