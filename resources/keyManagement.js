$( function () {
	new mw.apiportal.widget.KeyOverview( { // eslint-disable-line no-new
		$element: $( '#api-management-panel' ),
		pageLimit: 5
	} );
} );
