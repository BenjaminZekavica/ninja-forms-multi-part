<script id="nf-tmpl-mp-gutter-left" type="text/template">
	<% if ( hasPrevious() ) { %>
		<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
	<% } %>
</script>

<script id="nf-tmpl-mp-gutter-right" type="text/template">
	<% if ( hasNext() ) { %>
		<i class="fa fa-chevron-circle-right next" aria-hidden="true"></i>
	<% } else { %>
		<i class="fa fa-plus-circle new" aria-hidden="true"></i>
	<% } %>
</script>

<script id="nf-tmpl-mp-layout" type="text/template">
	<div id="nf-mp-main-content"></div>
	<div id="nf-mp-top-drawer"></div>
</script>

<script id="nf-tmpl-mp-main-content-fields-empty" type="text/template">
    <div class="nf-fields-empty">
        <h3><?php _e( 'Add form fields', 'ninja-forms' ); ?></h3>
        <p><?php _e( 'Get started by adding your first form field.', 'ninja-forms' ); ?> <a class="nf-open-drawer" title="Add New Field" href="#" data-drawerid="addField"><?php _e( 'Just click here and select the fields you want.', 'ninja-forms' ); ?></a>
    </div>
</script>

<script id="nf-tmpl-mp-top-drawer-item" type="text/template">
	<%= getIndex() %>
    <div class="nf-part-controls"><div>
        <div class="nf-part-edit nf-part-control"><a href="#" title="Edit"><i class="fa fa-pencil" aria-hidden="true"></i></a></div>
        <div class="nf-part-duplicate nf-part-control"><a href="#" title="Duplicate (^ + C + click)"><i class="nf-duplicate fa fa-files-o" aria-hidden="true"></i></a></div>
        <div class="nf-part-delete nf-part-control"><a href="#" title="Delete (^ + D + click)"><i class="nf-delete fa fa-trash" aria-hidden="true"></i></a></div>
    </div></div>
</script>

<script id="nf-tmpl-mp-top-drawer-pagination-left" type="text/template">
	<i class="fa fa-chevron-left" aria-hidden="true"></i>
</script>

<script id="nf-tmpl-mp-top-drawer-pagination-right" type="text/template">
	<i class="fa fa-chevron-right" aria-hidden="true"></i>
</script>
