/** Tokens that can appear in the stream. */
var tokens = {
	/** Open parenthesis. */
	'(': {
		/** Executed before the token is processed. */
		before: function(token) {},
		/** Executed after the token is processed. */
		after: function(token) {}
	}
};
