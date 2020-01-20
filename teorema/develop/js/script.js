var globalCurWidth = $(window).width();
var isTouch = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? true : false;
var isScrollingToProductPhoto = false;

// IS VALID EMAIL
function isValidEmail (email, strict)
{
	if (!strict) email = email.replace(/^\s+|\s+$/g, '');
	var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
	
	return pattern.test(email);
}

// IS VALID PHONE
function isValidPhone(phoneFieldElem)
{
	if (device.android())
	{
		var patternTel = /^[\d|\+][\d|\(|\)|\ |-]{4,20}\d$/;

		if ( patternTel.test(phoneFieldElem.val()) === false) 
		{
			return false;
		}
	}
	else
	{
		if (phoneFieldElem.inputmask("isComplete") === false)
		{
			return false;
		}
	}
	
	return true;
}

// IS RESIZE WINDOW
function windowResizeWidth()
{
	setTimeout(function()
	{
		var window_w = $(window).width();
	
		if (globalCurWidth != window_w)
		{
			globalCurWidth = window_w;
			$(document).trigger("isWindowResizeWidth");
		}
	}, 50);
}

// GET SCROLL WIDTH
function getScrollWidth()
{
	var div = $('<div>').css({
		position: "absolute",
		top: "0px",
		left: "0px",
		width: "100px",
		height: "100px",
		visibility: "hidden",
		overflow: "scroll"
	});
	
	$('body').eq(0).append(div);
	
	var width = div.get(0).offsetWidth - div.get(0).clientWidth;
	
	div.remove();
	
	if ($(window).height() >= $("html").height())
		width = 0;
	
	return width;
}

// OPEN POPUP
function openPopup(popupItem)
{
	var show_popup_item = popupItem;
	
	if (show_popup_item.length === 0)
		return false;
	
	var min_vertical_indent = 20,
		popup_item_height = $(show_popup_item).innerHeight(),
		result_top_pos = $(window).scrollTop() + ($(window).height() - popup_item_height) / 2;
	
	if (popup_item_height + min_vertical_indent*2 > $(window).height()){
		result_top_pos = $(window).scrollTop() + min_vertical_indent;
		$(show_popup_item).css("top", result_top_pos).addClass("popup_big-height");
	}
	
	if ($(".popup.is-show").length)
		$(".popup.is-show").removeClass("popup_big-height is-show").hide();
	
	$(show_popup_item).show();
	
	setTimeout(function(){
		$("#global-overlay").addClass("is-show");
		$(show_popup_item).addClass("is-show");
	},100);
}


$(window).resize(function()
{
	windowResizeWidth();
});

$(document).ready(function()
{
	/* //////////////////////////////////////////// GENERAL ///////////////////////////////////////////// */

		styledInputTextElements();
		initStyledSelect();
		initPhoneMask();
		showPopup();
		closePopup();
		closeFlexMenuActivePopup();
		initFlexHeaderCatalog();
		showMenu();
		navigationMenu();
		showHeaderSearch();
		closeMessage();
		showHeaderOnScrollTop();
		initCatalogSlider();
		initViewdSlider();
		initFeatureSlider();
		choiceCount();
		showHelpInfo();
		initAccordion();


	/* //////////////////////////////////////////// INDEX ///////////////////////////////////////////// */
	
		initPromoSlider();
	
	
	
	/* //////////////////////////////////////////// CATALOG ///////////////////////////////////////////// */
	
		showFilterOptions();
		showMobileFilter();
	
	
	/* //////////////////////////////////////////// PRODUCT DETAIL ///////////////////////////////////////////// */
	
		initStickProductDetail();
		scrollToProductPhoto();
	


	/* //////////////////////////////////////////// ORDERING ///////////////////////////////////////////// */
	
		initStickOrderingPrice();
	
	
	
	/* //////////////////////////////////////////// STORES ///////////////////////////////////////////// */
	
		initStorePhotoSlider();
	
	
	
	/* //////////////////////////////////////////// PHOTOS ///////////////////////////////////////////// */
	
		initPhotoGallery();
		
	
});



