export * from "./parser.js";

/**
 * Enum of the different at keyword types defined in the grammar.
 * @see [sass.grammar](../src/sass.grammar)
 */
export enum AtKeyword {
	Import = "@import",
	Include = "@include",
	Mixin = "@mixin",
	Function = "@function",
	Use = "@use",
	Extend = "@extend",
	AtRoot = "@at-root",
	Forward = "@forward",
	Media = "@media",
	Charset = "@charset",
	Namespace = "@namespace",
	Keyframes = "@keyframes",
	Supports = "@supports",
	If = "@if",
	Else = "@else",
	For = "@for",
	Each = "@each",
	While = "@while",
	Debug = "@debug",
	Warn = "@warn",
	Error = "@error",
	Return = "@return",
}

/**
 * Enum of the different node types defined in the grammar.
 * @see [sass.grammar](../src/sass.grammar)
 */
export enum SyntaxNodeType {
	Whitespace = "whitespace",
	Comment = "Comment",
	LineComment = "LineComment",
	BlankLine = "blankLine",

	StyleSheet = "StyleSheet",
	Styles = "Styles",

	RuleSet = "RuleSet",
	ImportStatement = "ImportStatement",
	IncludeStatement = "IncludeStatement",
	MixinStatement = "MixinStatement",
	UseStatement = "UseStatement",
	ExtendStatement = "ExtendStatement",
	RootStatement = "RootStatement",
	ForwardStatement = "ForwardStatement",
	MediaStatement = "MediaStatement",
	CharsetStatement = "CharsetStatement",
	NamespaceStatement = "NamespaceStatement",
	KeyframesStatement = "KeyframesStatement",
	SupportsStatement = "SupportsStatement",
	IfStatement = "IfStatement",
	ForStatement = "ForStatement",
	EachStatement = "EachStatement",
	WhileStatement = "WhileStatement",
	OutputStatement = "OutputStatement",
	AtRule = "AtRule",

	Block = "Block",

	Declaration = "Declaration",

	Error = "⚠",
	InterpolationEnd = "InterpolationEnd",
	InterpolationContinue = "InterpolationContinue",
	Unit = "Unit",
	VariableName = "VariableName",
	InterpolationStart = "InterpolationStart",

	IndentedMixin = "IndentedMixin",
	IndentedInclude = "IndentedInclude",
	UniversalSelector = "UniversalSelector",
	TagSelector = "TagSelector",
	TagName = "TagName",
	NestingSelector = "NestingSelector",
	SuffixedSelector = "SuffixedSelector",
	Suffix = "Suffix",
	Interpolation = "Interpolation",
	SassVariableName = "SassVariableName",
	ValueName = "ValueName",
	RightParentheses = ")",
	LeftParentheses = "(",
	ParenthesizedValue = "ParenthesizedValue",
	ColorLiteral = "ColorLiteral",
	NumberLiteral = "NumberLiteral",
	StringLiteral = "StringLiteral",
	BinaryExpression = "BinaryExpression",
	BinOp = "BinOp",
	LogicOp = "LogicOp",
	UnaryExpression = "UnaryExpression",
	NamespacedValue = "NamespacedValue",
	CallExpression = "CallExpression",
	Callee = "Callee",
	ArgList = "ArgList",
	ArgListSuffix = "...",
	Colon = ":",
	Comma = ",",
	CallLiteral = "CallLiteral",
	CallTag = "CallTag",
	ParenthesizedContent = "ParenthesizedContent",
	ClassSelector = "ClassSelector",
	ClassName = "ClassName",
	PseudoClassPrefix = "::",
	PseudoClassSelector = "PseudoClassSelector",
	PlaceholderSelector = "PlaceholderSelector",
	PseudoClassName = "PseudoClassName",
	IdSelector = "IdSelector",
	IdPrefix = "#",
	IdName = "IdName",
	RightSquareBracket = "]",
	LeftSquareBracket = "[",
	AttributeSelector = "AttributeSelector",
	AttributeName = "AttributeName",
	MatchOp = "MatchOp",
	ChildSelector = "ChildSelector",
	ChildOp = "ChildOp",
	DescendantSelector = "DescendantSelector",
	SiblingSelector = "SiblingSelector",
	SiblingOp = "SiblingOp",
	RightCurlyBracket = "}",
	LeftCurlyBracket = "{",
	PropertyName = "PropertyName",
	Important = "Important",
	Global = "Global",
	Default = "Default",
	Semicolon = ";",
	AtKeyword = "AtKeyword",
	import = "import",
	KeywordQuery = "KeywordQuery",
	FeatureQuery = "FeatureQuery",
	FeatureName = "FeatureName",
	BinaryQuery = "BinaryQuery",
	UnaryQuery = "UnaryQuery",
	ParenthesizedQuery = "ParenthesizedQuery",
	SelectorQuery = "SelectorQuery",
	selector = "selector",
	include = "include",
	mixin = "mixin",
	use = "use",
	Keyword = "Keyword",
	extend = "extend",
	AtRoot = "at-root",
	forward = "forward",
	media = "media",
	charset = "charset",
	namespace = "namespace",
	NamespaceName = "NamespaceName",
	keyframes = "keyframes",
	KeyframeName = "KeyframeName",
	KeyframeList = "KeyframeList",
	supports = "supports",
	ControlKeyword = "ControlKeyword",
	Star = "Star",

	Newline = "newline",
	EOF = "eof",
}
