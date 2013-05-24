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
