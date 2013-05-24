/* ------------------------------------------------------------------------------ */
/* initFeatBox */
/* ------------------------------------------------------------------------------ */
function initFeatBox() {
	
	//vars
	var $fBox = $('.f1'),
		activeCls = 'active',
		touch = Modernizr.touch,
		speed = 600;
	
	//exit if no instance
	if ( !$fBox.length ) return false;
	
	//function - processFBox
	function processFBox(idx, ele){
		
		//vars
		var $box = $(ele),
			$heading = $box.find('.heading'),
			$hover = $box.find('.hover'),
			$overlay = $box.find('.overlay'),
			$content = $overlay.find('.content'),
			$controls = $box.find('.controls'),
			$pager = $controls.find('.pager'),
			$btnTrigger = $box.find('.btnTrigger'),
			$btnClose = $overlay.find('.btnClose'),
			$pageDividers = $content.find('hr'),
			hasPaging = $pageDividers.length,
			contentHTML = $content.html(),
			pageDividerHTML = hasPaging ? $pageDividers[0].outerHTML : null,
			pageStartHTML = '<div class="slide">',
			pageEndHTML = '</div>',
			pagerHTML = '',
			btnSlideTMPL = '<a class="btnSlide" href="#"><span>{idx}</span></a>',
						
			//functions
			onHover = function(e){
				//max640
				if (!$box.hasClass(activeCls)) {
					$hover.fadeIn(speed);
				}
			},
			onHoverOff = function(e){
				//max640
				$hover.fadeOut(speed);
			},
			onClickClose = function(e){
				e.preventDefault();	
				//max640
				if (matchMQStates('max640')) {
					$overlay.slideUp(speed, function(){
						$box.removeClass(activeCls);
					})
				} else {
					$overlay.fadeOut(speed, function(){
						$box.removeClass(activeCls);
					})
				}
			},
			onClick = function(e){
				e.preventDefault();	
				//max640
				$box.addClass(activeCls);
				if (matchMQStates('max640')) {
					$overlay.slideDown(speed);
				} else {
					$overlay.fadeIn(speed); 
				}
				$btnClose.one('click', onClickClose);
			},
			initPagingSlides = function($slides, $btnSlides){
				//show target slide and hide others
				function showSlide(targetIdx) {
					$.each( $slides, function(idx, ele){
						var $slide = $(ele),
							$btnSlide = $($btnSlides[idx]);
						if ( idx == targetIdx ) {
							$slide.addClass('active');
							$btnSlide.addClass('activeSlide');
						} else {
							$slide.removeClass('active');
							$btnSlide.removeClass('activeSlide');	
						}
					} );
				}
				//bind btnSlides to show targeted slide
				$.each( $btnSlides, function(idx, ele){
					var $btnSlide = $(ele);
					$btnSlide.on( 'click', function(e){
						e.preventDefault();
						showSlide( idx );	
					} );
				} );
				//show first slide
				showSlide(0);
			},
			initPaging = function(){
				//determine if has paging
				if ( hasPaging ) {
					//update content html
					var regex = new RegExp(pageDividerHTML, 'g');			
					contentHTML = pageStartHTML + contentHTML + pageEndHTML;
					contentHTML	= contentHTML.replace(regex, pageEndHTML + pageStartHTML);
					$content.html( contentHTML );
					//update controls html
					var $slides = $content.find('.slide');
					$.each( $slides, function(idx, ele){
						var $slide = $(ele),
							btnSlideHTML = btnSlideTMPL.replace( '{idx}', String(idx+1) );
						$pager.append( btnSlideHTML );
						//init btnSlides upon the last one
						if ( idx == $slides.length-1 ) initPagingSlides($slides, $pager.find('.btnSlide'));
					} );
					$controls.removeClass('hidden');	
				} else {
					//process controls
					$controls.addClass('hidden');
				}
			};
		
		//enable hover
		if ( !touch ) {
			$btnTrigger.hoverIntent( onHover, onHoverOff );
			$btnTrigger.hoverIntent( onHover, onHoverOff );
		}
		
		//enable click
		$btnTrigger.on('click', onClick );
		
		//init paging process
		initPaging();
		
	}

	//loop through collection
	$.each($fBox, processFBox);

}
/* ------------------------------------------------------------------------------ */
/* initBookingForm */
/* ------------------------------------------------------------------------------ */
function initBookingForm() {
	
	//vars
	var $booking = $('#booking'),
		$bookingForm = $('#bookingForm'),
		$btnForm = $booking.find('.btnAction'),
		activeCls = 'withForm',
		speed = 600;
	
	//exit if no instance
	if ( !$booking.length || !$bookingForm.length ) return false;
	
	//updateForm
	function updateForm(e) {
		if (e) e.preventDefault();
		if ($booking.hasClass(activeCls)) {
			$booking.removeClass(activeCls);
			$bookingForm.slideUp(speed);
		} else {
			$booking.addClass(activeCls);
			$bookingForm.slideDown(speed);
		}	
	}
	
	//bind button events
	$btnForm.on('click', updateForm);
	
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var SelectNav, Slideshows, Megamenu;
function init(){
	
	//layout assistance
	insertFirstLastChild('#navItems');
	
	//interactions	
	SelectNav = new initSelectNav();
	Megamenu = new initMegamenu();
	initBtnScroll();
	initFeatBox();
	initBookingForm();
	
	//media
	Slideshows = initSlideshows();
	
	//enhance form placeholder for old browsers
	$('#formENews').find('input').placeholder();	
	
	//css3pie rendering
	//initCSS3PIE();
	
	//debug
	displayDebugInfo('#debugInfo');
	
}
/* DOM.ready */
$(document).ready(function(){ 
	Platform.addDOMClass();
	init();	
});
