/*	
 * jQuery mmenu v4.5.5
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * Licensed under the MIT license:
 * http://en.wikipedia.org/wiki/MIT_License
 */

(function( $ ) {

	var _PLUGIN_	= 'mmenu',
		_VERSION_	= '4.5.5';


	//	Plugin already excists
	if ( $[ _PLUGIN_ ] )
	{
		return;
	}


	//	Global variables
	var _c = {}, _d = {}, _e = {},
		plugin_initiated = false;

	var glbl = {
		$wndw: null,
		$html: null,
		$body: null
	};


	/*
		Class
	*/
	$[ _PLUGIN_ ] = function( $menu, opts, conf )
	{
		this.$menu	= $menu;
		this.opts	= opts
		this.conf	= conf;
		this.vars	= {};

		this.opts = extendOptions( this.opts, this.conf, this.$menu );

		this._initMenu();
		this._init( this.$menu.children( this.conf.panelNodetype ) );

		return this;
	};

	$[ _PLUGIN_ ].version = _VERSION_;

	$[ _PLUGIN_ ].addons = [];

	$[ _PLUGIN_ ].uniqueId = 0;
	
	$[ _PLUGIN_ ].defaults = {
		classes			: '',
		slidingSubmenus	: true,
		onClick			: {
//			close				: true,
//			blockUI				: null,
//			preventDefault		: null,
			setSelected			: true
		}
	};

	$[ _PLUGIN_ ].configuration = {
		panelNodetype		: 'ul, ol, div',
		transitionDuration	: 700,
		openingInterval		: 50,
		classNames	: {
			panel		: 'Panel'
		}
	};
	$[ _PLUGIN_ ].prototype = {

		_init: function( $panels )
		{
			
			$panels = $panels.not( '.' + _c.nopanel );
			$panels = this._initPanels( $panels );
			$panels = this._bindCustomEvents( $panels );

			for ( var a = 0; a < $[ _PLUGIN_ ].addons.length; a++ )
			{
				if ( typeof this[ '_init_' + $[ _PLUGIN_ ].addons[ a ] ] == 'function' )
				{
					this[ '_init_' + $[ _PLUGIN_ ].addons[ a ] ]( $panels );
				}
			}
			this._update();
		},

		_initMenu: function()
		{
			var that = this;

			//	Strip whitespace
			this.$menu.contents().each(
				function()
				{
					if ( $(this)[ 0 ].nodeType == 3 )
					{
						$(this).remove();
					}
				}
			);

			this.$menu
				.parent()
				.addClass( _c.wrapper );

			var clsn = [ _c.menu ];

			this.$menu.addClass( clsn.join( ' ' ) );
		},

		_initPanels: function( $panels )
		{
			var that = this;

			//	Add List class
			this.__findAddBack( $panels, 'ul' )
				.addClass( _c.list );

			//	Refactor Panel class
			this.__refactorClass( that.__findAddBack( $panels, '.' + that.conf.classNames.panel ), that.conf.classNames.panel, 'panel' );

			//	Add Panel class			
			$panels
				.add( that.__findAddBack( $panels, '.' + _c.list ).children().children().filter( that.conf.panelNodetype ).not( '.' + _c.nopanel ) )
				.addClass( _c.panel );

			var $curpanels = that.__findAddBack( $panels, '.' + _c.panel ),
				$allpanels = $('.' + _c.panel, that.$menu);

			//	Add an ID to all panels
			$curpanels
				.each(
					function( i )
					{
						var $t = $(this),
							id = $t.attr( 'id' ) || that.__getUniqueId();

						$t.attr( 'id', id );
					}
			);

			//	Set current opened
			var $current = $allpanels.filter( '.' + _c.opened );

			if ( !$current.length )
			{
				$current = $curpanels.first();
			}
			$current
				.addClass( _c.opened )
				.last()
				.addClass( _c.current );

			return $curpanels;
		},
		
		_bindCustomEvents: function( $panels )
		{
			var that = this;

			$panels
				.off( _e.toggle + ' ' + _e.open + ' ' + _e.close )
				.on( _e.toggle + ' ' + _e.open + ' ' + _e.close,
					function( e )
					{
						e.preventDefault();
						e.stopPropagation();
					}
				);


			return $panels;
		},

		_update: function( fn )
		{
			if ( !this.updates )
			{
				this.updates = [];
			}
			if ( typeof fn == 'function' )
			{
				this.updates.push( fn );
			}
			else
			{
				for ( var u = 0, l = this.updates.length; u < l; u++ )
				{
					this.updates[ u ].call( this, fn );
				}
			}
		},

		__valueOrFn: function( o, $e, d )
		{
			if ( typeof o == 'function' )
			{
				return o.call( $e[ 0 ] );
			}
			if ( typeof o == 'undefined' && typeof d != 'undefined' )
			{
				return d;
			}
			return o;
		},
		
		__refactorClass: function( $e, o, c )
		{
		},

		__findAddBack: function( $e, s )
		{	
			return $e.find( s ).add( $e.filter( s ) );
		},
		
		__transitionend: function( $e, fn, duration )
		{
			
			var _ended = false,
				_fn = function()
				{
					if ( !_ended )
					{
						fn.call( $e[ 0 ] );
					}
					_ended = true;
				};
	
//			$e.one( _e.transitionend, _fn );
			$e.one( _e.webkitTransitionEnd, _fn );
			setTimeout( _fn, duration * 1.8 );
		},
		
		__getUniqueId: function()
		{
			return _c.mm( $[ _PLUGIN_ ].uniqueId++ );
		}
	};


	/*
		jQuery plugin
	*/
	$.fn[ _PLUGIN_ ] = function( opts, conf )
	{
		//	First time plugin is fired
		if ( !plugin_initiated )
		{
			_initPlugin();
		}

		//	Extend options
		opts = extendOptions( opts, conf );
		conf = extendConfiguration( conf );

		return this.each(
			function()
			{
				var $menu = $(this);
				if ( $menu.data( _PLUGIN_ ) )
				{
					return;
				}
				$menu.data( _PLUGIN_, new $[ _PLUGIN_ ]( $menu, opts, conf ) );
			}
		);
	};


	/*
		SUPPORT
	*/
	$[ _PLUGIN_ ].support = {
		touch: 'ontouchstart' in window.document
	};


	/*
		DEBUG
	*/
	$[ _PLUGIN_ ].debug = function( msg ) {};
	$[ _PLUGIN_ ].deprecated = function( depr, repl )
	{
		if ( typeof console != 'undefined' && typeof console.warn != 'undefined' )
		{
			console.warn( 'MMENU: ' + depr + ' is deprecated, use ' + repl + ' instead.' );
		}
	};


	function extendOptions( o, c, $m )
	{
		if ( $m )
		{
			if ( typeof o != 'object' )
			{
				o = {};
			}
			return o;
		}
		
		//	Extend from defaults
		o = $.extend( true, {}, $[ _PLUGIN_ ].defaults, o );


		//	DEPRECATED
		for ( var a = [ 'position', 'zposition', 'modal', 'moveBackground' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof o[ a[ b ] ] != 'undefined' )
			{
				$[ _PLUGIN_ ].deprecated( 'The option "' + a[ b ] + '"', 'offCanvas.' + a[ b ] );
				o.offCanvas = o.offCanvas || {};
				o.offCanvas[ a[ b ] ] = o[ a[ b ] ];
			}
		}
		//	/DEPRECATED


		return o;
	}
	function extendConfiguration( c )
	{
		c = $.extend( true, {}, $[ _PLUGIN_ ].configuration, c )


		//	DEPRECATED
		for ( var a = [ 'panel', 'list', 'selected', 'label', 'spacer' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof c[ a[ b ] + 'Class' ] != 'undefined' )
			{
				$[ _PLUGIN_ ].deprecated( 'The configuration option "' + a[ b ] + 'Class"', 'classNames.' + a[ b ] );
				c.classNames[ a[ b ] ] = c[ a[ b ] + 'Class' ];
			}
		}
		if ( typeof c.counterClass != 'undefined' )
		{
			$[ _PLUGIN_ ].deprecated( 'The configuration option "counterClass"', 'classNames.counters.counter' );
			c.classNames.counters = c.classNames.counters || {};
			c.classNames.counters.counter = c.counterClass;
		}
		if ( typeof c.collapsedClass != 'undefined' )
		{
			$[ _PLUGIN_ ].deprecated( 'The configuration option "collapsedClass"', 'classNames.labels.collapsed' );
			c.classNames.labels = c.classNames.labels || {};
			c.classNames.labels.collapsed = c.collapsedClass;
		}
		if ( typeof c.header != 'undefined' )
		{
			for ( var a = [ 'panelHeader', 'panelNext', 'panelPrev' ], b = 0, l = a.length; b < l; b++ )
			{
				if ( typeof c.header[ a[ b ] + 'Class' ] != 'undefined' )
				{
					$[ _PLUGIN_ ].deprecated( 'The configuration option "header.' + a[ b ] + 'Class"', 'classNames.header.' + a[ b ] );
					c.classNames.header = c.classNames.header || {};
					c.classNames.header[ a[ b ] ] = c.header[ a[ b ] + 'Class' ];
				}
			}
		}
		for ( var a = [ 'pageNodetype', 'pageSelector', 'menuWrapperSelector', 'menuInjectMethod' ], b = 0, l = a.length; b < l; b++ )
		{
			if ( typeof c[ a[ b ] ] != 'undefined' )
			{
				$[ _PLUGIN_ ].deprecated( 'The configuration option "' + a[ b ] + '"', 'offCanvas.' + a[ b ] );
				c.offCanvas = c.offCanvas || {};
				c.offCanvas[ a[ b ] ] = c[ a[ b ] ];
			}
		}
		//	/DEPRECATED


		return c;
	}

	function _initPlugin()
	{
		plugin_initiated = true;
	
		glbl.$wndw = $(window);
		glbl.$html = $('html');
		glbl.$body = $('body');

		//	Classnames, Datanames, Eventnames
		$.each( [ _c, _d, _e ],
			function( i, o )
			{
				o.add = function( c )
				{
					c = c.split( ' ' );
					for ( var d in c )
					{
						o[ c[ d ] ] = o.mm( c[ d ] );
					}
				};
			}
		);

		//	Classnames
		_c.mm = function( c ) { return 'mm-' + c; };
		_c.add( 'wrapper menu inline panel nopanel list nolist subtitle selected label spacer current highest hidden opened subopened subopen fullsubopen subclose' );
		_c.umm = function( c )
		{
			if ( c.slice( 0, 3 ) == 'mm-' )
			{
				c = c.slice( 3 );
			}
			return c;
		};

		//	Datanames
		_d.mm = function( d ) { return 'mm-' + d; };
		_d.add( 'parent' );

		//	Eventnames
		_e.mm = function( e ) { return e + '.mm'; };
		_e.add( 'toggle open close setSelected transitionend webkitTransitionEnd mousedown mouseup touchstart touchmove touchend scroll resize click keydown keyup' );

		$[ _PLUGIN_ ]._c = _c;
		$[ _PLUGIN_ ]._d = _d;
		$[ _PLUGIN_ ]._e = _e;

		$[ _PLUGIN_ ].glbl = glbl;
	}


})( jQuery );


