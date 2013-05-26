/* ------------------------------------------------------------------------------ */
/* initSelectNav */
/* ------------------------------------------------------------------------------ */
function initSelectNav() {
	
	//check if DOM elem exists
	if ( !$('#nav').length || !$('#navSelect').length ) return false;
	
	//create global obj
	var selectNav = {};
	
	//function - update
	selectNav.update = function() {
		
		//check if $btnSelect is set visible from Media Queries
		this.selectMode = this.$btnSelect.css('display') != 'none';
		this.itemHeight = Math.ceil( this.$items.outerHeight() );
		
		//enable select nav if selectMode is on
		if ( this.selectMode ) {
			//update container height with all items
			this.containerHeight = this.itemHeight * ( this.totalItems + 1 );
			
			//check if select nav is active
			if ( this.$container.hasClass('active') ) {
				this.$container.height( this.containerHeight );//apply total items height if is
			} else {
				this.$container.height( this.itemHeight );//apply snigle item height if not
			}

			//update select label text
			this.$selectedItem = this.$items.filter('.selected:first');
			if (this.$selectedItem.length) {
				this.$btnSelectLabel.text( this.$selectedItem.text() );
			} else {
				this.$btnSelectLabel.text( this.defaultLabel );
			};
		} else {//if selectMode is off
			//update and apply container height to single item
			this.containerHeight = this.itemHeight;
			this.$container.height( this.containerHeight );
		}
			
	};
	
	//function - bindBtn
	selectNav.bindBtn = function() {
		
		//bind event
		this.$btnSelect.on( 'click', function(e){
			e.preventDefault();
			if ( selectNav.selectMode ) {
				//if nav is active
				if ( !selectNav.$container.hasClass('active') ) {
					selectNav.$container
						.addClass('active')
						.height( selectNav.containerHeight );
					selectNav.$icon
						.removeClass( selectNav.iconClass[0] )
						.addClass( selectNav.iconClass[1] );
				} 
				//if nav is not active
				else { 
					selectNav.$container
						.removeClass('active')
						.height( selectNav.itemHeight );
					selectNav.$icon
						.removeClass( selectNav.iconClass[1] )
						.addClass( selectNav.iconClass[0] );
				}
			}
		});
		
	};
	
	//function - init
	selectNav.init = function(){
		
		//cache DOM elems
		this.$container = $('#nav');
		this.$btnSelect = $('#navSelect');
		this.$btnSelectLabel = this.$btnSelect.find('.label');
		this.$items = this.$container.find('.navItem');
		this.$selectedItem = null,
		this.$icon = this.$btnSelect.find('.icon');
		
		//cache properties
		this.totalItems = this.$items.length;
		this.itemHeight = this.containerHeight = 0;
		this.selectMode = false;
		this.speed = 300;
		this.defaultLabel = 'Menu',
		this.iconClass = [ 'fwicon-chevron-down', 'fwicon-chevron-up' ];
		this.csstransitions = Modernizr.csstransitions;
		
		//first update
		this.update();
		
		//bind button
		this.bindBtn();
		
		//update on window resize
		$(window).resize(function(e) {
			selectNav.update();
		});
			
	};
	
	//init obj
	selectNav.init();
	
	//return global obj
	return selectNav;
		
}
/* ------------------------------------------------------------------------------ */
/* initSelectBox */
/* ------------------------------------------------------------------------------ */
function initSelectBox(cls) {
		
	//vars
	var selectCls = cls || '.selectBox',
		$selectBoxes = $(selectCls),
		iconOpenCls = 'icon icon-chevron-up',
		iconCloseCls = 'icon icon-chevron-down';
		
	//exit if no instance found
	if ( !$selectBoxes.length ) return false;
	
	//function - initCal
	function initSelect(idx, ele) {
		
		//vars
		var $select = $(ele),
			settings = { 
				menuTransition:	'slide',	//[default,slide,fade] - the show/hide transition for dropdown menus
				menuSpeed:		'fast',		//[slow,normal,fast] - the show/hide transition speed
				loopOptions:	true		//[boolean] - flag to allow arrow keys to loop through options
			},
			toggleIcon = function(isOpen) {
				var $dropdown = $( $select.selectBox('control') ),
					$btn = $dropdown.find('.selectBox-arrow');
				if ( isOpen ) { 
					$btn.removeClass(iconCloseCls);
					$btn.addClass(iconOpenCls); 
				} else {
					$btn.removeClass(iconOpenCls); 
					$btn.addClass(iconCloseCls); 
				}
			};
		
		//init plugin
		$select
			.selectBox(settings)
			.bind({
				'open': 	function() { toggleIcon( true ); },
				'close':	function() { toggleIcon( false ); }
			});
			
		//add initial icon
		toggleIcon( false );
											
	}
	
	//loop through and process each instance
	$.each( $selectBoxes, initSelect );
	
}
/* ------------------------------------------------------------------------------ */
/* initCalendar */
/* ------------------------------------------------------------------------------ */
function initCalendar(cls) {
	
	//vars
	var calCls = cls || '.calendarView',
		$cals = $(calCls);
	
	//exit if no instance found
	if ( !$cals.length ) return false;
	
	//function - initCal
	function initCal(idx, ele) {
		
		var //common
			$cal = $(ele),
			$calBody = $cal.find('.calendarViewBody:first'),
			$calWeeks = $cal.find('.week'),
			$calDays = $cal.find('.day'),
			$calToday = $cal.find('.today:first'),
			$calEntries = $cal.find('.entries'),
			
			//view interaction
			$btnViewGrid = $cal.find('.btnViewGrid'),
			$btnViewList = $cal.find('.btnViewList'),
			view = $cal.attr('data-view'),
			lastSelectedView = view,
			noEvents,
			viewCls = { grid: 'calendarViewGrid', list: 'calendarViewList' },
			hasDataCls = 'hasData',
			selectedCls = 'selected',
			noEventsCls = 'showMsg noEvents',
						
			//function - checkHasData
			checkHasData = function() {
				
				//reset noEvents
				noEvents = true;
				
				//go through all entries containers to find data
				$.each($calEntries, function(idx, ele) {
					var $entries = $(ele),
						$day = $entries.parent('.day'),
						$weekends = $day.parent('.weekends'),
						$entry = $entries.find('.entry');
					if ($entry.length && !$day.hasClass('pastMonth') && !$day.hasClass('nextMonth')) {
						$day.addClass(hasDataCls);
						if ( $weekends.length ) $weekends.addClass(hasDataCls);
						noEvents = false;
					} else {
						$day.removeClass(hasDataCls);
						if ( $weekends.length && !$day.siblings('.day').hasClass('hasData') ) $weekends.removeClass(hasDataCls);
					}
				});
				
				//if no data at all
				if ( noEvents ) {
					$cal.addClass(noEventsCls);
				} else {
					$cal.removeClass(noEventsCls);
				}
				
			}
		
		/* ------------------------------------------------------------------------------ */
		/* grid view interaction */		
		
		//process week to get max height
		function setWeekHeight( idx, week ) {
			
			//vars
			var $week = $(week),
				$days = $week.find('> .day'),
				maxHeight = 0;
			
			//loop through week days to get max height
			$.each($days, function(idx,ele){
				var $day = $(ele),
					dayHeight = $day.outerHeight();
				if ( dayHeight > maxHeight ) {
					maxHeight = dayHeight	
				}
			});
			
			//apply max height to week
			$week.height( maxHeight );  
			
		}
		
		//loop through all weeks
		function setWeeksHeight() { 
			if (view == 'grid') { $.each($calWeeks, setWeekHeight);  }
		}
		
		/* ------------------------------------------------------------------------------ */
		/* view switching interaction */
		function setGridView(){
			view = 'grid';
			$cal
				.removeClass( viewCls.list )
				.addClass( viewCls.grid )
				.attr('data-view', 'grid');
			$btnViewList.removeClass('selected');
			$btnViewGrid.addClass('selected');
			setWeeksHeight();
		}
		function setListView(){
			view = 'list';
			$cal
				.removeClass( viewCls.grid )
				.addClass( viewCls.list )
				.attr('data-view', 'list');
			$btnViewGrid.removeClass('selected');
			$btnViewList.addClass('selected');
		}
		function initView() {
			//init view mode			
			updateView(view);
			//bind btnView
			$btnViewGrid.unbind().on('click', function(e){ 
				e.preventDefault();
				updateView('grid');
				lastSelectedView = 'grid';
			});
			$btnViewList.unbind().on('click', function(e){ 
				e.preventDefault();
				updateView('list');
				lastSelectedView = 'list';
			});
		}
		
		//updateView
		function updateView(mode) {
			//vars
			var forceList;
			//manually test forceList for oldie
			if ( $('html').hasClass('no-mediaqueries') ) {
				forceList = ( $(window).width() <= 640 ); 
			} else {
				forceList = Modernizr.mq(mqStates.max640);
			}
			//apply specified view mode
			view = mode || view;
			//apply layout
			if ( (!forceList && view == 'grid') || ( !forceList && view == 'list' && lastSelectedView == 'grid' && !mode ) ) {
				setGridView();
			} else {
				setListView();
			}
		}
		
		/* ------------------------------------------------------------------------------ */

		/* update */
		function update() {
			updateView();
		}
		
		/* ------------------------------------------------------------------------------ */
		/* init */
		function init() {
			checkHasData(); //update hasData class
			initView(); //init cal view
			$(window).bind('resize', update); //bind resize event handler
		}
		init();	
		
	}
	
	//loop through and process each instance
	$.each( $cals, initCal );
	
}
/* ------------------------------------------------------------------------------ */
/* initMegamenu */
/* ------------------------------------------------------------------------------ */
function initMegamenu() {
	
	//check if DOM elem exists
	if ( !$('#megamenu').length || !$('#navMegamenu').length ) return false;
	
	//create global obj
	var megamenu = {};

	//function - update
	megamenu.update = function() {
				
		//updates depends on mode
		if (this.activeMode) {
			this.$btnToggle.addClass(this.activeCls);
			this.$container.slideDown(this.speed);
		} else {
			this.$btnToggle.removeClass(this.activeCls);
			this.$container.slideUp(this.speed);	
		}
		
	};	

	//function - bindBtn
	megamenu.bindBtn = function() {
		
		//bind event
		this.$btnToggle.on( 'click', function(e){
			e.preventDefault();
			//only works for 640 and up
			if (!Modernizr.mq(mqStates.max640)) {
				megamenu.activeMode = !megamenu.activeMode;
				megamenu.update();
			}
		});
		
	};
	
	//function - init
	megamenu.init = function(){
		
		//cache DOM elems
		this.$container = $('#megamenu');
		this.$btnToggle = $('#navMegamenu');
				
		//cache properties
		this.activeMode = false;
		this.activeCls = 'active';
		this.speed = 300;
		
		//first update
		this.update();
		
		//bind button
		this.bindBtn();
		
	};
	
	//init obj
	megamenu.init();
	
	//return global obj
	return megamenu;
		
}
/* ------------------------------------------------------------------------------ */
/* initCategoriesSlideshow */
/* ------------------------------------------------------------------------------ */
function initCategoriesSlideshow(){
	
	//exit if no categories slideshow
	if ( !$('#categories').length ) return false;
	
	//vars
	var	$categories = $('#categories'),
		$slideshow = $categories.find('.categoriesSlideshow'),
		$btnPrev = $categories.find('.btnPrev'),
		$btnNext = $categories.find('.btnNext'),
		$pager = $categories.find('.pager'),
		initiated = destroyed = slideshowMode = false,
		categoriesSlideshow,
		customOpts = { 
			prev:   $btnPrev, 
			next:   $btnNext,
			pager:	$pager
		};
	
	//init slideshow
	function init(){
		//init media interaction
		categoriesSlideshow = new initSlideshows('.categoriesSlideshow', customOpts);
		
		//update status
		initiated = true;
		destroyed = false;
		
		//console.log('initiated');
	}
	
	//destroy slideshow
	function destroy(){
		//destroy interaction
		$slideshow.cycle('destroy');
		
		//clean up
		$slideshow.find('.slide').removeAttr('style');
		
		//unhook up slideshow with independent buttons
		$btnPrev.unbind('click');
		$btnNext.unbind('click');
		
		//update status
		initiated = false;
		destroyed = true;
		
		//console.log('destroyed');
	}
	
	//update slideshow
	function update(){
		//determine mode
		//IE has no mq support, manually test
		if ($('html').hasClass('oldie')) {
			slideshowMode = ( $(window).innerWidth() > 500 ) ? true : false;
			//console.log('slideshowMode ', $(window).innerWidth());
		} else {
			slideshowMode = !Modernizr.mq(mqStates.max500);	
		}
		//destroy or init
		if ( slideshowMode && !initiated ) {
			init();
		} else if ( !slideshowMode && !destroyed ) {
			destroy();
		}
		//console.log('mode ', slideshowMode);
	}

	//update on window resize
	$(window).resize(function(e) {
		update();
	});
	
	//init the whole thing
	update();
		
}
/* ------------------------------------------------------------------------------ */
/* initUtilMenus */
/* ------------------------------------------------------------------------------ */
function initUtilMenus() {
	
	//check if DOM elem exists
	if ( !$('#utilsTop').length || !$('#menuCart').length || !$('#menuCate').length ) return false;
	
	//enhance form placeholder for old browsers
	$('#storeSearch').find('input').placeholder();
	
	//create global obj
	var menus = { cart:{}, cate:{} };
	
	//function - menus
	menus.openCart = function(){
		//console.log('action: open cart');
		this.cart.$btnToggle.addClass(this.activeCls);
		this.cart.$container.slideDown(this.speed);
		this.cart.activeMode = true;	
	}
	menus.openCate = function(){
		//console.log('action: open cate');
		this.cate.$btnToggle.addClass(this.activeCls);
		this.cate.$container.slideDown(this.speed);	
		this.cate.activeMode = true;
	}
	menus.closeCart = function(){
		//console.log('action: close cart');
		this.cart.$btnToggle.removeClass(this.activeCls);
		this.cart.$container.slideUp(this.speed);
		this.cart.activeMode = false;
	}
	menus.closeCate = function(){
		//console.log('action: close cate');
		this.cate.$btnToggle.removeClass(this.activeCls);
		this.cate.$container.slideUp(this.speed);
		this.cate.activeMode = false;
	}
	
	//function - update
	menus.update = function(menu) {
		
		//update menus mode
		if ( menu == 'cart' ) { 													//when click on cart
			if (this.cart.activeMode && !this.cate.activeMode) 	{ this.mode = 1; }		//if cart active, close cart
			if (this.cate.activeMode && !this.cart.activeMode) 	{ this.mode = 2; }		//if cate active, close cate and open cart
			if (!this.cart.activeMode && !this.cate.activeMode) { this.mode = 3; }		//none active, open cart
		} else if ( menu == 'cate' ) {												//when click on cate
			if (this.cate.activeMode && !this.cart.activeMode) 	{ this.mode = 4; }		//if cate active, close cate
			if (this.cart.activeMode && !this.cate.activeMode) 	{ this.mode = 5; }		//if cart active, close cart and open cate
			if (!this.cate.activeMode && !this.cart.activeMode) { this.mode = 6; }		//none active, open cate
		} else {																	//when no click
			this.mode = 0;																//none active, close all
		}
		/*
		console.log('-------------------------------');
		console.log('menu: ', menu);
		console.log('mode: ', this.mode);
		*/
		
		//updates depends on mode
		if ( this.mode == 1 ) 		{ this.closeCart(); }
		else if ( this.mode == 2 ) 	{ this.closeCate(); this.openCart(); }
		else if ( this.mode == 3 ) 	{ this.openCart(); }
		else if ( this.mode == 4 ) 	{ this.closeCate(); }
		else if ( this.mode == 5 ) 	{ this.closeCart();	this.openCate(); }
		else if ( this.mode == 6 ) 	{ this.openCate(); }
		else if ( this.mode == 0 ) 	{ this.closeCate(); this.closeCart(); }
		
	};	

	//function - bindBtn
	menus.bindBtn = function() {
		
		//bind menu buttons
		this.cart.$btnToggle.on( 'click', function(e){
			e.preventDefault();
			menus.update('cart');			
		});
		this.cate.$btnToggle.on( 'click', function(e){
			e.preventDefault();
			menus.update('cate');		
		});
		//bind all exit buttons
		$('.btnCloseCart').on( 'click', function(e){
			e.preventDefault();
			menus.closeCart();
		});
		
	};
	
	//function - init
	menus.init = function(){
		
		//cache DOM elems
		this.cart.$container = $('#menuCart');
		this.cart.$btnToggle = $('#btnCart');
		this.cate.$container = $('#menuCate');
		this.cate.$btnToggle = $('#btnCate');
				
		//cache properties
		this.cart.activeMode = this.cate.activeMode = false;
		this.activeCls = 'active';
		this.defaultMenu = '';
		this.speed = 600;
		
		//first update
		if ( this.cate.$container.attr('data-default') == '1' ) { this.defaultMenu = 'cate'; }
		if ( this.cart.$container.attr('data-default') == '1' ) { this.defaultMenu = 'cart'; }
		this.update( this.defaultMenu );
		
		//bind button
		this.bindBtn();
		
	};
	
	//init obj
	menus.init();
	
	//return global obj
	return menus;
		
}

