/**
 * Handles showing and hiding parts in response to Conditional Logic triggers.
 * 
 * @package Ninja Forms Front-End
 * @subpackage Main App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'condition:trigger' ).reply( 'show_part', this.showPart, this );
			nfRadio.channel( 'condition:trigger' ).reply( 'hide_part', this.hidePart, this );
		},

		showPart: function( conditionModel, then ) {
			this.changePartVisibility( conditionModel, then, true );
		},

		hidePart: function( conditionModel, then ) {
			this.changePartVisibility( conditionModel, then, false );
		},

		changePartVisibility: function( conditionModel, then, visible ) {
			var formModel = nfRadio.channel( 'app' ).request( 'get:form', conditionModel.collection.formModel.get( 'id' ) );
			var partCollection = formModel.get( 'formContentData' );
			partCollection.findWhere( { key: then.key } ).set( 'visible', visible );
		}

	});

	return controller;
} );