/*	
 * jQuery mmenu offCanvas addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */


(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'offCanvas';


	$[ _PLUGIN_ ].prototype[ '_init_' + _ADDON_ ] = function( $panels )
	{
		if ( !this.opts[ _ADDON_ ] )
		{
			return;
		}
		if ( this.vars[ _ADDON_ + '_added' ] )
		{
			return;
		}
		this.vars[ _ADDON_ + '_added' ] = true;

		if ( !addon_initiated )
		{
			_initAddon();
		}

		this.opts[ _ADDON_ ] = extendOptions( this.opts[ _ADDON_ ] );
		this.conf[ _ADDON_ ] = extendConfiguration( this.conf[ _ADDON_ ] );

		var opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ],
			clsn = [ _c.offcanvas ];

		if ( typeof this.vars.opened != 'boolean' )
		{
			this.vars.opened = false;
		}

		if ( opts.position != 'left' )
		{
			clsn.push( _c.mm( opts.position ) );
		}
		if ( opts.zposition != 'back' )
		{
			clsn.push( _c.mm( opts.zposition ) );
		}

		this.$menu
			.addClass( clsn.join( ' ' ) )
			.parent()
			.removeClass( _c.wrapper );

		this[ _ADDON_ + '_initPage' ]( glbl.$page );
		this[ _ADDON_ + '_initBlocker' ]();
		this[ _ADDON_ + '_initOpenClose' ]();
		this[ _ADDON_ + '_bindCustomEvents' ]();

		this.$menu[ conf.menuInjectMethod + 'To' ]( conf.menuWrapperSelector );
	};


	//	Add to plugin
	$[ _PLUGIN_ ].addons.push( _ADDON_ );


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		position		: 'left',
		zposition		: 'back',
		modal			: false,
		moveBackground	: true
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		pageNodetype		: 'div',
		pageSelector		: null,
		menuWrapperSelector	: 'body',
		menuInjectMethod	: 'prepend'
	};


	//	Methods
	$[ _PLUGIN_ ].prototype.open = function()
	{
		if ( this.vars.opened )
		{
			return false;
		}

		var that = this;

		this._openSetup();

		//	Without the timeout, the animation won't work because the element had display: none;
		setTimeout(
			function()
			{
				that._openFinish();
			}, this.conf.openingInterval
		);

		return 'open';
	};

	$[ _PLUGIN_ ].prototype._openSetup = function()
	{
		//	Close other menus
		glbl.$allMenus.not( this.$menu ).trigger( _e.close );

		//	Store style and position
		glbl.$page.data( _d.style, glbl.$page.attr( 'style' ) || '' );

		//	Trigger window-resize to measure height
		glbl.$wndw.trigger( _e.resize, [ true ] );

		var clsn = [ _c.opened ];

		//	Add options
		if ( this.opts[ _ADDON_ ].modal )
		{
			clsn.push( _c.modal );
		}
		if ( this.opts[ _ADDON_ ].moveBackground )
		{
			clsn.push( _c.background );
		}
		if ( this.opts[ _ADDON_ ].position != 'left' )
		{
			clsn.push( _c.mm( this.opts[ _ADDON_ ].position ) );
		}
		if ( this.opts[ _ADDON_ ].zposition != 'back' )
		{
			clsn.push( _c.mm( this.opts[ _ADDON_ ].zposition ) );
		}
		if ( this.opts.classes )
		{
			clsn.push( this.opts.classes );
		}
		glbl.$html.addClass( clsn.join( ' ' ) );

		//	Open
		this.vars.opened = true;
		this.$menu.addClass( _c.current + ' ' + _c.opened );
	};

	$[ _PLUGIN_ ].prototype._openFinish = function()
	{
		var that = this;

		//	Callback
		this.__transitionend( glbl.$page,
			function()
			{
				that.$menu.trigger( _e.opened );
			}, this.conf.transitionDuration
		);

		//	Opening
		glbl.$html.addClass( _c.opening );
		this.$menu.trigger( _e.opening );
	};

	$[ _PLUGIN_ ].prototype.close = function()
	{
		if ( !this.vars.opened )
		{
			return false;
		}

		var that = this;

		//	Callback
		this.__transitionend( glbl.$page,
			function()
			{
				that.$menu
					.removeClass( _c.current )
					.removeClass( _c.opened );

				glbl.$html
					.removeClass( _c.opened )
					.removeClass( _c.modal )
					.removeClass( _c.background )
					.removeClass( _c.mm( that.opts[ _ADDON_ ].position ) )
					.removeClass( _c.mm( that.opts[ _ADDON_ ].zposition ) );

				if ( that.opts.classes )
				{
					glbl.$html.removeClass( that.opts.classes );
				}

				//	Restore style and position
				glbl.$page.attr( 'style', glbl.$page.data( _d.style ) );

				that.vars.opened = false;
				that.$menu.trigger( _e.closed );

			}, this.conf.transitionDuration
		);

		//	Closing
		glbl.$html.removeClass( _c.opening );
		this.$menu.trigger( _e.closing );

		return 'close';
	};

	$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initBlocker' ] = function()
	{
		var that = this;

		if ( !glbl.$blck )
		{
			glbl.$blck = $( '<div id="' + _c.blocker + '" />' )
				.appendTo( glbl.$body );
		}

		glbl.$blck
			.off( _e.touchstart )
			.on( _e.touchstart,
				function( e )
				{
					e.preventDefault();
					e.stopPropagation();
					glbl.$blck.trigger( _e.mousedown );
				}
			)
			.on( _e.mousedown,
				function( e )
				{
					e.preventDefault();
					if ( !glbl.$html.hasClass( _c.modal ) )
					{
						that.close();
					}
				}
			);
	};
	
	$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initPage' ] = function( $page )
	{
		if ( !$page )
		{
			$page = $(this.conf[ _ADDON_ ].pageSelector, glbl.$body);
			if ( $page.length > 1 )
			{
				$[ _PLUGIN_ ].debug( 'Multiple nodes found for the page-node, all nodes are wrapped in one <' + this.conf[ _ADDON_ ].pageNodetype + '>.' );
				$page = $page.wrapAll( '<' + this.conf[ _ADDON_ ].pageNodetype + ' />' ).parent();
			}
		}

		$page.addClass( _c.page );
		glbl.$page = $page;			
	};

	$[ _PLUGIN_ ].prototype[ _ADDON_ + '_initOpenClose' ] = function()
	{

	};

	$[ _PLUGIN_ ].prototype[ _ADDON_ + '_bindCustomEvents' ] = function()
	{
		var that = this,
			evnt = _e.open + ' ' + _e.opening + ' ' + _e.opened + ' ' + _e.close + ' ' + _e.closing + ' ' + _e.closed + ' ' + _e.setPage;

		this.$menu
			.off( evnt )
			.on( evnt,
				function( e )
				{
					e.stopPropagation();return false;
					
				}
			);

		//	Menu-events
		this.$menu
			.on( _e.open,
				function( e )
				{
					that.open();return false;
				}
			)
			.on( _e.close,
				function( e )
				{
					that.close();return false;
				}
			)
			.on( _e.setPage,
				function( e, $page )
				{
					that[ _ADDON_ + '_initPage' ]( $page );
					that[ _ADDON_ + '_initOpenClose' ]();
				}
			);
	};


	function extendOptions( o )
	{
		//	DEPRECATED
		if ( o.position == 'top' || o.position == 'bottom' )
		{
			if ( o.zposition == 'back' || o.zposition == 'next' )
			{
				$[ _PLUGIN_ ].deprecated( 'Using position "' + o.position + '" in combination with zposition "' + o.zposition + '"', 'zposition "front"' );
				o.zposition = 'front';
			}
		}
		//	/DEPRECATED


		return o;
	}

	function extendConfiguration( c )
	{
		if ( typeof c.pageSelector != 'string' )
		{
			c.pageSelector = '> ' + c.pageNodetype;
		}
		
		return c;
	}

	function _initAddon()
	{
		addon_initiated = true;

		_c = $[ _PLUGIN_ ]._c;
		_d = $[ _PLUGIN_ ]._d;
		_e = $[ _PLUGIN_ ]._e;

		_c.add( 'offcanvas modal background opening blocker page' );
		_d.add( 'style' );
		_e.add( 'opening opened closing closed setPage' );

		glbl = $[ _PLUGIN_ ].glbl;
		glbl.$allMenus = ( glbl.$allMenus || $() ).add( this.$menu );

		//	Prevent tabbing
		glbl.$wndw
			.on( _e.keydown,
				function( e )
				{
					if ( glbl.$html.hasClass( _c.opened ) )
					{
						if ( e.keyCode == 9 )
						{
							e.preventDefault();
							return false;
						}
					}
				}
			);

		//	Set page min-height to window height
		var _h = 0;
		glbl.$wndw
			.on( _e.resize,
				function( e, force )
				{
					if ( force || glbl.$html.hasClass( _c.opened ) )
					{
						var nh = glbl.$wndw.height();
						if ( force || nh != _h )
						{
							_h = nh;
							glbl.$page.css( 'minHeight', nh );
						}
					}
				}
			);
	}

	var _c, _d, _e, glbl,
		addon_initiated = false;

})( jQuery );


