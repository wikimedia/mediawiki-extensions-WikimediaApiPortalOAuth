( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.Base
	 *
	 * @constructor
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.client - Client.
	 */
	var Details = function ( cfg ) {
		var firstPageName = 'details';

		Details.super.call( this, cfg );

		this.addPages( [
			new mw.apiportal.booklet.page.Details( firstPageName, { client: this.client } ),
			new mw.apiportal.booklet.page.DetailsReset( 'details_reset', { client: this.client } )
		] ).setPage( firstPageName );
	};

	OO.inheritClass( Details, mw.apiportal.booklet.Base );

	mw.apiportal.booklet.Details = Details;
}() );
