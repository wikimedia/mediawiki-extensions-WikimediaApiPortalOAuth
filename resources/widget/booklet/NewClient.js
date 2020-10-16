( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.Base
	 *
	 * @constructor
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.client - Client.
	 */
	var NewClient = function ( cfg ) {
		var firstPageName = 'new';

		NewClient.super.call( this, cfg );

		this.addPages( [
			new mw.apiportal.booklet.page.NewClient( firstPageName, { client: this.client } ),
			new mw.apiportal.booklet.page.DetailsNewClient( 'details_new', {
				client: new mw.apiportal.ClientEntity( {} )
			} )
		] ).setPage( firstPageName );
	};

	OO.inheritClass( NewClient, mw.apiportal.booklet.Base );

	mw.apiportal.booklet.NewClient = NewClient;
}() );
