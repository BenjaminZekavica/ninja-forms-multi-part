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
		layoutsEnabed: false,

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
			 * If we don't have Layout & Styles active, when we add a field to our field collection, collection, trigger an "add:model"
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );

			/*
			 * TODO: Super Hacky Bandaid fix for making sure we don't trigger an duplicating a field if Layouts is enabled.
			 * If it is enabled, Layouts handles adding duplicated items.
			 */
			this.layoutsEnabed = ( 'undefined' != typeof formContentLoadFilters[4] ) ? true : false;
			this.listenTo( nfRadio.channel( 'fields' ), 'render:newField', this.addField );
		
			/*
			 * After we init our form in the builder, we need to check for items in the field collection that don't appear in the formContentData.
			 */
			this.listenTo( nfRadio.channel( 'main' ), 'render:main', this.checkBadData );
		},

		initPartCollection: function( partCollection ) {
			this.collection = partCollection;
		},

		getCollection: function() {
			return this.collection;
		},

		addField: function( fieldModel, action ) {
			action = action || '';
			/*
			 * TODO: Super Hacky Bandaid fix for making sure we don't trigger an duplicating a field if Layouts is enabled.
			 * If it is enabled, Layouts handles adding duplicated items.
			 */
			if ( this.layoutsEnabed && 'duplicate' == action ) {
				return false;
			}
			this.collection.getFormContentData().trigger( 'add:field', fieldModel );
			if( 1 == this.collection.getFormContentData().length ) {
				this.collection.getFormContentData().trigger( 'reset' );
			}
		},

		/**
		 * Loop through our fields and make sure that they are in our formContentData.
		 * If they aren't, delete them and update the database.
		 * 
		 * @since  3.0.8
		 * @return void
		 */
		checkBadData: function( app ) {
			var formContentData = nfRadio.channel( 'settings' ).request( 'get:setting', 'formContentData' );
			var formContentDataString = JSON.stringify( formContentData );
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			var needToUpdate = false;

			fieldCollection.each( function( fieldModel ) {
				if ( 'undefined' == typeof fieldModel ) {
					return false;
				}

				if ( -1 == formContentDataString.indexOf( '"key":"' + fieldModel.get( 'key' ) + '"' ) ) {
					fieldCollection.remove( fieldModel );
					needToUpdate = true;
				}
			} );

			if ( needToUpdate ) {
				nfRadio.channel( 'app' ).request( 'update:db', 'publish' );				
			}
		}
	});

	return controller;
} );