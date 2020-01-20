
// EXAMPLE ADD TO BASKET
$(document).ready(function(){
	$(".js-test-add-basket").on("click", function()
	{
		$(".add-product-window").addClass("is-show");
		
		setTimeout(function(){
			$(".add-product-window").removeClass("is-show");
		}, 5000);
	});
});
