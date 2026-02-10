export const DateTimeFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: '2-digit',
});

export const ShortDateFormatter = new Intl.DateTimeFormat('en-US', {
	dateStyle: 'short',
});
