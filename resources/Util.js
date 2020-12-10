( function () {
	var Util = {
		getErrorTextFromXHR: function ( xhr ) {
			var message = '';
			if ( xhr && xhr.responseJSON !== undefined ) {
				message = xhr.responseJSON.error || xhr.responseJSON.message;
			}

			switch ( message ) {
				case 'consumer_exists':
					return mw.message( 'wikimediaapiportaloauth-ui-error-consumer-exists' ).text();
				case 'invalid_field_callbackUrl':
					return mw.message( 'wikimediaapiportaloauth-ui-error-invalid-callback-url' ).text();
				case 'unable_to_retrieve_access_token':
					return mw.message( 'wikimediaapiportaloauth-ui-error-cannot-get-token' ).text();
				default:
					return mw.message( 'wikimediaapiportaloauth-ui-error-request-client-fail' ).text();
			}
		},
		targetRestURL: mw.config.get( 'wgWikimediaApiPortalOAuthMetaRestURL' ),
		targetApiURL: mw.config.get( 'wgWikimediaApiPortalOAuthMetaApiURL' ),
		userEmail: mw.config.get( 'wgWikimediaApiPortalUserEmail' )
	};

	mw.apiportal = {
		dialog: {},
		booklet: {
			page: {}
		},
		util: Util,
		widget: {}
	};
}() );
