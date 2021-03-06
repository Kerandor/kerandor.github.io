function w(e) {
	return null == e ? width : width * e
}

function h(e) {
	return null == e ? height : height * e
}

function chaikin(e, n) {
	if (0 === n) return e;
	const i = e.length,
		t = e.map(((n, t) => [
			[.75 * n[0] + .25 * e[(t + 1) % i][0], .75 * n[1] + .25 * e[(t + 1) % i][1]],
			[.25 * n[0] + .75 * e[(t + 1) % i][0], .25 * n[1] + .75 * e[(t + 1) % i][1]]
		])).flat();
	return 1 === n ? t : chaikin(t, n - 1)
}

function makeCircle(e, n) {
	const i = [],
		t = TWO_PI / e;
	for (let e = 0; e < TWO_PI; e += t) {
		const t = .5 + n * cos(e),
			r = .5 + n * sin(e);
		i.push([t, r])
	}
	return i
}
const randomRange = (e, n) => fxrand() * (n - e) + e;

function setDimensions() {
	fullScreen = isFullscreen(), canvasSize = min(windowWidth, windowHeight), hasMaxSize && (canvasSize = min(referenceSize, canvasSize)), windowScale = map(canvasSize, 0, referenceSize, 0, 1, hasMaxSize)
}

function centerCanvas() {
	var e = document.body.style;
	e.display = "flex", e.overflow = "hidden", e.height = "100vh", e.alignItems = "center", e.justifyContent = "center"
}

function isFullscreen() {
	return !!(document.fullscreenElement || window.screen.height - window.innerHeight <= 3 || isEdgeFullscreen() || isSafariFullscreen())
}

function isSafariFullscreen() {
	return !!document.webkitIsFullScreen
}

function isEdgeFullscreen() {
	return !!(isUserAgent("Edg") && window.screen.height - window.innerHeight <= 235)
}

function isUserAgent(e) {
	return window.navigator.userAgent.indexOf(e) > -1
}

//function mousePressed() {
//	let e = fullscreen();
//	fullscreen(!e)
//}