/* //////////////////////////////////////////// GENERAL ///////////////////////////////////////////// */
	
	// STYLED INPUT TEXT ELEMENTS
	function styledInputTextElements()
	{
		/* focus on input text, textarea */
		$('input[type="text"], input[type="tel"], input[type="password"], input[type="email"], textarea, .inp-text, .textar').on("focus", function()
		{
			$(this).parents(".form-field").addClass("is-focus").removeClass("is-error-field is-ok-field");
			
			if ($(this).val().length > 0)
				$(this).parents(".form-field").removeClass("is-filled");
		});
		
		$('input[type="text"], input[type="tel"], input[type="password"], input[type="email"], textarea, .inp-text, .textar').on("blur", function()
		{
			var elem = $(this);
			
			setTimeout(function(){
				if (elem.val().length > 0)
					elem.parents(".form-field").addClass("is-filled");
				else
					elem.parents(".form-field").removeClass("is-filled is-focus");
			}, 100);
		});
	}
	
	
	// INIT STYLED SELECT
	function initStyledSelect()
	{
		$(".js-styled-select").select2({
			minimumResultsForSearch: Infinity,
			dropdownAutoWidth: true,
		});
		
		$(".js-styled-select-sorting").select2({
			minimumResultsForSearch: Infinity,
			dropdownAutoWidth: true,
			dropdownParent: $('.sorting')
		});
	}


	// INIT PHONE MASK
	function initPhoneMask()
	{
		if ($(".js-phone-mask").length)
		{
			if (device.android())
				return false;
			
			$(".js-phone-mask").inputmask({"mask": "+7 (999) 999-99-99", "clearIncomplete": false, "autoUnmask": true});
		}
	}


	// SHOW POPUP
	function showPopup()
	{
		$("body").on("click", ".js-show-popup", function()
		{
			var show_popup_item = $(this).data("popup");
			
			if ($(show_popup_item).is("#popup-login"))
				$("#menu").removeClass("is-show");
			
			openPopup(show_popup_item);
		});
	}


	// CLOSE POPUP
	function closePopup()
	{
		$("body").on("click", ".js-close-popup", function()
		{
			$("#global-overlay").removeClass("is-show");
			
			var active_popup = $(".popup.is-show");
			active_popup.removeClass("popup_big-height is-show");
			
			setTimeout(function(){
				active_popup.hide();
			}, 450);
		});
	}
	
	
	// CLOSE FLEX MENU POPUP
	function closeFlexMenuActivePopup()
	{
		$(document).on("click", function(event)
		{
			if ($(event.target).closest(".flexMenu-viewMore>a").length)
				return;
			
			$(".flexMenu-viewMore").each(function()
			{
				if ($(this).is(".active"))
					$(this).find(">a").click();
			});
		});
	}
	
	
	// INIT FLEX HEADER CATALOG
	function initFlexHeaderCatalog()
	{
		if ($(".js-flex-header-catalog").length === 0)
			return false;
		
		$(window).on("load", function()
		{
			$(".js-flex-header-catalog").flexMenu({
				threshold: 0,
				cutoff: 0,
				showOnHover: false,
				linkText: 'Еще',
				linkTitle: 'Еще'
			});
		});
	}
	
	
	// SHOW MENU
	function showMenu()
	{
		$(".js-show-menu").on("click", function()
		{
			$("#global-overlay").addClass("is-show");
			$("#menu").addClass("is-show");
		});
		
		$(".js-close-menu").on("click", function()
		{
			$("#global-overlay").removeClass("is-show");
			$("#menu").removeClass("is-show");
		});
	}
	
	
	// NAVIGATION MENU
	function navigationMenu()
	{
		$(".js-show-menu-level-2").on("click", function()
		{
			var level_2_section = $(this).attr("data-menu-levele-2");
			$(".menu-level-2-section.is-current").removeClass("is-current");
			$(level_2_section).addClass("is-current");
			$("#menu").addClass("is-show-level-2");
		});
		
		$(".js-show-menu-level-1").on("click", function()
		{
			$("#menu").removeClass("is-show-level-2");
		});
	}
	
	
	// SHOW HEADER SEARCH
	function showHeaderSearch()
	{
		$(".js-show-header-search").on("click", function()
		{
			$("#header-search").addClass("is-show");
		});
		
		$(".js-hide-header-search").on("click", function()
		{
			$("#header-search").removeClass("is-show");
		});
	}
	
	
	// CLOSE MESSAGE
	function closeMessage()
	{
		$(".js-close-message").on("click", function()
		{
			$("#message").hide();
		});
	}
	
	
	// SHOW HEADER ON SCROLL TOP
	function showHeaderOnScrollTop()
	{
		if ($(".js-show-header-on-scroll-top").length === 0)
			return false;
		
		var header = $(".js-show-header-on-scroll-top"),
				prev_scroll_pos = $(window).scrollTop();
		
		$(window).on("scroll", function()
		{
			if ($(window).scrollTop() > header.innerHeight())
				header.addClass("is-before-fixed-hide");
			else
				header.removeClass("is-before-fixed-hide");
			
			
			if ($(window).scrollTop() > header.innerHeight()*2)
				header.addClass("is-fixed");
			else
				header.removeClass("is-fixed");
			
			
			if ($(window).scrollTop() < prev_scroll_pos && !isScrollingToProductPhoto)
			{
				if (header.is(".is-fixed-show") === false)
					header.addClass("is-fixed-show");
			}
			else
				header.removeClass("is-fixed-show");
			
			prev_scroll_pos = $(window).scrollTop();
		});
	}
	
	
	// INIT CATALOG SLIDER
	function initCatalogSlider()
	{
		if ($(".js-catalog-slider").length === 0)
			return false;
		
		$(".js-catalog-slider").slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			touchMove: false,
			responsive: [
				{
					breakpoint: 1025,
					settings: {
						slidesToShow: 3,
					}
				},
				{
					breakpoint: 768,
					settings: {
						variableWidth:true,
						slidesToShow: 1,
						slidesToScroll: 2,
					}
				}
			]
		});
	}
	
	
	// INIT CATALOG SLIDER
	function initViewdSlider()
	{
		if ($(".js-viewed-slider").length === 0)
			return false;
		
		$(".js-viewed-slider").slick({
			slidesToShow: 8,
			slidesToScroll: 1,
			touchMove: false,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						variableWidth:true,
						slidesToShow: 1,
						slidesToScroll: 2,
					}
				}
			]
		});
	}
	

	// INIT FEATURE SLIDER
	function initFeatureSlider()
	{
		if ($(".js-feature-slider").length === 0)
			return false;
		
		$(".js-feature-slider").slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			touchMove: false,
			dots:true,
			responsive: [
				{
					breakpoint: 1025,
					settings: {
						slidesToShow: 1,
					}
				}
			]
		});
	}
	
	
	// CHOICE COUNT
	function choiceCount()
	{
		$(".js-count-field").inputmask({ "mask": "9", "repeat": 6, "placeholder": ""});
		
		$(document).on("click", ".js-count-minus", function()
		{
			var count_field = $(this).parents(".choice-count").find(".js-count-field"),
				cur_value = parseInt(count_field.val());
				
			if (cur_value > 1)
				count_field.val(cur_value - 1);
		});
		
		$(document).on("click", ".js-count-plus", function()
		{
			var count_field = $(this).parents(".choice-count").find(".js-count-field"),
				cur_value = parseInt(count_field.val());

			count_field.val(cur_value + 1);
		});
	}
	
	
	// SHOW HELP INFO
	function showHelpInfo()
	{
		$(document).on("click", ".js-show-help-info", function()
		{
			var help_item = $(this).parents(".help"),
				help_item_content = help_item.find(".help-content");
			
			console.log(help_item_content.offset().left);
			
			if (help_item_content.offset().left  <= 0)
			{
				help_item.addClass("_left-pos");
			}
			else if(help_item_content.offset().left + help_item_content.innerWidth() > $(window).width())
			{
				help_item.addClass("_right-pos");
			}
			
			$(".help.is-show").removeClass("is-show _left-pos _right-pos");
			help_item.addClass("is-show");
		});
		
		$(document).on("click", function(event)
		{
			if ($(event.target).closest(".help").length)
				return;
			
			$(".help.is-show").removeClass("is-show _left-pos _right-pos");
		});
	}
	
	
	// INIT ACCORDION
	function initAccordion()
	{
		if ($(".js-toggle-accordion-item").length === 0)
			return false;
		
		$(".js-toggle-accordion-item").on("click", function()
		{
			var accordion_item = $(this).parents(".accordion-item");
			
			if (accordion_item.is(".is-show"))
			{
				accordion_item.find(".accordion-item__content").stop().slideUp(300, function(){
					accordion_item.removeClass("is-show");
					
					if ($(".js-sticky-product-detail").length)
						$(".js-sticky-product-detail").trigger("sticky_kit:recalc");
				});
			}
			else
			{
				accordion_item.find(".accordion-item__content").stop().slideDown(300, function(){
					accordion_item.addClass("is-show");
					
					if ($(".js-sticky-product-detail").length)
						$(".js-sticky-product-detail").trigger("sticky_kit:recalc");
				});
				
				if (accordion_item.find(".slick-slider"))
					accordion_item.find(".slick-slider").slick('setPosition').resize();
			}
		});
	}



