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
