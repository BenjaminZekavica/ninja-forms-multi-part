define( [], function() {
	var model = Backbone.Model.extend( {
		fieldErrors: {},

		defaults: {
			errors: false,
			validate: true,
		},

		initialize: function() {
			this.listenTo( this.get( 'formContentData' ), 'change:errors', this.maybeChangeActivePart );
			this.fieldErrors[ this.cid ] = [];
		},

		maybeChangeActivePart: function( fieldModel ) {
			/*
			 * If we have an error on this part, add an error to our part model.
			 *
			 * If we are on a part that has a higher index than the current part, set this as current.
			 */
			if ( 0 < fieldModel.get( 'errors' ).length ) {
				this.set( 'errors', true );
				this.fieldErrors[ this.cid ].push( fieldModel.get( 'key' ) );
				// this.set( 'fieldErrors', fieldModel.get( 'key' ) );
				if (
					this.collection.getElement() != this &&
					this.collection.indexOf( this.collection.getElement() ) > this.collection.indexOf( this )

				) {
					this.collection.setElement( this );
				}
			} else {
				this.fieldErrors[ this.cid ] = _.without( this.fieldErrors[ this.cid ], fieldModel.get( 'key' ) );
				if ( 0 == this.fieldErrors[ this.cid ].length ) {
					this.set( 'errors', false );
				}
			}
		},

		validateFields: function() {
			this.get( 'formContentData' ).validateFields();
		}
	} );
	
	return model;
} );