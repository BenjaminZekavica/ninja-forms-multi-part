define( [ 'models/partModel' ], function( PartModel ) {
	var collection = Backbone.Collection.extend( {
		model: PartModel,
		currentElement: false,
		comparator: 'order',

		initialize: function( models, options ){

		},

		append: function( data ) {
			data = data || {};
			var order = this.length - 1;
			data = _.extend( { order: order }, data );
			return this.add( data );
		},
		
		getElement: function() {
			/*
			 * If we haven't set an element yet, set it to the first one.
			 */
			if ( ! this.currentElement ) {
				this.setElement( this.at( 0 ), true );
			}
			return this.currentElement;
		},
		  
		setElement: function( model, silent ) {
			silent = silent || false;

			this.currentElement = model;
			if ( ! silent ) {
				this.trigger( 'change:part', this );	
			}
		},
		
		next: function (){
			/*
			 * If this isn't the last part, move forward.
			 */
			if ( this.hasNext() ) {
				this.setElement( this.at( this.indexOf( this.getElement() ) + 1 ) );
			}
			
			return this;
		},

		previous: function() {
			/*
			 * If this isn't the first part, move backward.
			 */
			if ( this.hasPrevious() ) {
				this.setElement( this.at( this.indexOf( this.getElement() ) - 1 ) );	
			}
			
			return this;
		},

		hasNext: function() {
			return this.length - 1 != this.indexOf( this.getElement() );
		},

		hasPrevious: function() {
			return 0 != this.indexOf( this.getElement() )
		},

		getFormContentData: function() {
			return this.getElement().get( 'formContentData' );
		}
	} );

	return collection;
} );