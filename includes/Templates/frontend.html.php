<?php $update_templates = version_compare( WPN_Helper::get_plugin_version( 'ninja-forms/ninja-forms.php' ), '3', '>' ); ?>

<script id="tmpl-nf-mp-form-content" type="text/template">
	<div class="nf-mp-header"></div>
	<div class="nf-mp-body"></div>
	<div class="nf-mp-footer"></div>
</script>

<?php if( $update_templates ): ?>
	<script id="tmpl-nf-mp-header" type="text/template">
		{{{ data.renderProgressBar() }}}
		{{{ data.renderBreadcrumbs() }}}
		{{{ data.renderPartTitle() }}}
	</script>
<?php else: ?>
	<script id="tmpl-nf-mp-header" type="text/template">
		<%= renderProgressBar() %>
		<%= renderBreadcrumbs() %>
		<h3>
			<%= title %>
		</h3>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
	<script id="tmpl-nf-mp-footer" type="text/template">
		{{{ data.renderNextPrevious() }}}
	</script>
<?php else: ?>
	<script id="tmpl-nf-mp-footer" type="text/template">
		<%= renderNextPrevious() %>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
	<script id="tmpl-nf-mp-next-previous" type="text/template">
		<ul class="nf-next-previous">
			<# if ( data.showPrevious ) { #>
			<li class="nf-previous-item">
				<input type="button" class="nf-previous" value="Previous" />
			</li>
			<# } #>

			<# if ( data.showNext ) { #>
			<li class="nf-next-item">
				<input type="button" class="nf-next" value="Next" />
			</li>
			<# } #>
		</ul>
	</script>
<?php else: ?>
	<script id="tmpl-nf-mp-next-previous" type="text/template">
		<ul class="nf-next-previous">
			<% if ( showPrevious ) { %>
			<li class="nf-previous-item">
				<input type="button" class="nf-previous" value="Previous" />
			</li>
			<% } %>

			<% if ( showNext ) { %>
			<li class="nf-next-item">
				<input type="button" class="nf-next" value="Next" />
			</li>
			<% } %>
		</ul>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
<script id="tmpl-nf-mp-breadcrumbs" type="text/template">
	<ul class="nf-breadcrumbs">
		<# _.each( data.parts, function( part, index ) { #>
		<li class="{{{ ( data.currentIndex == index ) ? 'active' : '' }}} {{{ ( part.errors ) ? 'errors' : '' }}}">
			<a href="#" class="nf-breadcrumb" data-index="{{{ index }}}">{{{ ( part.errors ) ? '' : '' }}} {{{ part.title }}}</a>
		</li>
		<# } ); #>
	</ul>
</script>
<?php else: ?>
<script id="tmpl-nf-mp-breadcrumbs" type="text/template">
	<ul class="nf-breadcrumbs">
		<% _.each( parts, function( part, index ) { %>
		<li class="<%= ( currentIndex == index ) ? 'active' : '' %> <%= ( part.errors ) ? 'errors' : '' %>">
			<a href="#" class="nf-breadcrumb" data-index="<%= index %>"><%= ( part.errors ) ? '' : '' %> <%= part.title %></a>
		</li>
		<% } ); %>
	</ul>
</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
<script id="tmpl-nf-mp-progress-bar" type="text/template">
	<progress style="width:100%" value="{{{ data.percent }}}" max="100">{{{ data.percent }}} %</progress>
</script>
<?php else: ?>
<script id="tmpl-nf-mp-progress-bar" type="text/template">
	<progress style="width:100%" value="<%= percent %>" max="100"><%= percent %> %</progress>
</script>
<?php endif; ?>