/*	
 * jQuery mmenu dragOpen addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(e){function t(e,t,n){return t>e&&(e=t),e>n&&(e=n),e}function n(t){return"boolean"==typeof t&&(t={open:t}),"object"!=typeof t&&(t={}),t=e.extend(!0,{},e[s].defaults[i],t)}function o(e){return e}function a(){c=!0,r=e[s]._c,p=e[s]._d,f=e[s]._e,r.add("dragging"),d=e[s].glbl}var s="mmenu",i="dragOpen";e[s].prototype["_init_"+i]=function(){if("function"==typeof Hammer&&this.opts.offCanvas&&!this.vars[i+"_added"]){this.vars[i+"_added"]=!0,c||a(),this.opts[i]=n(this.opts[i]),this.conf[i]=o(this.conf[i]);var p=this,h=this.opts[i],m=this.conf[i];if(h.open){if(Hammer.VERSION<2)return e[s].deprecated("Older version of the Hammer library","version 2 or newer"),!1;var u,g,l,v,_={},w=0,b=!1,y=!1,$=0,x=0;switch(this.opts.offCanvas.position){case"left":case"right":_.events="panleft panright",_.typeLower="x",_.typeUpper="X",y="width";break;case"top":case"bottom":_.events="panup pandown",_.typeLower="y",_.typeUpper="Y",y="height"}switch(this.opts.offCanvas.position){case"left":case"top":_.negative=!1;break;case"right":case"bottom":_.negative=!0}switch(this.opts.offCanvas.position){case"left":_.open_dir="right",_.close_dir="left";break;case"right":_.open_dir="left",_.close_dir="right";break;case"top":_.open_dir="down",_.close_dir="up";break;case"bottom":_.open_dir="up",_.close_dir="down"}var C=this.__valueOrFn(h.pageNode,this.$menu,d.$page);"string"==typeof C&&(C=e(C));var k=d.$page;switch(this.opts.offCanvas.zposition){case"front":k=this.$menu;break;case"next":k=k.add(this.$menu)}var S=new Hammer(C[0]);S.on("panstart",function(e){switch(v=e.center[_.typeLower],p.opts.offCanvas.position){case"right":case"bottom":v>=d.$wndw[y]()-h.maxStartPos&&(w=1);break;default:v<=h.maxStartPos&&(w=1)}b=_.open_dir}).on(_.events+" panend",function(e){w>0&&e.preventDefault()}).on(_.events,function(e){if(u=e["delta"+_.typeUpper],_.negative&&(u=-u),u!=$&&(b=u>=$?_.open_dir:_.close_dir),$=u,$>h.threshold&&1==w){if(d.$html.hasClass(r.opened))return;w=2,p._openSetup(),p.$menu.trigger(f.opening),d.$html.addClass(r.dragging),x=t(d.$wndw[y]()*m[y].perc,m[y].min,m[y].max)}2==w&&(g=t($,10,x)-("front"==p.opts.offCanvas.zposition?x:0),_.negative&&(g=-g),l="translate3d("+g+"px,0px,0px )",k.css({"-webkit-transform":l}))}).on("panend",function(){2==w&&(d.$html.removeClass(r.dragging),k.css("-webkit-transform",""),p[b==_.open_dir?"_openFinish":"close"]()),w=0})}}},e[s].addons.push(i),e[s].defaults[i]={open:!1,maxStartPos:200,threshold:25},e[s].configuration[i]={width:{perc:.8,min:70,max:440},height:{perc:.8,min:140,max:880}};var r,p,f,d,c=!1}(jQuery);
/*	
 * jQuery mmenu footer addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function o(o){return"boolean"==typeof o&&(o={add:o,update:o}),"object"!=typeof o&&(o={}),o=t.extend(!0,{},t[a].defaults[s],o)}function n(t){return t}function e(){h=!0,i=t[a]._c,d=t[a]._d,r=t[a]._e,i.add("footer hasfooter"),f=t[a].glbl}var a="mmenu",s="footer";t[a].prototype["_init_"+s]=function(a){h||e();var d=this.vars[s+"_added"];this.vars[s+"_added"]=!0,d||(this.opts[s]=o(this.opts[s]),this.conf[s]=n(this.conf[s]));var f=this,u=this.opts[s];if(this.conf[s],!d&&u.add){var c=u.content?u.content:u.title;t('<div class="'+i.footer+'" />').appendTo(this.$menu).append(c)}var p=t("div."+i.footer,this.$menu);p.length&&(this.$menu.addClass(i.hasfooter),u.update&&a.each(function(){var o=t(this),n=t("."+f.conf.classNames[s].panelFooter,o),e=n.html();e||(e=u.title);var a=function(){p[e?"show":"hide"](),p.html(e)};o.on(r.open,a),o.hasClass(i.current)&&a()}),"function"==typeof this._init_buttonbars&&this._init_buttonbars(p))},t[a].addons.push(s),t[a].defaults[s]={add:!1,content:!1,title:"",update:!1},t[a].configuration.classNames[s]={panelFooter:"Footer"};var i,d,r,f,h=!1}(jQuery);
/*	
 * jQuery mmenu header addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(e){function t(t){return"boolean"==typeof t&&(t={add:t,update:t}),"object"!=typeof t&&(t={}),t=e.extend(!0,{},e[s].defaults[r],t)}function a(e){return e}function n(){l=!0,i=e[s]._c,o=e[s]._d,h=e[s]._e,i.add("header hasheader prev next title"),d=e[s].glbl}var s="mmenu",r="header";e[s].prototype["_init_"+r]=function(s){l||n();var o=this.vars[r+"_added"];this.vars[r+"_added"]=!0,o||(this.opts[r]=t(this.opts[r]),this.conf[r]=a(this.conf[r]));var c=this,f=this.opts[r];if(this.conf[r],!o&&f.add){var p=f.content?f.content:'<a class="'+i.prev+'" href="#"></a><span class="'+i.title+'"></span><a class="'+i.next+'" href="#"></a>';e('<div class="'+i.header+'" />').prependTo(this.$menu).append(p)}var u=e("div."+i.header,this.$menu);if(u.length){if(this.$menu.addClass(i.hasheader),f.update){var v=u.find("."+i.title),m=u.find("."+i.prev),_=u.find("."+i.next),g=!1;d.$page&&(g="#"+d.$page.attr("id")),o||m.add(_).off(h.click).on(h.click,function(t){t.preventDefault(),t.stopPropagation();var a=e(this).attr("href");"#"!==a&&(g&&a==g?c.$menu.trigger(h.close):e(a,c.$menu).trigger(h.open))}),s.each(function(){var t=e(this),a=e("."+c.conf.classNames[r].panelHeader,t),n=e("."+c.conf.classNames[r].panelPrev,t),s=e("."+c.conf.classNames[r].panelNext,t),o=a.html(),d=n.attr("href"),l=s.attr("href");o||(o=e("."+i.subclose,t).html()),o||(o=f.title),d||(d=e("."+i.subclose,t).attr("href"));var p=n.html(),u=s.html(),g=function(){v[o?"show":"hide"](),v.html(o),m[d?"attr":"removeAttr"]("href",d),m[d||p?"show":"hide"](),m.html(p),_[l?"attr":"removeAttr"]("href",l),_[l||u?"show":"hide"](),_.html(u)};t.on(h.open,g),t.hasClass(i.current)&&g()})}"function"==typeof this._init_buttonbars&&this._init_buttonbars(u)}},e[s].addons.push(r),e[s].defaults[r]={add:!1,content:!1,title:"Menu",update:!1},e[s].configuration.classNames[r]={panelHeader:"Header",panelNext:"Next",panelPrev:"Prev"};var i,o,h,d,l=!1}(jQuery);
/*	
 * jQuery mmenu searchfield addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'searchfield';
	
	$[ _PLUGIN_ ].prototype[ '_init_' + _ADDON_ ] = function( $panels )
	{
		if ( !addon_initiated )
		{
			_initAddon();
		}
		
		var addon_added = this.vars[ _ADDON_ + '_added' ];
		this.vars[ _ADDON_ + '_added' ] = true;

		if ( !addon_added )
		{
			this.opts[ _ADDON_ ] = extendOptions( this.opts[ _ADDON_ ] );
			this.conf[ _ADDON_ ] = extendConfiguration( this.conf[ _ADDON_ ] );
		}

		var that = this,
			opts = this.opts[ _ADDON_ ],
			conf = this.conf[ _ADDON_ ];


		//	Add the searchfield(s)
		if ( opts.add )
		{
			switch( opts.addTo )
			{
				case 'menu':
					var $wrapper = this.$menu;
					break;

				case 'panels':
					var $wrapper = $panels;
					break;

				default:
					var $wrapper = $(opts.addTo, this.$menu).filter( '.' + _c.panel );
					break;
			}

			if ( $wrapper.length )
			{
				$wrapper.each(
					function()
					{
						//	Add the searchfield
						var $panl = $(this),
							_node = $panl.is( '.' + _c.list ) ? 'li' : 'div';

						if ( !$panl.children( _node + '.' + _c.search ).length )
						{
							if ( $panl.is( '.' + _c.menu ) )
							{
								var $wrpr = that.$menu,
									insrt = 'prependTo';
							}
							else
							{
								var $wrpr = $panl.children().first(),
									insrt = ( $wrpr.is( '.' + _c.subtitle ) )
										? 'insertAfter'
										: 'insertBefore';
							}

							$( '<' + _node + ' class="' + _c.search + '" />' )
								.append( '<input placeholder="' + opts.placeholder + '" type="text" autocomplete="off" />' )
								[ insrt ]( $wrpr );
						}
					
					}
				);
			}
		}

		if ( this.$menu.children( 'div.' + _c.search ).length )
		{
			this.$menu.addClass( _c.hassearch );
		}

		//	Search through list items
		if ( opts.search )
		{
			var $search = $('.' + _c.search, this.$menu);
			if ( $search.length )
			{
				$search
					.each(
						function()
						{
							var $srch = $(this);

							if ( opts.addTo == 'menu' )
							{
								var $pnls = $('.' + _c.panel, that.$menu),
									$panl = that.$menu;
							}
							else
							{
								var $pnls = $srch.closest( '.' + _c.panel ),
									$panl = $pnls;
							}
							var $inpt = $srch.children( 'input' ),
								$itms = that.__findAddBack( $pnls, '.' + _c.list ).children( 'li' ),
								$rslt = $itms
									.not( '.' + _c.search )
									.not( '.' + _c.noresultsmsg );

							var _searchText = '> a';
							if ( !opts.showLinksOnly )
							{
								_searchText += ', > span';
							}

							$inpt
								.off( _e.keyup + ' ' + _e.change )
								.on( _e.keyup,
									function( e )
									{
										if ( !preventKeypressSearch( e.keyCode ) )
										{
											$srch.trigger( _e.search );
										}
									}
								)
								.on( _e.change,
									function( e )
									{
										$srch.trigger( _e.search );
									}
								);
			
							$srch
								.off( _e.reset + ' ' + _e.search )
								.on( _e.reset + ' ' + _e.search,
									function( e )
									{
										e.stopPropagation();
									}
								)
								.on( _e.reset,
									function( e )
									{
										$srch.trigger( _e.search, [ '' ] );
									}
								)
								.on( _e.search,
									function( e, query )
									{
										if ( typeof query == 'string' )
										{
											$inpt.val( query );
										}
										else
										{
											query = $inpt.val().trim();
										}

										//	Scroll to top
										$pnls.scrollTop( 0 );
										
										
										
										
										var $item = null,
											$searchlist = $panl.find("#mm-0").children(),										
											listLength = 853;	//$searchlist.length -1;	// 처음 목록 제외하고 검색
										
										for( var i=listLength; i>0; i-- )	{		// 1 ~ 853 검색
											$item = $searchlist.eq(i);
											$item.text().indexOf(query) !== -1? $item.removeClass( _c.hidden ) : $item.addClass( _c.hidden );
										}
	
										$searchlist.not(".mm-hidden").length === 1? $searchlist.first().show() : $searchlist.first().hide();
										
										
										
										
										// Update for other addons
										that._update();
									}
								);
						}
					);
			}
		}
	};


	//	Add to plugin
	$[ _PLUGIN_ ].addons.push( _ADDON_ );


	//	Defaults
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		add				: false,
		addTo			: 'menu',
		search			: false,
//		showLinksOnly	: true,
		placeholder		: 'Search',
		noResults		: 'No results found.'
	};
	

	function preventKeypressSearch( c )
	{
		switch( c )
		{
			case 9:		//	tab
			case 16:	//	shift
			case 17:	//	control
			case 18:	//	alt
			case 37:	//	left
			case 38:	//	top
			case 39:	//	right
			case 40:	//	bottom
				return true;
		}
		return false;
	}


	function extendOptions( o )
	{
		if ( typeof o == 'boolean' )
		{
			o = {
				add		: o,
				search	: o
			};
		}
		if ( typeof o != 'object' )
		{
			o = {};
		}
		o = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], o );

		if ( typeof o.showLinksOnly != 'boolean' )
		{
			o.showLinksOnly = ( o.addTo == 'menu' );
		}
		return o;
	}

	function extendConfiguration( c )
	{
		return c;
	}
	
	function _initAddon()
	{
		addon_initiated = true;

		_c = $[ _PLUGIN_ ]._c;
		_d = $[ _PLUGIN_ ]._d;
		_e = $[ _PLUGIN_ ]._e;

		_c.add( 'search hassearch noresultsmsg noresults nosubresults' );
		_e.add( 'search reset change' );

		glbl = $[ _PLUGIN_ ].glbl;
	}

	var _c, _d, _e, glbl,
		addon_initiated = false;

})( jQuery );


/*	
 * jQuery mmenu toggles addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function e(t){return t}function s(t){return t}function c(){r=!0,n=t[i]._c,o=t[i]._d,l=t[i]._e,n.add("toggle check"),h=t[i].glbl}var i="mmenu",a="toggles";t[i].prototype["_init_"+a]=function(i){r||c();var o=this.vars[a+"_added"];this.vars[a+"_added"]=!0,o||(this.opts[a]=e(this.opts[a]),this.conf[a]=s(this.conf[a]));var l=this;this.opts[a],this.conf[a],this.__refactorClass(t("input",i),this.conf.classNames[a].toggle,"toggle"),this.__refactorClass(t("input",i),this.conf.classNames[a].check,"check"),t("input."+n.toggle,i).add("input."+n.check,i).each(function(){var e=t(this),s=e.closest("li"),c=e.hasClass(n.toggle)?"toggle":"check",i=e.attr("id")||l.__getUniqueId();s.children('label[for="'+i+'"]').length||(e.attr("id",i),s.prepend(e),t('<label for="'+i+'" class="'+n[c]+'"></label>').insertBefore(s.children().last()))})},t[i].addons.push(a),t[i].defaults[a]={},t[i].configuration.classNames[a]={toggle:"Toggle",check:"Check"};var n,o,l,h,r=!1}(jQuery);