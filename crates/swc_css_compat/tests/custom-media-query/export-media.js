module.exports = {
	customMedia: {
		'--mq-a': '(max-width: 30em), (max-height: 30em)',
		'--mq-b': 'screen and (max-width: 30em)',
		'--not-mq-a': 'not all and (--mq-a)',
		'--circular-mq-a': '(--circular-mq-b)',
		'--circular-mq-b': '(--circular-mq-a)',
		'--min': '(min-width: 320px)',
		'--max': '(max-width: 640px)',
		'--concat': '(min-width: 320px) and (max-width: 640px)'
	}
};
