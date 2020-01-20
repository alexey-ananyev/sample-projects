var globalCurWidth = $(window).width();
var isTouch = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? true : false;

var isInitFullpage = false;

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
	
	if($(".js-fullpage").length && isInitFullpage)
		$.fn.fullpage.setAllowScrolling(false);

	$(show_popup_item).show();

	setTimeout(function(){
		$("#global-overlay").addClass("is-show");
		$(show_popup_item).addClass("is-show");
	},100);
}

// RESIZE ACTIVE POPUP
function resizeActivePopup()
{
	var active_popup_item = $(".popup.is-show");
	
	if (active_popup_item.length === 0)
		return false;

	var min_vertical_indent = 20,
			popup_item_height = active_popup_item.innerHeight(),
			result_top_pos = $(window).scrollTop() + ($(window).height() - popup_item_height) / 2;
	
	if (popup_item_height + min_vertical_indent*2 > $(window).height()){
		result_top_pos = $(window).scrollTop() + min_vertical_indent;
		active_popup_item.css("top", result_top_pos).addClass("popup_big-height");
	}
}


$(window).resize(function()
{
	windowResizeWidth();
});


$(document).ready(function()
{
	/* ///// GENERAL ///// */

		styledInputTextElements();
		initStyledSelect();
		initPhoneMask();
		initDateMask();
		initStyledUploadFile();
		showPopup();
		closePopup();
		configurateMainPageMobileHeader();


	/* ///// INDEX ///// */
		
		initFullpage();
		initTeamSlider();
		initFaqSlider();
		animateMainPageFirstScreen();

		
	/* ///// CLUB ///// */
	
		initClubList();


	/* ///// TEST RESULTS ///// */
		
		showTestResult();
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
			}, 50);
		});
	}
	
	
	// INIT STYLED SELECT
	function initStyledSelect()
	{
		$(".js-styled-select").select2({
			minimumResultsForSearch: Infinity,
			dropdownAutoWidth: true,
		});
	}


	// INIT PHONE MASK
	function initPhoneMask()
	{
		if ($(".js-phone-mask").length)
		{
			if (device.android())
				return false;
			
			$(".js-phone-mask").inputmask({
				"mask": "+9 (999) 999-99-99",
				"placeholder": "+7 (999) 999-99-99",
				"clearIncomplete": false,
				"autoUnmask": true,
				"showMaskOnHover": false,
				"removeMaskOnSubmit": true,
			});
		}
	}

	// INIT DATE MASK
	function initDateMask()
	{
		if ($(".js-date-mask").length)
		{
			if (device.android())
				return false;
			
			$(".js-date-mask").inputmask({
				"mask": "99.99.9999", 
				"clearIncomplete": false, 
				"autoUnmask": true,
				"showMaskOnHover": false,
			});
		}
	}
	
	// INIT STYLED UPLOAD FILE
	function initStyledUploadFile()
	{
		$(document).on('change','.js-upload-file', function () 
		{
			var $this = $(this);
			var filename = $this.val().split('\\');
			var load_file_block = $this.parents(".load-file");
			filename = filename[filename.length - 1];
			load_file_block.addClass('is-uploaded');
			load_file_block.find('.uploaded-file-name__val').html(filename);
			//load_file_block.find('.uploaded-file-info').text(fileSize(this.files[0].size));
			
			load_file_block.parents(".form-field").removeClass("is-error-field");
		});

		$(document).on('click', '.js-cancel-upload-file', function (e) 
		{
			var load_file_list = $(this).parents(".load-files").find(".load-file-list");
			var load_file_block = $(this).parents(".load-file");
			
			if (load_file_list.find(".load-file").size() > 1)
			{
				load_file_block.find(".js-upload-file").val('');
				load_file_block.remove();
			}
			else
			{
				clearLoadFileItem(load_file_block);
			}
		});
		
		$(".js-add-load-file").on("click", function()
		{
			var load_file_list = $(this).parents(".load-files").find(".load-file-list");
			var new_load_file = load_file_list.find(".load-file:first").clone();
			
			new_load_file.appendTo(load_file_list);
			clearLoadFileItem(new_load_file);
		});
		
		function clearLoadFileItem(loadFileItemBlock)
		{
			loadFileItemBlock.find(".js-upload-file").val('');
			loadFileItemBlock.removeClass("is-uploaded");
			loadFileItemBlock.find('.uploaded-file-name__val').html('');
			loadFileItemBlock.find('.uploaded-file-info').text('');
		}
		
		function fileSize(bytes) 
		{
			var thresh = 1024;
			
			if (Math.abs(bytes) < thresh) {
				return bytes + ' B';
			}
			
			var units = ['Кб', 'Мб', 'Гб', 'Тб', 'Пб'];
			var u = -1;
			do {
				bytes /= thresh;
				++u;
			} while (Math.abs(bytes) >= thresh && u < units.length - 1);
			
			return bytes.toFixed(1) + ' ' + units[u];
		}
	}

	// SHOW POPUP
	function showPopup()
	{
		$("body").on("click", ".js-show-popup", function()
		{
			var show_popup_item = $(this).data("popup");
			
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
			
			if($(".js-fullpage").length && isInitFullpage)
				$.fn.fullpage.setAllowScrolling(true);

			setTimeout(function(){
				active_popup.hide();
			}, 450);
		});
	}


	// CONFIGURATE INDEX MOBILE HEADER
	function configurateMainPageMobileHeader()
	{
		if ($("#main-page-header").length === 0)
			return false;

		var main_page_header = $("#main-page-header");

		configureMobileHeader();

		$(window).on("scroll", function()
		{
			configureMobileHeader();
		});

		function configureMobileHeader()
		{
			var fixed_point = main_page_header.innerHeight();

			if ($(window).scrollTop() >= fixed_point)
				main_page_header.addClass("is-mobile-white-bg");
			else
				main_page_header.removeClass("is-mobile-white-bg");
		}
	}
	
	
	

