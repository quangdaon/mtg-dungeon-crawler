<template>
	<router-view />
</template>

<style lang="scss">
body {
	font-family: sans-serif;
	padding: 0;
	margin: 0;
	&.disable-refresh {
		overscroll-behavior-y: contain;
	}
}
</style>
