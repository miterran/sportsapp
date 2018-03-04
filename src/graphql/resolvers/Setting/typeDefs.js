export const Mutation = `
	changePassword(
		password: String!
		newPassword: String!
		confirmNewPassword: String!
	): NoteType

	changePasscode(
		password: String!
		newPasscode: String!
		confirmNewPasscode: String!
	): NoteType

	changeEmail(
		passcode: String!
		email: String!
	): NoteType

`;