'use strict'

const i18n 			= require( './i18n.min' )

const remote 		= require( 'electron' ).remote
const ipc 			= require( 'electron' ).ipcRenderer
const dialog 		= remote.dialog
const Store 		= require( 'electron-store' )
const store 		= new Store()
const Mousetrap 	= require( 'mousetrap' )

const $ 			= require( 'jquery' )
const jqueryI18next = require( 'jquery-i18next' )

jqueryI18next.init(i18n, $)

const fetch			= require( './fetch.min' )
const serialize		= require( './serialize.min' )
const entities		= require( './entities.min' )

const 	urlParams = new URLSearchParams( location.search ),
		theTag = urlParams.get('tag')



//note(dgmid): log exceptions

window.onerror = function( error, url, line ) {
	
	ipcRenderer.send( 'error-in-render', {error, url, line} )
}



//note(dgmid): set lang & localize strings

$('html').attr('lang', i18n.language)
$('header span').localize()
$('label').localize()
$('input').localize()
$('button').localize()



//note(dgmid): register kbd shortcut
Mousetrap.bind('command+.', function() {
	
	closeModal()
})



//note(dgmid): populate form

function populateForm() {
	
	$('header').append( entities.encode(theTag) )
	$('input[name="old_name"]').val( theTag )
	$('input[name="new_name"]').attr('placeholder', theTag).attr("pattern", '^(?!' + theTag + '$).*')
}



//note(dgmid): close modal

function closeModal() {
	
	const modal = remote.getCurrentWindow()
	modal.close()
}



$(document).ready(function() {
	
	populateForm()
	
	//note(dgmid): cancel modal
	
	$('#cancel').click( function() {
		
		closeModal()
	})
	
	
	//note(dgmid): update data
	
	$('#modal-form').submit( function( e ) {
		
		e.preventDefault()
		
		let	oldtag = $('input[name="old_name"]').val(),
			newtag = $('input[name="new_name"]').val()
		
		let data = serialize.serialize({
		
			'old_name': oldtag,
			'new_name': newtag
		})
		
		fetch.bookmarksApi( 'modifytag', '', data, function() {
			
			ipc.send('refresh', 'refresh')
			closeModal()
		})
	})
})
