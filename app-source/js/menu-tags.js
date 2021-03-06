'use strict'

let i18n = require('./i18n.min')

const {
	app,
	BrowserWindow,
	Menu,
	MenuItem,
	ipcMain
} = require( 'electron' )

const entities = require( './entities.min' )



ipcMain.on('show-tags-menu', ( event, message ) => {
	
	let tag = entities.decode( message[1] )
	
	const tagsMenuTemplate = [
		{
			label: i18n.t('menutags:edit', 'Edit {{- tag}} Tag…', { tag: unescape(tag) }),
			click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('edit-tag', message[1]) }
		},
		{
			type: 'separator'
		},
		{
			label: i18n.t('menutags:delete', 'Delete {{- tag}} Tag…', { tag: unescape(tag) }),
			click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('delete-tag', message[0]) }
		},
	]
	
	const tagsMenu = Menu.buildFromTemplate( tagsMenuTemplate )
	
	const win = BrowserWindow.fromWebContents( event.sender )
	tagsMenu.popup( win )
})
