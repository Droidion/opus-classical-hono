export const secureHeadersConfig = {
	contentSecurityPolicy: {
		defaultSrc: ["'self'"],
		scriptSrc: [
			"'self'",
			"'sha384-Akqfrbj/HpNVo8k11SXBb6TlBWmXXlYQrCSqEWmyKJe+hDm3Z/B2WVG4smwBkRVm'",
			"'sha384-NzchC8z9HmP/Ed8cheGl9XuSrFSkDNHPiDl+ujbHE0F0I7tWC4rUnwPXP+7IvVZv'",
		],
		styleSrc: ["'self'", "https:", "'unsafe-inline'"],
		imgSrc: ["'self'", "https://s3.opusclassical.net"],
		fontSrc: ["'self'"],
		connectSrc: ["'self'", "https://s3.opusclassical.net"],
		frameAncestors: ["'none'"],
		formAction: ["'self'"],
		baseUri: ["'self'"],
		upgradeInsecureRequests: [],
	},
	permissionsPolicy: {
		fullscreen: ["self"],
		syncXhr: [],
		microphone: [],
		geolocation: [],
		usb: ["self"],
		accelerometer: [],
	},
};

export const csrfConfig = {
	origin: (origin: string) => {
		const url = new URL(origin);
		return url.hostname === "localhost" || url.hostname === "opusclassical.net";
	},
} as const;
