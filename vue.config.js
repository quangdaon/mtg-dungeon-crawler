const title = 'MTG Dungeon Crawler';
module.exports = {
	pages: {
		index: {
			// entry for the page
			entry: 'src/main.ts',
			title
		}
	},
	pwa: {
		name: title,
		themeColor: '#4DBA87',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black'
	}
};
