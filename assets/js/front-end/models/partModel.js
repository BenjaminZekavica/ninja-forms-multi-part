define( [], function() {
	var model = Backbone.Model.extend( {
		fieldErrors: {},

		defaults: {
			errors: false,
			visible: true,
			title: ''
		},

		initialize: function() {
			this.filterFormContentData();
			this.listenTo( this.get( 'formContentData' ), 'change:errors', this.maybeChangeActivePart );
			this.fieldErrors[ this.cid ] = [];
			this.on( 'change:visible', this.changeVisible, this );
		},

		filterFormContentData: function() {
			if ( ! this.get( 'formContentData' ) ) return;

			/*
			 * Update our formContentData by running it through our fromContentData filter
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			/* 
			* Get our second filter, this will be the one with the highest priority after MP Forms.
			*/
			var sortedArray = _.without( formContentLoadFilters, undefined );
			var callback = sortedArray[ 1 ];
			/*
			 * If our formContentData is an empty array, we want to pass the "empty" flag as true so that filters know it's purposefully empty.
			 */
			var empty = ( 0 == this.get( 'formContentData' ).length ) ? true : false;
			/*
			 * TODO: This is a bandaid fix to prevent forms with layouts and parts from freaking out of layouts & styles are deactivated.
			 * If Layouts is deactivated, it will send the field keys.
			 */
			if ( 'undefined' == typeof formContentLoadFilters[4] && _.isArray( this.get( 'formContentData' ) ) && 'undefined' != typeof this.get( 'formContentData' )[0].cells ) {
				this.set( 'formContentData', this.collection.formModel.get( 'fields' ).pluck( 'key' ) );
			}

			this.set( 'formContentData', callback( this.get( 'formContentData' ), this.collection.formModel, empty, this.get( 'formContentData' ) ) );
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
		},

		changeVisible: function() {
			if ( this.get( 'visible' ) ) {
				this.get( 'formContentData' ).showFields();
			} else {
				this.get( 'formContentData' ).hideFields();
			}
		}
	} );

	return model;
} );
