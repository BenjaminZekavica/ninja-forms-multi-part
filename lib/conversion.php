<?php

if( class_exists( 'NF_MultiPart_Conversion' ) ) return;

final class NF_MultiPart_Conversion
{
    public function __construct()
    {
        add_filter( 'ninja_forms_after_upgrade_settings', array( $this, 'upgrade_field_settings' ) );
    }

    public function upgrade_field_settings( $form_data )
    {
        return $form_data;
    }
}

new NF_MultiPart_Conversion();