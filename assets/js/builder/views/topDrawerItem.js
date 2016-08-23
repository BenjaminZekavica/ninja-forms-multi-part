/**
 * Top drawer part view
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'li',
		template: '#nf-tmpl-mp-top-drawer-item',

		events: {
			'click': 'click'
		},

		click: function( e ) {
			this.model.collection.setElement( this.model );
		},

		templateHelpers: function() {
			var that = this;
			return {
				getIndex: function() {
					return that.model.collection.indexOf( that.model ) + 1;
				}
			}
		}
	});

	return view;
} );