define( [ 'models/partModel' ], function( PartModel ) {
	var collection = Backbone.Collection.extend( {
		model: PartModel,
		currentElement: false,

		initialize: function(){
			
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
			/*
			 * If we have part errors and aren't updating silently, check for part errors.
			 */
			if ( ! silent ) {
				if ( this.partErrors() ) return;
			}
			
			this.currentElement = model;
			if ( ! silent ) {
				this.trigger( 'change:part', this );
			} 
		},
		
		next: function (){
			var visibleParts = this.where( { visible: true } );
			visibleParts = new this.constructor( visibleParts );

			/*
			 * If this isn't the last visible part, move forward.
			 */
			if ( visibleParts.length - 1 != visibleParts.indexOf( this.getElement() ) ) {
				this.setElement( visibleParts.at( visibleParts.indexOf( this.getElement() ) + 1 ) );
			}
			
			return this;
		},

		previous: function() {
			var visibleParts = this.where( { visible: true } );
			visibleParts = new this.constructor( visibleParts );
	
			/*
			 * If this isn't the first visible part, move backward.
			 */
			if ( 0 != visibleParts.indexOf( this.getElement() ) ) {
				this.setElement( visibleParts.at( visibleParts.indexOf( this.getElement() ) - 1 ) );	
			}
			
			return this;
		},

		partErrors: function() {
			if ( ! this.currentElement.get( 'validate' ) ) return false;
			/*
			 * Check to see if our parts have any errors.
			 */
			this.currentElement.validateFields();
			return this.currentElement.get( 'errors' );
		},

		validateFields: function() {
			/*
			 * call validateFields on each visible part
			 */
			var visibleParts = this.where( { visible: true } );
			_.each( visibleParts, function( partModel ) { partModel.validateFields(); } );
		}
	} );

	return collection;
} );