$( function () {
	new mw.apiportal.widget.KeyOverview( { // eslint-disable-line no-new
		$element: $( document.getElementById( 'api-management-panel' ) ),
		pageLimit: 5
	} );
} );
