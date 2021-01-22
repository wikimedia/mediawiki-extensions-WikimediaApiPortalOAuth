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
		'oauth2_grant_types',
		'owner_only'
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
			Object.prototype.hasOwnProperty.call( this.data, prop )
		) {
			return this.data[ prop ];
		}

		return def;
	};

	ClientEntity.prototype.getLabel = function ( prop ) {
		if ( Object.prototype.hasOwnProperty.call( ClientEntity.static.labels, prop ) ) {
			// Messages that can be used here:
			// * wikimediaapiportaloauth-ui-client-field-client-key
			// * wikimediaapiportaloauth-ui-client-field-name
			// * wikimediaapiportaloauth-ui-client-field-callback-uri
			// * wikimediaapiportaloauth-ui-client-field-desc
			return mw.message( ClientEntity.static.labels[ prop ] ).text();
		}

		return prop;
	};

	mw.apiportal.ClientEntity = ClientEntity;
}() );
