<?php $update_templates = version_compare( WPN_Helper::get_plugin_version( 'ninja-forms/ninja-forms.php' ), '3', '>' ); ?>
<?php if( $update_templates ): ?>
	<script id="nf-tmpl-mp-form-content" type="text/template">
		<div class="nf-mp-header"></div>
		<div class="nf-mp-body"></div>
		<div class="nf-mp-footer"></div>
	</script>
<?php else: ?>
	<script id="nf-tmpl-mp-form-content" type="text/template">
		<div class="nf-mp-header"></div>
		<div class="nf-mp-body"></div>
		<div class="nf-mp-footer"></div>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
	<script id="nf-tmpl-mp-header" type="text/template">
		{{{ data.renderBreadcrumbs() }}}
		<h3>
			{{{ data.title }}}
		</h3>
	</script>
<?php else: ?>
	<script id="nf-tmpl-mp-header" type="text/template">
		<%= renderBreadcrumbs() %>
		<h3>
			<%= title %>
		</h3>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
	<script id="nf-tmpl-mp-footer" type="text/template">
		{{{ data.renderNextPrevious() }}}
	</script>
<?php else: ?>
	<script id="nf-tmpl-mp-footer" type="text/template">
		<%= renderNextPrevious() %>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
	<script id="nf-tmpl-mp-next-previous" type="text/template">
		<# if ( ! data.showNext && ! data.showPrevious ) return #>
			<ul>
				<# if ( data.showPrevious ) { #>
					<li>
						<a href="#" class="nf-previous">PREVIOUS</a>
					</li>
					<# } #>

						<# if ( data.showNext ) { #>
							<li>
								<a href="#" class="nf-next">NEXT</a>
							</li>
							<# } #>
			</ul>
	</script>
<?php else: ?>
	<script id="nf-tmpl-mp-next-previous" type="text/template">
		<% if ( ! showNext && ! showPrevious ) return %>
		<ul>
			<% if ( showPrevious ) { %>
			<li>
				<a href="#" class="nf-previous">PREVIOUS</a>
			</li>
			<% } %>

			<% if ( showNext ) { %>
			<li>
				<a href="#" class="nf-next">NEXT</a>
			</li>
			<% } %>
		</ul>
	</script>
<?php endif; ?>

<?php if( $update_templates ): ?>
	<script id="nf-tmpl-mp-breadcrumbs" type="text/template">
		<ul>
			<# _.each( data.parts, function( part, index ) { #>
				<li class="{{{ ( data.currentIndex == index ) ? 'active' : '' }}} {{{ ( part.errors ) ? 'errors' : '' }}}">
					<a href="#" class="nf-breadcrumb" data-index="{{{ index }}}">{{{ part.title }}}</a>
					{{{ ( part.errors ) ? '<-- ERRORS' : '' }}}
				</li>
				<# } ); #>
		</ul>
	</script>
<?php else: ?>
	<script id="nf-tmpl-mp-breadcrumbs" type="text/template">
		<ul>
			<% _.each( parts, function( part, index ) { %>
			<li class="<%= ( currentIndex == index ) ? 'active' : '' %> <%= ( part.errors ) ? 'errors' : '' %>">
				<a href="#" class="nf-breadcrumb" data-index="<%= index %>"><%= part.title %></a>
				<%= ( part.errors ) ? '<-- ERRORS' : '' %>
			</li>
			<% } ); %>
		</ul>
	</script>
<?php endif; ?>

