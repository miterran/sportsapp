import moment from 'moment';
import { GraphQLScalarType } from 'graphql';
//import { Kind } from 'graphql/language';
const resolverScalar = {
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue(value) {
			return moment(value); // value from the client
		},
		serialize(value) {
			return moment(value); // value sent to the client
		},
		parseLiteral(ast) {
			return moment(ast).format();
		}
	}),
};
export default resolverScalar;