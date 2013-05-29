<?php
/**
 * Outputs the HTML for the Multi-Part Form Breadcrumb Navigation.
 *
**/
add_action( 'init', 'ninja_forms_register_mp_display_breadcrumb' );
function ninja_forms_register_mp_display_breadcrumb(){
	if( !is_admin() ){
		add_action( 'ninja_forms_display_before_fields', 'ninja_forms_mp_display_breadcrumb', 8 );
	}
}

function ninja_forms_mp_display_breadcrumb( $form_id ){
	global $ninja_forms_processing;
	$form_row = ninja_forms_get_form_by_id( $form_id );
	$form_data = $form_row['data'];
	if( isset( $form_data['mp_breadcrumb'] ) AND $form_data['mp_breadcrumb'] == 1 ){
		$all_fields = ninja_forms_get_fields_by_form_id( $form_id );

		if( is_array( $all_fields ) AND !empty( $all_fields ) ){
			$pages = array();
			$this_page = array();
			$x = 0;
			foreach( $all_fields as $field ){
				if( $field['type'] == '_page_divider' ){
					$x++;
					$pages[$x]['page_title'] = $field['data']['page_name'];
				}
			}
		}

		$page_count = count($pages);

		if( is_object( $ninja_forms_processing ) ){
			$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
		}else{
			$current_page = 1;
		}

		?>
		<ul class="ninja-forms-mp-breadcrumbs">
			<?php
			if( is_array( $pages ) AND !empty( $pages ) ){
				foreach( $pages as $number => $page ){
					if( $number == $current_page ){
						$class = 'ninja-forms-mp-breadcrumb-active';
					}else{
						$class = 'ninja-forms-mp-breadcrumb-inactive';
					}
					?>
					<li>
						<input type="submit" name="_mp_page_<?php echo $number;?>" value="<?php echo $page['page_title'];?>" class="<?php echo $class;?> ninja-forms-mp-nav" rel="<?php echo $number;?>">
					</li>
					<?php
				}
			}
			?>
		</ul>
		<?php
	}

}