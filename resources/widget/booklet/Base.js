( function () {

	/**
	 * @class
	 * @extends OO.ui.BookletLayout
	 *
	 * @constructor
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.client - Client.
	 */
	var Base = function ( cfg ) {
		cfg = cfg || {};
		Base.super.call( this, {
			outlined: false,
			expanded: false
		} );

		this.client = cfg.client;

		this.$element.addClass( 'client-booklet' );
	};

	OO.inheritClass( Base, OO.ui.BookletLayout );

	mw.apiportal.booklet.Base = Base;
}() );
