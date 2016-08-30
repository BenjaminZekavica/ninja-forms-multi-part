/**
 * Respond to undo requests.
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'changes' ).reply( 'undo:addPart', this.undoAddPart, this );
			nfRadio.channel( 'changes' ).reply( 'undo:fieldChangePart', this.undoFieldChangePart, this );
		},

		undoAddPart: function( change, undoAll ) {
			var partModel = change.get( 'model' );
			var data = change.get( 'data' );
			var partCollection = data.collection;
			partCollection.remove( partModel );

			/*
			 * If we have a fieldModel, then we dragged an existing field to create our part.
			 * Undoing should put that field back where it was.
			 */
			if ( 'undefined' != typeof data.fieldModel ) {
				data.oldPart.get( 'formContentData' ).trigger( 'add:field', data.fieldModel );
			}

			/*
			 * Remove any changes that have this model.
			 */
			var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
			changeCollection.remove( changeCollection.filter( { model: partModel } ) );
			
			this.maybeRemoveChange( change, undoAll );
		},

		undoFieldChangePart: function( change, undoAll ) {
			var newPart = change.get( 'model' );
			var data = change.get( 'data' );
			var oldPart = data.oldPart;
			var fieldModel = data.fieldModel;
			var oldOrder = data.oldOrder;

			newPart.get( 'formContentData' ).trigger( 'remove:field', fieldModel );
			oldPart.get( 'formContentData' ).trigger( 'append:field', fieldModel );
			
			fieldModel.set( 'order', oldOrder );

			this.maybeRemoveChange( change, undoAll );
		},

		/**
		 * If our undo action was requested to 'remove' the change from the collection, remove it.
		 * 
		 * @since  3.0
		 * @param  backbone.model 	change 	model of our change
		 * @param  boolean 			remove 	should we remove this item from our change collection
		 * @return void
		 */
		maybeRemoveChange: function( change, undoAll ) {			
			var undoAll = typeof undoAll !== 'undefined' ? undoAll : false;
			if ( ! undoAll ) {
				// Update preview.
				nfRadio.channel( 'app' ).request( 'update:db' );
				var changeCollection = nfRadio.channel( 'changes' ).request( 'get:collection' );
				changeCollection.remove( change );
				if ( 0 == changeCollection.length ) {
					nfRadio.channel( 'app' ).request( 'update:setting', 'clean', true );
					nfRadio.channel( 'app' ).request( 'close:drawer' );
				}
			}
		}
	});

	return controller;
} );