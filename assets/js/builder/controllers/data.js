/**
 * Holds our part collection.
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [ 'models/partCollection' ], function ( PartCollection) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Instantiate our part collection.
			 */
			nfRadio.channel( 'mp' ).reply( 'init:partCollection', this.initPartCollection, this );

			/*
			 * Listen for requests for our part collection.
			 */
			nfRadio.channel( 'mp' ).reply( 'get:collection', this.getCollection, this );

			/*
			 * When we add a field to our field collection, collection, trigger an "add:model"
			 */
			this.listenTo( nfRadio.channel( 'fields' ), 'render:newField', this.addField );
		},

		initPartCollection: function( partCollection ) {
			this.collection = partCollection;
		},

		getCollection: function() {
			return this.collection;
		},

		addField: function( fieldModel ) {
			this.collection.getFormContentData().trigger( 'add:field', fieldModel );
			if( 1 == this.collection.getFormContentData().length ) {
				this.collection.getFormContentData().trigger( 'reset' );
			}
		}

	});

	return controller;
} );