/* //////////////////////////////////////////// INDEX ///////////////////////////////////////////// */
	
	// INIT PROMO SLIDER
	function initPromoSlider()
	{
		if ($(".js-promo-slider").length === 0)
			return false;
		
		$(".js-promo-slider").slick({
			autoplay: true,
			autoplaySpeed: 5000,
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			focusOnSelect: true,
			touchMove: false,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						autoplay:false,
					}
				}
			]
		});
	}



/* //////////////////////////////////////////// CATALOG ///////////////////////////////////////////// */
	
	// SHOW FILTER OPTIONS
	function showFilterOptions()
	{
		$(".js-show-filter").on("click", function()
		{
			if ($(this).parents(".filter-item").is(".is-show"))
			{
				$(this).parents(".filter-item").removeClass("is-show");
			}
			else
			{
				if ($(".filter-item.is-show").length)
					$(".filter-item.is-show").removeClass("is-show");
				
				$(this).parents(".filter-item").addClass("is-show");
			}
		});
		
		$(document).on("click", function(event)
		{
			if ($(event.target).closest(".filter-item").length)
				return;
			
			$(".filter-item.is-show").removeClass("is-show");
		});
	}
	
	
	// SHOW MOBILE FILTER
	function showMobileFilter()
	{
		if ($("#filter").length === 0)
			return false;
		
		$(".js-show-mobile-filter").on("click", function()
		{
			$("#global-overlay").addClass("is-show");
			$("#filter").addClass("is-mobile-show");
		});
		
		$(".js-close-mobile-filter").on("click", function()
		{
			$("#global-overlay").removeClass("is-show");
			$("#filter").removeClass("is-mobile-show");
		});
	}



