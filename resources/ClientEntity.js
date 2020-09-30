( function () {

	/**
	 * @constructor
	 * @param {Object} data - Client data.
	 */
	var ClientEntity = function ( data ) {
		this.data = data || {};
	};

	OO.initClass( ClientEntity );

	ClientEntity.static.fields = [
		'client_key',
		'name',
		'version',
		'email',
		'callback_url',
		'grants',
		'registration',
		'stage',
		'oauth_version',
		'description',
		'registration_formatted',
		'oauth2_grant_types'
	];

	ClientEntity.static.labels = {
		/* eslint-disable camelcase */
		client_key: 'wikimediaapiportaloauth-ui-client-field-client-key',
		name: 'wikimediaapiportaloauth-ui-client-field-name',
		callback_url: 'wikimediaapiportaloauth-ui-client-field-callback-uri',
		description: 'wikimediaapiportaloauth-ui-client-field-desc'
		/* eslint-enable camelcase */
	};

	ClientEntity.prototype.get = function ( prop, def ) {
		def = def || null;

		if (
			ClientEntity.static.fields.indexOf( prop ) !== -1 &&
			this.data.hasOwnProperty( prop )
		) {
			return this.data[ prop ];
		}

		return def;
	};

	ClientEntity.prototype.getLabel = function ( prop ) {
		if ( ClientEntity.static.labels.hasOwnProperty( prop ) ) {
			return mw.message( ClientEntity.static.labels[ prop ] ).text();
		}

		return prop;
	};

	mw.apiportal.ClientEntity = ClientEntity;
}() );