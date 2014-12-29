<?php
add_action( 'init', 'ninja_forms_register_field_page_divider', 9 );

function ninja_forms_register_field_page_divider( $form_id = '' ){
	global $ninja_forms_processing;

	$args = array(
		'name' => __( 'Page Divider', 'ninja-forms-mp' ),
		'sidebar' => '',
		'display_function' => '',
		'save_function' => '',
		'group' => '',
		'edit_label' => false,
		'edit_label_pos' => false,
		'edit_req' => false,
		'edit_custom_class' => false,
		'edit_help' => false,
		'edit_meta' => false,
		'edit_desc' => false,
		'edit_conditional' => true,
		'process_field' => false,
		'edit_options' => array(
			array(
				'type' => 'text',
				'name' => 'page_name',
				'label' => __( 'Page Title', 'ninja-forms-mp'), //Label to be shown before the option.
				'class' => 'widefat', //Additional classes to be added to the input element.
			),

		),
		'li_class' => 'not-sortable',
		'conditional' => array(
			'action' => array(
				'show' => array(
					'name' => __( 'Show This', 'ninja-forms-mp' ),
					'js_function' => 'ninja_forms_show_mp_page',
					'output' => 'show',
				),				
				'hide' => array(
					'name' => __( 'Hide This', 'ninja-forms-mp' ),
					'js_function' => 'ninja_forms_hide_mp_page',
					'output' => 'hide',
				),			
			),
		),
	);

	if( function_exists( 'ninja_forms_register_field' ) ){
		ninja_forms_register_field( '_page_divider', $args );
	}
}

function ninja_forms_field_page_divider_display( $field_id, $data ){
	global $ninja_forms_loading, $ninja_forms_processing;
	if ( isset ( $ninja_forms_loading ) ) {
		$form_id = $ninja_forms_loading->get_form_ID();
		$form_data = $ninja_forms_loading->get_all_form_settings();
	} else {
		$form_id = $ninja_forms_processing->get_form_ID();
		$form_data = $ninja_forms_processing->get_all_form_settings();
	}

	if( isset( $data['page_name'] ) ){
		$page_name = $data['page_name'];
	}else{
		$page_name = '';
	}
	if( isset( $form_data['mp_display_titles'] ) AND $form_data['mp_display_titles'] == 1 ){
		?>
		<h4><?php echo $page_name;?></h4>
		<?php
	}
}