( function () {

	/**
	 * @class
	 * @extends mw.apiportal.booklet.Base
	 *
	 * @constructor
	 * @param {Object} cfg - Config.
	 * @param {Object} cfg.client - Client.
	 */
	const NewClient = function ( cfg ) {
		const firstPageName = 'new';

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
