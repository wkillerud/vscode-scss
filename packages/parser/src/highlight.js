import { styleTags, tags as t } from "@lezer/highlight";

export const cssHighlighting = styleTags({
	"AtKeyword import charset namespace keyframes media supports include mixin use forward extend at-root":
		t.definitionKeyword,
	"Keyword selector": t.keyword,
	ControlKeyword: t.controlKeyword,
	NamespaceName: t.namespace,
	KeyframeName: t.labelName,
	TagName: t.tagName,
	"ClassName Suffix": t.className,
	PseudoClassName: t.constant(t.className),
	IdName: t.labelName,
	"FeatureName PropertyName": t.propertyName,
	AttributeName: t.attributeName,
	NumberLiteral: t.number,
	KeywordQuery: t.keyword,
	UnaryQueryOp: t.operatorKeyword,
	"CallTag ValueName": t.atom,
	VariableName: t.variableName,
	SassVariableName: t.special(t.variableName),
	Callee: t.operatorKeyword,
	Unit: t.unit,
	"UniversalSelector NestingSelector IndentedMixin IndentedInclude":
		t.definitionOperator,
	MatchOp: t.compareOperator,
	"ChildOp SiblingOp, LogicOp": t.logicOperator,
	BinOp: t.arithmeticOperator,
	"Important Global Default": t.modifier,
	Comment: t.blockComment,
	LineComment: t.lineComment,
	ColorLiteral: t.color,
	"ParenthesizedContent StringLiteral": t.string,
	"InterpolationStart InterpolationContinue InterpolationEnd": t.meta,
	': "..."': t.punctuation,
	"PseudoOp #": t.derefOperator,
	"; ,": t.separator,
	"( )": t.paren,
	"[ ]": t.squareBracket,
	"{ }": t.brace,
});
