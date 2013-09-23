<?php
/*
Plugin Name: Ninja Forms - Multi-Part Forms
Plugin URI: http://ninjaforms.com/downloads/multi-part-forms/
Description: Multi-Part Forms add-on for Ninja Forms.
Version: 1.0.13
Author: The WP Ninjas
Author URI: http://ninjaforms.com
*/

define("NINJA_FORMS_MP_DIR", WP_PLUGIN_DIR."/".basename( dirname( __FILE__ ) ) );
define("NINJA_FORMS_MP_URL", plugins_url()."/".basename( dirname( __FILE__ ) ) );
define("NINJA_FORMS_MP_VERSION", "1.0.13");

function ninja_forms_mp_setup_license() {
	if ( class_exists( 'NF_Extension_Updater' ) ) {
		$NF_Extension_Updater = new NF_Extension_Updater( 'Multi-Part Forms', NINJA_FORMS_MP_VERSION, 'WP Ninjas', __FILE__, 'mp' );
	}
}

add_action( 'admin_init', 'ninja_forms_mp_setup_license' );

require_once(NINJA_FORMS_MP_DIR."/includes/admin/open-div.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/close-div.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/edit-field-ul.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/scripts.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/ajax.php");
require_once(NINJA_FORMS_MP_DIR."/includes/admin/form-settings-metabox.php");

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