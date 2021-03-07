import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Hacker News Clone'
	}
});

export default app;