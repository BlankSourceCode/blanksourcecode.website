'use strict';
let windowResizeDebounce;

function setMenuState(fromResize) {
	const toggle = document.querySelector('#nav-toggle');
	const isToggleShown = (window.getComputedStyle(toggle).display === 'block');
	toggle.setAttribute('aria-hidden', (isToggleShown ? 'false' : 'true'));
	const menu = document.querySelector('#menu');
	const isMenuShown = !isToggleShown || (menu.style.display === 'block');
	menu.setAttribute('aria-hidden', (isMenuShown ? 'false' : 'true'));
	if (!isToggleShown) {
		menu.style.display = 'block';
	} else if (isToggleShown && fromResize) {
		menu.style.display = 'none';
	} else {
		menu.style.display = (isMenuShown ? 'none' : 'block');
	}
}

function customizeTwitter() {
	const widgetCSS = '.timeline-Widget { border-radius: 0 !important; }' +
		'.timeline-Header-title { font-size: 14px !important; }' +
		'.timeline-Header { padding: 5px 10px !important; }' +
		'.timeline-Footer { padding: 5px 10px !important; }' +
		'.Icon--informationCircleWhite { margin-top: -7px !important; }';
	const w = document.getElementById('twitter-widget-0').contentDocument;
	const s = document.createElement('style');
	s.innerHTML = widgetCSS;
	s.type = 'text/css';
	w.head.appendChild(s);
}

function customizeSearch() {
	document.querySelector('.cse input.gsc-input, input.gsc-input').setAttribute('placeholder', 'Search');
	const button = document.querySelector('td.gsc-search-button');
	button.parentElement.insertBefore(button, button.parentElement.firstChild);
}
window.addEventListener('DOMContentLoaded', () => {
	// To top button.
	document.querySelector('#back-to-top').addEventListener('click', () => {
		document.body.parentElement.velocity({
			scrollTop: 0
		}, 600);
	});
	document.querySelector('#nav-toggle').addEventListener('click', () => {
		setMenuState();
	});
	const quotes = [
		'file -> new project...',
		'// todo: implement this',
		'an empty file has a lot of potential',
		'random adventures in coding',
		'git init',
		'starting again always sounds like a fun idea',
	];
	document.querySelector('#title-quote').innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
	window.addEventListener('resize', () => {
		if (windowResizeDebounce) {
			clearTimeout(windowResizeDebounce);
		}
		windowResizeDebounce = setTimeout(() => {
			setMenuState(true);
		}, 1);
	});
});
window.addEventListener('load', () => {
	setMenuState(true);
	customizeTwitter();
	customizeSearch();
});