/* //////////////////////////////////////////// PRODUCT DETAIL ///////////////////////////////////////////// */
	
	// INIT STICK PRODUCT DETAIL
	function initStickProductDetail()
	{
		if ($(".js-sticky-product-detail").length === 0)
			return false;
		
		var is_active_sticky_product_detail = false;
		
		configureStickProductDetail();
		
		$(window).on("resize", function()
		{
			configureStickProductDetail();
		});
		
		function configureStickProductDetail()
		{
			var point_for_active = 768;
			
			if ($(window).width() >= point_for_active && is_active_sticky_product_detail === false)
			{
				$(".js-sticky-product-detail").stick_in_parent({
					parent : ".product-detail-content",
					offset_top: 10
				});
				is_active_sticky_product_detail = true;
			}
			
			if ($(window).width() < point_for_active && is_active_sticky_product_detail === true)
			{
				$(".js-sticky-product-detail").trigger("sticky_kit:detach");
				is_active_sticky_product_detail = false;
			}
		}
	}
	
	
	// SCROLL TO PRODUCT PHOTO
	function scrollToProductPhoto()
	{
		if ($(".js-scroll-to-product-photo").length === 0)
			return false;
		
		$(".js-scroll-to-product-photo").on("click", function()
		{
			if (isScrollingToProductPhoto)
				return false;
			
			var photo_index = $(this).data("product-photo"),
					product_photo = $('.product-detail-gallery__main-photo-item[data-product-photo="'+photo_index+'"]');
					product_photo_top_pos = product_photo.offset().top;
			
			isScrollingToProductPhoto = true;
			$('html, body').animate({scrollTop: product_photo_top_pos - 10}, 400, function(){
				isScrollingToProductPhoto = false;
				
				setTimeout(function(){
					$(".js-show-header-on-scroll-top").removeClass("is-fixed-show");
				}, 10);
			});
		});
	}


