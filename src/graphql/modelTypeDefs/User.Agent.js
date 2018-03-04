const type = `
	type UserAgentType {
		_id: ID
		role: String
		username: String
		portrait: String
		lastOnlineAt: Date
		email: String
		updatedAt: Date
		createdAt: Date
		notification: UserNotificationType
		Players: [UserPlayerType]
		deletedPlayers: [UserPlayerType]
	}
`;
export default type;