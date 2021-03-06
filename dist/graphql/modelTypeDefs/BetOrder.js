"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var type = "\n\ttype BetOrderType {\n\t\t_id: ID\n\t\tID: String\n\t\tPlayer: UserPlayerType\n\t\tAgent: UserAgentType\n\t\tPicks: [PickType]\n\t\tbet: BetType\n\t\ttitle: String\n\t\tresultAmount: Int\n\t\tisClosed: Boolean\n\t\tstatus: String\n\t\tnote: NoteType,\n\t\tupdatedAt: Date\n\t\tcreatedAt: Date\n\t}\n\n\ttype BetType {\n\t\taction: String\n\t\ttype: String\n\t\tamount: Int\n\t\ttoWin: Int\n\t\tatRisk: Int\n\t}\n";
exports.default = type;
//# sourceMappingURL=BetOrder.js.map