/* //////////////////////////////////////////// INDEX ///////////////////////////////////////////// */
	

	// INIT FULLPAGE
	function initFullpage()
	{
		if ($(".js-fullpage").length === 0)
			return false;
		
		configurateFullPage();

		$(document).on("isWindowResizeWidth", function()
		{
			configurateFullPage();
		});

		function configurateFullPage()
		{
			if ($(window).width() < 768)
			{
				if (isInitFullpage){
					$.fn.fullpage.destroy('all');
					isInitFullpage = false;
				}
			}
			else
			{
				if (isInitFullpage === false)
				{
					$('.js-fullpage').fullpage({
						//Navigation
						menu: '#fullpage-menu',
						lockAnchors: false,
						anchors:[],
						navigation: true,
						navigationPosition: 'left',
						navigationTooltips: [],
						showActiveTooltip: false,
						slidesNavigation: false,
						slidesNavPosition: 'bottom',

						//Scrolling
						css3: true,
						scrollingSpeed: 1000,
						autoScrolling: true,
						fitToSection: true,
						fitToSectionDelay: 300,
						easing: 'easeInOutCubic',
						easingcss3: 'ease',
						loopBottom: false,
						loopTop: false,
						loopHorizontal: true,
						continuousVertical: false,
						continuousHorizontal: false,
						scrollHorizontally: false,
						interlockedSlides: false,
						dragAndMove: false,
						offsetSections: false,
						resetSliders: false,
						fadingEffect: false,
						normalScrollElements: '',
						scrollOverflow: false,
						scrollOverflowReset: false,
						scrollOverflowOptions: {disablePointer: true},
						touchSensitivity: 15,
						normalScrollElementTouchThreshold: 5,
						bigSectionsDestination: null,

						//Accessibility
						keyboardScrolling: true,
						animateAnchor: true,
						recordHistory: true,

						//Design
						controlArrows: true,
						verticalCentered: true,
						sectionsColor : [],
						paddingTop: '0px',
						paddingBottom: '0px',
						fixedElements: '',
						responsiveWidth: 0,
						responsiveHeight: 0,
						responsiveSlides: false,
						parallax: false,
						parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},

						//Custom selectors
						sectionSelector: '.fullpage-section',
						slideSelector: '.fullpage-slide',

						lazyLoading: true,

						onLeave: function(index, nextIndex, direction)
						{
							// SWITCH MAIN PAGE SECTIONS STYLES
							if (direction == "down")
							{
								if ($(this).next().is("._white-bg"))
									$("html").addClass("is-active-main-section-white");
								else
									$("html").removeClass("is-active-main-section-white");

								// ANIMATE ELEMENTS
								$(this).next().addClass("is-animate");
							}
							
							if (direction == "up"){
								if ($(this).prev().is("._white-bg"))
									$("html").addClass("is-active-main-section-white");
								else
									$("html").removeClass("is-active-main-section-white");

								// ANIMATE ELEMENTS
								$(this).prev().addClass("is-animate");
							}
						},
						afterLoad: function(anchorLink, index)
						{
							// SWITCH MAIN PAGE SECTIONS STYLES
							if ($(this).is("._white-bg"))
								$("html").addClass("is-active-main-section-white");
							else
								$("html").removeClass("is-active-main-section-white");

							// ANIMATE ELEMENTS
							$(this).addClass("is-animate");

							// SHOW / HIDE NAV BTN
							if (index === 1)
								$(".fp-nav-btn._prev").addClass("_hide");
							else
								$(".fp-nav-btn._prev").removeClass("_hide");
														
							if (index === $(".fullpage-section").length)
								$(".fp-nav-btn._next").addClass("_hide");
							else
								$(".fp-nav-btn._next").removeClass("_hide");

							// MAIN POMO VIDEO
							var main_promo_video = $("#main-promo-video");

							if (main_promo_video.length)
							{
								if ($(this).find(main_promo_video).length)
								{
									main_promo_video.get(0).play();
								}
								else
								{
									main_promo_video.get(0).pause();
								}
							}							
						},
						afterRender: function(){},
						afterResize: function(){},
						afterResponsive: function(isResponsive){},
						afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
						onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
					});

					isInitFullpage = true;

					if ($("#fp-nav").length)
					{
						var fp_nav_height = $("#fp-nav").height();  

						$('<button type="button" class="fp-nav-btn _prev icon-arrow-t js-fullpage-goto-prev-section" />').css("marginTop", -fp_nav_height/2).appendTo("body");
						$('<button type="button" class="fp-nav-btn _next icon-arrow-b js-fullpage-goto-next-section" />').css("marginTop", fp_nav_height/2).appendTo("body");	
					}
				}
			}
		}

		$(document).on("click", ".js-fullpage-goto-prev-section", function(){
			$.fn.fullpage.moveSectionUp();
		});

		$(document).on("click", ".js-fullpage-goto-next-section", function(){
			$.fn.fullpage.moveSectionDown();
		});
	}


	// INIT TEAM SLIDER
	function initTeamSlider()
	{
		if ($('.js-team-slider').length === 0)
			return false;

		var slidesPerScroll = 5,
				carouselWidth = 800,
				carouselHeight = 300,
				backZoom = 0.75;

		if ($(window).width() <= 1024 && $(window).width() > 767){
			slidesPerScroll = 3;
			carouselWidth = 600;
		}

		if ($(window).width() <= 767){
			slidesPerScroll = 3;
			carouselWidth = 290;
			carouselHeight = 170;
			backZoom = 0.55;
		}

		$(".js-team-slider").carousel({
			autoplay: false, 
			slidesPerScroll: slidesPerScroll,
			hMargin: 0.6,
			vMargin: 0.6,
			backZoom: backZoom,
			frontWidth: carouselHeight,
			frontHeight: carouselHeight,
			carouselWidth: carouselWidth,
			carouselHeight: carouselHeight,
			directionNav: true,
			mouse: false,
			before: function(carousel, currentSlideIndex) {},
     	after: function(carousel, currentSlideIndex) {
     		var team_slider_block = $(".team-slider");
				var show_team_item_info = team_slider_block.find('.team-slider-info__item[data-team-item="'+(currentSlideIndex+1)+'"]');

				team_slider_block.find(".team-slider-info__item.is-show").hide().removeClass("is-show");
				show_team_item_info.stop().fadeIn(400, function(){
					$(this).addClass("is-show");
				});
			}
		});

		if (Modernizr.touchevents)
		{
			$('.team-slider').swipe({
				excludedElements: "",
				swipeLeft: function (event, direction, distance, duration, fingerCount)
				{
					$(this).find(".nextButton").click();
				},
				swipeRight: function (event, direction, distance, duration, fingerCount)
				{
					$(this).find(".prevButton").click();
				}
			});
		}
	}
	

	// INIT PROMO SLIDER
	function initFaqSlider()
	{
		if ($(".js-faq-slider").length === 0)
			return false;
		
		$(".js-faq-slider").slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			dots: true,
			touchMove: false,
			centerMode: true, 
			centerPadding: '0',
			infinite: false,
			variableWidth: true,
			prevArrow: '<div class="slick-prev"></div>',
			nextArrow: '<div class="slick-next"></div>',
			responsive: [
				{
					breakpoint: 768,
					settings: {
						centerMode: false, 
						variableWidth: true,
						slidesToShow: 2,
						infinite: true,
					}
				}
			]
		});
	}


	// ANIMATE MAIN PAGE FIRST SCREEN
	function animateMainPageFirstScreen()
	{
		if ($("#main-promo").length === 0)
			return false;
			
		$("html").addClass("is-animate-main-page-onload");
	}




