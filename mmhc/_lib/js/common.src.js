/* ------------------------------------------------------------------------------ */
/* initFocusAccordion */
/* ------------------------------------------------------------------------------ */
function initFocusAccordion(){

	//vars
	var $container = $('#focus'),
		$accordions = $container.find('.accordion'),
		$btns = $container.find('.btnTitle'),
		activeClasses = [ 'activeA', 'activeB', 'activeC' ],
		activeIndex = 0,
		btnActiveCls = 'active',
		
		//function - setActive
		setActive = function(idx){
			//update activeIndex with supplied index
			activeIndex = idx; 
			//update container active class
			$container
				.removeClass( activeClasses.join(' ') )
				.addClass( activeClasses[activeIndex] );
			//update trigger button status
			$.each($accordions, function(i, ele){
				var $accordion = $(ele),
					$btn = $accordion.find('.btnTitle');
				if ( i == idx ) {
					$accordion.attr('data-active', '1');
					$btn.addClass(btnActiveCls);	
				} else {
					$accordion.attr('data-active', '0');
					$btn.removeClass(btnActiveCls);	
				}
			});
		};
	
	//process each inctances
	$.each($accordions, function(idx, ele){
		//vars
		var $ele = $(ele), //instance
			$btn = $ele.find('.btnTitle'), //trigger btn
			defaultaActive = $ele.attr('data-active') == 1 ? true : false; //default active flag	
		
		//update activeIndex if default active flag is found
		if ( defaultaActive ) activeIndex = idx;
		
		//enable trigger button
		$btn.on('click', function(e){
			e.preventDefault();
			if ( defaultaActive ) {
				return;			//ignore if already active
			} else {
				setActive(idx);	//update with new active index
			}
		});
	});
	
	//init set active instance based on activeIndex
	setActive(activeIndex);
	
}
/* ------------------------------------------------------------------------------ */
/* initNewsSlideshow */
/* ------------------------------------------------------------------------------ */
function initNewsSlideshow(){
	
	//vars
	var	$news = $('#news'),
		$slideshow = $news.find('.newsSlideshow'),
		$btnPrev = $news.find('.btnPrev'),
		$btnNext = $news.find('.btnNext'),
		initiated = destroyed = slideshowMode = false,
		newsSlideshow;
	
	//init slideshow
	function init(){
		//init media interaction
		newsSlideshow = new initSlideshows('.newsSlideshow');
		
		//hook up slideshow with independent buttons
		$btnPrev.bind('click', function(e){
			e.preventDefault();
			$slideshow.cycle('prev');	
		});
		$btnNext.bind('click', function(e){
			e.preventDefault();
			$slideshow.cycle('next');		
		});
		
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
/* init */
/* ------------------------------------------------------------------------------ */
var SelectNav, Slideshows, StaticAudios, StaticVideos, Megamenu;
function init(){
	
	//layout assistance
	insertFirstLastChild('#navItems, #sideNav, #sideNav ul, #megafooter > .padder');
	
	//interactions	
	SelectNav = new initSelectNav();
	Megamenu = new initMegamenu();
	initBtnScroll();
	initSharingButtons();
	
	//media
	Slideshows = initSlideshows();
	
	//template specific functions
	if ( $('body#home').length ) {
		initHome();
	} else {
		//enhance form placeholder for old browsers
		$('input, textarea').placeholder();
		
		//media
		StaticAudios = new initStaticAudios();
		StaticVideos = new initStaticVideos();		
	}

	//css3pie rendering
	//initCSS3PIE();
	
	//debug
	displayDebugInfo('#debugInfo');
	
}
function initHome(){
	
	//layout assistance
	insertFirstLastChild('.newsSlideshow');
	
	//focus accordion
	initFocusAccordion();
	
	//news slideshow
	initNewsSlideshow();
	
	//enhance form placeholder for old browsers
	$('#formENews').find('input').placeholder();
	
}
/* DOM.ready */
$(document).ready(function(){ 
	Platform.addDOMClass();
	init();	
});
