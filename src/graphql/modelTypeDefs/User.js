const type = `
	type UserType {
		_id: ID
		role: String
		username: String
		portrait: String
		lastOnlineAt: Date
		updatedAt: Date
		createdAt: Date
		email: String
		notification: UserNotificationType
	}
`;
export default type;