/* //////////////////////////////////////////// ORDERING ///////////////////////////////////////////// */
	
	// INIT STICK ORDERING PRICE
	function initStickOrderingPrice()
	{
		if ($(".js-sticky-ordering-price").length === 0)
			return false;
		
		var is_active_sticky_ordering_price = false;
		
		configureStickOrderingPrice();
		
		$(window).on("resize", function()
		{
			configureStickOrderingPrice();
		});
		
		function configureStickOrderingPrice()
		{
			var point_for_active = 1025;
			
			if ($(window).width() >= point_for_active && is_active_sticky_ordering_price === false)
			{
				$(".js-sticky-ordering-price").stick_in_parent({
					parent : ".ordering-content-wrapper",
					offset_top: 10
				});
				is_active_sticky_ordering_price = true;
			}
			
			if ($(window).width() < point_for_active && is_active_sticky_ordering_price === true)
			{
				$(".js-sticky-ordering-price").trigger("sticky_kit:detach");
				is_active_sticky_ordering_price = false;
			}
		}
	}
	
	
	
/* //////////////////////////////////////////// STORES ///////////////////////////////////////////// */
	
	// INIT STORE PHOTO SLIDER
	function initStorePhotoSlider()
	{
		if ($(".js-store-photo-slider").length === 0)
			return false;
		
		$(".js-store-photo-slider").each(function()
		{
			var store_gallery_slider = $(this);
			
			var slides_count = store_gallery_slider.find(".store-photo").length;
			
			store_gallery_slider.parents(".store__photo-gallery").find(".store-photo-slider__count-slide").text(slides_count);
			
			store_gallery_slider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				touchMove: false,
			});
			
			store_gallery_slider.on('beforeChange', function(event, slick, currentSlide, nextSlide)
			{
				var next_slide = parseInt(nextSlide + 1);
	
				$(this).parents(".store__photo-gallery").find(".store-photo-slider__cur-slide").text(next_slide);
			});
		});
	}



/* //////////////////////////////////////////// PHOTOS ///////////////////////////////////////////// */
	
	// INIT PHOTO GALLERY
	function initPhotoGallery()
	{
		if ($(".js-about-photo-gallery-slider").length === 0)
			return false;
		
		$(".js-about-photo-gallery-slider").lightGallery({
			thumbnail:false,
			counter: false,
			closable: false
		});
	}
