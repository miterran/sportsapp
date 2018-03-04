export const Query = `
	pick: PickType
	picks (
		status: String!
	): [PickType]
`;