/* //////////////////////////////////////////// CLUB ///////////////////////////////////////////// */
	
	// INIT CLUB LIST
	function initClubList()
	{
		if ($(".js-club-list").length === 0)
			return false;

		$(".js-club-list").masonry({
			itemSelector: '.club__list-item'
		});	
	}



/* //////////////////////////////////////////// TEST RESULTS ///////////////////////////////////////////// */
		
	// SHOW TEST RESULT
	function showTestResult()
	{
		if ($(".js-show-test-result").length === 0)
			return false;

		$(".js-show-test-result").on("click", function()
		{
			var test_result_list = $(this).parents(".test-results__list"),  
					test_result_item = $(this).parents(".test-results__item"),
					test_result_item_number = test_result_item.attr("data-test-result");


			if (test_result_item.is(".is-show"))
			{
				test_result_item.find(".test-results__item-content").stop().slideUp(300, function(){
					test_result_item.removeClass("is-show");

					$(".test-results__number.is-active").removeClass("is-active is-hover");
				});
			}
			else
			{
				var cur_active_test_result = test_result_list.find(".test-results__item.is-show");

				cur_active_test_result.find(".test-results__item-content").stop().slideUp(300, function(){
					cur_active_test_result.removeClass("is-show");
				});

				test_result_item.find(".test-results__item-content").stop().slideDown(300, function(){
					test_result_item.addClass("is-show");
					
					$(".test-results__number.is-active").removeClass("is-active");
					$('.test-results__number[data-test-result="'+ test_result_item_number +'"]').addClass("is-active");
				});
			}
		});

		$(".js-show-test-result").hover(
			function(){
				var test_result_item_number = $(this).parents(".test-results__item").attr("data-test-result");
				$('.test-results__number[data-test-result="'+ test_result_item_number +'"]').addClass("is-hover");
			}, 
			function(){
				var test_result_item_number = $(this).parents(".test-results__item").attr("data-test-result");
				$('.test-results__number[data-test-result="'+ test_result_item_number +'"]').removeClass("is-hover");
			});
	}
	

