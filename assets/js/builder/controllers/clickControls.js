/**
 * Listen for clicks on our previous and next buttons
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define(	[],	function () {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'mp' ), 'click:previous', this.clickPrevious );
			this.listenTo( nfRadio.channel( 'mp' ), 'click:next', this.clickNext );
			this.listenTo( nfRadio.channel( 'mp' ), 'click:new', this.clickNew );
			this.listenTo( nfRadio.channel( 'mp' ), 'click:partControl', this.clickPartControl );
		},

		clickPrevious: function( e ) {
			var collection = nfRadio.channel( 'mp' ).request( 'get:collection' );
			collection.previous();
		},

		clickNext: function( e ) {
			var collection = nfRadio.channel( 'mp' ).request( 'get:collection' );
			collection.next();
		},

		clickNew: function( e ) {
			var collection = nfRadio.channel( 'mp' ).request( 'get:collection' );
			var model = collection.append({});
			
			/*
			 * Register our new part to the change manager.
			 */
			// Set our 'clean' status to false so that we get a notice to publish changes
			nfRadio.channel( 'app' ).request( 'update:setting', 'clean', false );
			// Update our preview
			nfRadio.channel( 'app' ).request( 'update:db' );

			// Add our field addition to our change log.
			var label = {
				object: 'Part',
				label: model.get( 'title' ),
				change: 'Added',
				dashicon: 'plus-alt'
			};

			var data = {
				collection: model.collection
			};

			var newChange = nfRadio.channel( 'changes' ).request( 'register:change', 'addPart', model, null, label, data );
		},

		clickPartControl: function( e, partModel ) {
			/*
			 * Because our items are stacked, we have to do a bit of investigation to see what the user actually clicked on.
			 */
			if ( jQuery( e.target ).hasClass( 'nf-edit' ) ) {
				var settingGroupCollection = nfRadio.channel( 'mp' ).request( 'get:settingGroupCollection' );
				nfRadio.channel( 'app' ).request( 'open:drawer', 'editSettings', { model: partModel, groupCollection: settingGroupCollection } );
			} else if ( jQuery( e.target ).hasClass( 'nf-duplicate' ) ) {
				var partClone = nfRadio.channel( 'app' ).request( 'clone:modelDeep', partModel );
				partModel.collection.add( partClone );
				partClone.set( 'order', partModel.get( 'order' ) );
				partModel.collection.updateOrder();
				partModel.collection.setElement( partClone );
			} else if ( jQuery( e.target ).hasClass( 'nf-delete' ) ) {
				partModel.collection.remove( partModel );
			} else {
				if ( partModel != partModel.collection.getElement() ) {
					partModel.collection.setElement( partModel );
				}				
			}
		}

	});

	return controller;
} );