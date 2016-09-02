define( [ 'views/header', 'views/footer' ], function( HeaderView, FooterView ) {
	var view = Marionette.LayoutView.extend( {
		template: "#nf-tmpl-mp-form-content",

		regions: {
			header: '.nf-mp-header',
			body: '.nf-mp-body',
			footer: '.nf-mp-footer'
		},

		initialize: function( options ) {
			this.formModel = options.formModel;
			this.collection = options.data;
			this.listenTo( this.collection, 'change:part', this.changePart );
			this.listenTo( this.collection, 'change:visible', this.renderHeaderFooter );
		},

		onRender: function() {
			this.header.show( new HeaderView( { collection: this.collection, model: this.collection.getElement() } ) );

			/*
			 * Check our fieldContentViewsFilter to see if we have any defined.
			 * If we do, overwrite our default with the view returned from the filter.
			 */
			var formContentViewFilters = nfRadio.channel( 'formContent' ).request( 'get:viewFilters' );
			
			/* 
			* Get our first filter, this will be the one with the highest priority.
			*/
			var sortedArray = _.without( formContentViewFilters, undefined );
			var callback = sortedArray[1];
			this.formContentView = callback();
			
			this.body.show(  new this.formContentView( { collection: this.collection.getElement().get( 'formContentData' ) } ) );
			this.footer.show( new FooterView( { collection: this.collection, model: this.collection.getElement() } ) );
		},

		renderHeaderFooter: function() {
			this.header.empty();
			this.header.show( new HeaderView( { collection: this.collection, model: this.collection.getElement() } ) );
			this.footer.empty();
			this.footer.show( new FooterView( { collection: this.collection, model: this.collection.getElement() } ) );
		},

		changePart: function() {
			this.body.empty();
			this.body.show(  new this.formContentView( { collection: this.collection.getElement().get( 'formContentData' ) } ) );
		},

		events: {
			'click .nf-next': 'clickNext',
			'click .nf-previous': 'clickPrevious'
		},

		clickNext: function( e ) {
			e.preventDefault();
			this.collection.next();
		},

		clickPrevious: function( e ) {
			e.preventDefault();
			this.collection.previous();
		}

	} );

	return view;
} );