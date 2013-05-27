/* ------------------------------------------------------------------------------ */
/* initCheckoutDetails */
/* ------------------------------------------------------------------------------ */
function initCheckoutDetails () {
	
	//exit if not 'checkoutDetails' form
	if ( !$('form#checkoutDetails').length && !$('form#checkoutConfirmation').length ) return false;
	
	//vars
	var allowUpdates = $('form#checkoutDetails').length ? true : false, 
		$form = $('#delivery'),
		$chkBoxSameAddress = $('#sameAddress'),
		$fieldsetSameAddress = $('#fieldsetSameAddress'),
		$fieldsDelivery = $form.find('.fields');
		
	//onCheckboxChange
	function onCheckboxChange(){
		val = $chkBoxSameAddress.is(':checked');
		if ( val ) {
			$fieldsDelivery.slideUp();
		} else {
			$fieldsDelivery.slideDown();
		}
	};
	
	//first update 
	onCheckboxChange();
	
	//only allow updates in details form, not confirmation form
	if ( allowUpdates ) {
		//for label actions
		$chkBoxSameAddress.change( onCheckboxChange );
		
		//delegate update function to dummy button to be created by plugin
		$fieldsetSameAddress.delegate('span.checkbox', 'click', onCheckboxChange);
	}
	
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var SelectNav, Megamenu, UtilsMenus, Slideshows, DebugSkins;
function init(){
	
	//layout assistance
	insertFirstLastChild('#navItems');
	
	//widgets
	SelectNav = new initSelectNav();
	Megamenu = new initMegamenu();
	UtilsMenus = new initUtilMenus();
	initCategoriesSlideshow();
	
	//media
	Slideshows = new initSlideshows();	
	
	//form
	initCheckoutDetails();
	
	//css3pie rendering
	//initCSS3PIE();

	//debug
	displayDebugInfo('#debugInfo');
	//DebugSkins = new debugSkin('#debugSkin', '#cssskin', [ 'mmk','mmhc','mmp','mmpe','mmc-ade','mmc-bri','mmc-hob','mmc-per' ]);
	
}
/* DOM.ready */
$(document).ready(function(){ 
	Platform.addDOMClass();
	init();	
});
