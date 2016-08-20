/**
 * Main content right gutter
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mp-gutter-right',

		events: {
			'click .next': 'clickNext',
			'click .new': 'clickNew'
		},

		initialize: function() {
			this.collection = nfRadio.channel( 'mp' ).request( 'get:collection' );
			this.listenTo( this.collection, 'change:part', this.render );
		},

		clickNext: function( e ) {
			nfRadio.channel( 'mp' ).trigger( 'click:next', e );
		},

		clickNew: function( e ) {
			nfRadio.channel( 'mp' ).trigger( 'click:new', e );
		},

		templateHelpers: function() {
			var that = this;
			return {
				hasNext: function() {
					return that.collection.hasNext();
				}
			}
		}
	});

	return view;
} );