<?php
/*
Plugin Name: Ninja Forms - Multi-Part Forms
Plugin URI: http://ninjaforms.com
Description: Multi-Part Forms add-on for Ninja Forms.
Version: 1.0.4
Author: The WP Ninjas
Author URI: http://wpninjas.net
*/

define("NINJA_FORMS_MP_DIR", WP_PLUGIN_DIR."/ninja-forms-multi-part");
define("NINJA_FORMS_MP_URL", plugins_url()."/ninja-forms-multi-part");
define("NINJA_FORMS_MP_VERSION", "1.0.4");

// this is the URL our updater / license checker pings. This should be the URL of the site with EDD installed
define( 'NINJA_FORMS_MP_EDD_SL_STORE_URL', 'http://wpninjas.com' ); // IMPORTANT: change the name of this constant to something unique to prevent conflicts with other plugins using this system

// the name of your product. This is the title of your product in EDD and should match the download title in EDD exactly
define( 'NINJA_FORMS_MP_EDD_SL_ITEM_NAME', 'Multi-Part Forms' ); // IMPORTANT: change the name of this constant to something unique to prevent conflicts with other plugins using this system

//Require EDD autoupdate file
if( !class_exists( 'EDD_SL_Plugin_Updater' ) ) {
	// load our custom updater if it doesn't already exist
	require_once( NINJA_FORMS_MP_DIR.'/includes/EDD_SL_Plugin_Updater.php' );
}

$plugin_settings = get_option( 'ninja_forms_settings' );

// retrieve our license key from the DB
if( isset( $plugin_settings['mp_license'] ) ){
	$mp_license = $plugin_settings['mp_license'];
}else{
	$mp_license = '';
}

// setup the updater
$edd_updater = new EDD_SL_Plugin_Updater( NINJA_FORMS_MP_EDD_SL_STORE_URL, __FILE__, array(
		'version' 	=> NINJA_FORMS_MP_VERSION, 		// current version number
		'license' 	=> $mp_license, 	// license key (used get_option above to retrieve from DB)
		'item_name'     => NINJA_FORMS_MP_EDD_SL_ITEM_NAME, 	// name of this plugin
		'author' 	=> 'WP Ninjas'  // author of this plugin
	)
);

require_once(NINJA_FORMS_MP_DIR."/includes/admin/open-div.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/close-div.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/edit-field-ul.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/scripts.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/ajax.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/form-settings-metabox.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/license-option.php");

require_once(NINJA_FORMS_MP_DIR."/includes/display/nav.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/filter-fields.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/breadcrumb.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/progress-bar.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/page-title.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/scripts.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/output-divs.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/form/confirm.php");

require_once(NINJA_FORMS_MP_DIR."/includes/display/processing/before-pre-process.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/processing/post-process.php");
require_once(NINJA_FORMS_MP_DIR."/includes/display/processing/confirm.php");

require_once(NINJA_FORMS_MP_DIR."/includes/fields/page-divider.php");

require_once(NINJA_FORMS_MP_DIR."/includes/functions.php");

add_action( 'ninja_forms_save_new_form_settings', 'ninja_forms_mp_new_form_add_page', 10, 2 );
function ninja_forms_mp_new_form_add_page( $form_id, $data ){
	if( $data['multi_part'] == 1 ){
		$args = array(
			'type' => '_page_divider',
		);
		ninja_forms_insert_field( $form_id, $args );
	}
}