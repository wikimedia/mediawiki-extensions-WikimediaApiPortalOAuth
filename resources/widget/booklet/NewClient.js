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
		NewClient.super.call( this, cfg );

		var firstPageName = 'new';

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
