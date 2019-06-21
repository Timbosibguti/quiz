$(function() {
	let intro = '.js-quizz-intro';
	let btnIntro = '.js-start-quizz';
	let form = '.js-quizz-form';
	let input = $(form).find('input');
	let btnNext = '.js-quizz-btn-next';
	let stepIndex = 0;
	let stepTab = '.js-quizz-tab';
	let pattern = '.js-quizz-pattern';
	let stepListItemClassname = 'js-quizz-step';
	let stepList = '.js-quizz-steps';
	let stepListItem = `.${stepListItemClassname}`;
	let stateActiveClassName = 'active';
	let stateCompletedClassName = 'completed';
	let $inputCurrentStepper = '';
	let $checkedInputCurrentStepper = '';
	let $textInputCurrentStepper = '';
	let $checkedTextInputCurrentStepper = '';
	let showcase = '.js-quizz-showcase';
	let showcaseContainer = '.js-quizz-showcase-container';
	let showcasePattern = '.js-quizz-showcase-pattern';
	let showcaseImg2 = '.js-quizz-showcase-img2';
	let steps = $('#calcStepperInner > div').length;
	let StepperNavItemClassName = 'js-calc-stepper';
	let closePopup = '.js-close-popup';
	let placeInput = ".place-input";
	$(form).on('submit', function(){
		$('#tabs-0-0').prop('disabled', true);
		$('#tabs-0-1').prop('disabled', true);

	});

	$(btnIntro).on('click', function() {
		$(intro).hide();
		$(form).fadeIn();
		$(stepList).html();

		for (let i = 0; i < $(stepTab).length; i++) {
			$(stepList).append(`<li class="${stepListItemClassname}"></li>`);
		}

		switchToTab(stepIndex);
	});

	/* Navigate through stepper by clicking list-item if this stepper has been already completed */
	$(document).on('click', `${stepListItem}`, function() {
		if ($(this).hasClass(stateCompletedClassName)) {
			let nextStepIndex = $(this).index();

			if (nextStepIndex !== stepIndex) {
				switchToTab(nextStepIndex);
			}
		}
	});
	
	$(btnNext).on('click', function() {
		let nextStepIndex = stepIndex + 1;

		if (nextStepIndex < $(stepTab).length) {
			switchToTab(nextStepIndex);
			if (nextStepIndex + 1 >= $(stepTab).length) {
				$(btnNext).hide();
				$(stepList).hide();
			}
		}

	});
	$(closePopup).on('click', function(){
		ym(YANDEX_METRIKA_ID, 'opros_step' + (nextStepIndex), 'opros');
		console.log('opros_step' + (nextStepIndex));
		$("#phone").removeAttr("disabled");
		$(".js-popup-phone").attr("disabled","disabled");
		$(".popup").hide();
		var nextStepIndex=$(stepTab).length-1;
		// Tab
		$(stepTab).eq(nextStepIndex).fadeIn();
	})
	$(placeInput).on('input',function(){
	  inputChecker();
	})
	
	 
	function inputChecker() {
		$inputCurrentStepper = $(stepTab).eq(stepIndex).find('input[type="radio"]:visible').not('input[name="tabs-0"]');
		$checkedInputCurrentStepper = $inputCurrentStepper.filter(':checked');
		
		$textInputCurrentStepper = $(stepTab).eq(stepIndex).find('.place-input');
		$textInputCurrentStepper.each(function() {
  			$(this).attr('value', $(this).val())
		});
		$checkedTextInputCurrentStepper = $textInputCurrentStepper.filter(':not([value=\'\'])');
		controls();
	}

	function controls() {
		console.log("1", $inputCurrentStepper.length > 0 && $checkedInputCurrentStepper.length < 1)
		console.log("2", $checkedTextInputCurrentStepper.length)
		if ($inputCurrentStepper.length > 0 && $checkedInputCurrentStepper.length < 1 || $textInputCurrentStepper.length > 0 && $checkedTextInputCurrentStepper.length < 2) {
			$(btnNext).attr('disabled', 'disabled');
		} else {
			$(btnNext).removeAttr('disabled');
		}
	}
	function popup(){
		$("#phone").attr("disabled","disabled");
		$(".js-quizz-tabs").hide();
		$(".popup").fadeIn();
	}
	function switchToTab(nextStepIndex) {
		if (nextStepIndex == $(stepTab).length-1){
			popup();
			return;
		}
		if (nextStepIndex > 0){
			ym(YANDEX_METRIKA_ID, 'opros_step' + (nextStepIndex), 'opros');
			console.log('opros_step' + (nextStepIndex));
		}
		// Tab
		$(stepTab).eq(stepIndex).hide();
		$(stepTab).eq(nextStepIndex).show();

		// Nav
		if (nextStepIndex !== stepIndex) {
			$(stepListItem).eq(stepIndex).removeClass(stateActiveClassName).addClass(stateCompletedClassName);
		}
		$(stepListItem).eq(nextStepIndex).addClass(stateActiveClassName);

		// Showcase
		$(showcase).appendTo($(stepTab).eq(nextStepIndex).find(showcaseContainer));
		stepIndex = nextStepIndex;

		inputChecker();

	}

	$(input).on('change', function() {
		let self = this;
		let $self = $(self);
		let inputName = $(this).attr('name');
		let inputValue = self.value;

		if (inputName === 'product') {
			for (let i = stepIndex; i < $(stepTab).length; i++) {
				$(stepListItem).eq(i).removeClass(stateCompletedClassName);
			}
			$(pattern).hide().filter(`[data-product="${inputValue}"]`).show();
		} else if (inputName === 'pattern') {
			let image = '';

			for (let i = 0; i < 40; i++) {
				image += `<svg width="100" height="100"><use xlink:href="#${inputValue}"></use></svg>`;
			}

			$(showcaseImg2).hide();
			$(showcasePattern).html(`${image}`);
		} else if (inputName === 'color1') {
			$('#quizz .user-color-1').css('fill', `${inputValue}`);
		} else if (inputName === 'color2') {
			$('#quizz .user-color-2').css('fill', `${inputValue}`);
		}
		else if (inputName === 'Sposob-svyazi') {
			$('.js-end-data').slideDown();
		}

		inputChecker();
	});



	$('#calcResetForm').on('click', function() {
		location.reload();
	});


	function labelSelection() {
		/**
		 * Just toggling label's state
		 */
		let label = '.js-label-selection';
		let input = '.js-label-selection input';
		let state = 'active';
		let filterAttr = 'name';

		$(document).on('change', input, function() {
			let prop = $(this).attr(filterAttr);

					$(this).closest('li').find('.js-color-name').html($(this).attr('data-color-name'));

			$(`${input}[${filterAttr}="${prop}"]`).each(function() {
				if (this.checked) {
					$(this).closest(label).addClass(state);
				} else {
					$(this).closest(label).removeClass(state);
				}
			})
		});
	}
	function slider() {
		let min = 30;
		let max = 600;
		let value = min;
		
		$('#calcStepperSurface').on('input', function() {
			value = this.value;
	
			if(value > max) {
				value = max;
			}
	
			if(value < min) {
				value = min;
			}
	
			this.value = value;
	
			$('#calcStepperSlider').slider('value', value);
		});
	
		$('#calcStepperSlider').slider({
			range: 'min',
			value: value,
			min: min,
			max: max,
			create: function() {
				$('#calcStepperSurface').val( min );
			},
			slide: function( event, ui ) {
				$('#calcStepperSurface').val( ui.value );
			}
		});
	}

	function monitorCurrentStepper() {
		$inputCurrentStepper = $('#calcStepperInner > .active').find('input[type="radio"]:visible');
		$checkedInputCurrentStepper = $inputCurrentStepper.filter(':checked');
		controls();
	}

	function stepperInit() {
		for(let i = 0; i < steps; i++) {
			$('#calcStepperList').append(`<li class="${StepperNavItemClassName}"></li>`);
		}

		$('#calcStepperInner').css('margin-bottom', 0);
		
		slider();
	}

	stepperInit();
	labelSelection();
	$(".js-quizz-form").trigger('reset');




var supportTouch = $.support.touch,
        scrollEvent = "touchmove scroll",
 		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
 
    // handles swipe up and swipe down
    $.event.special.swipeupdown = {
        setup: function () {
            var thisObject = this;
            var $this = $(thisObject);
 
            $this.bind(touchStartEvent, function (event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ],
                        origin: $(event.target)
                    },
                    stop;
 
                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
 
                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };
 
                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
 
                $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function (event) {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if (start && stop) {
                            if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
            });
        }
    };
 
//Adds the events to the jQuery events special collection
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function (event, sourceEvent) {
        $.event.special[event] = {
            setup: function () {
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });
  $('.js-quizz-showcase').on('click', function(){
  		$('.js-quizz-showcase').toggleClass('quizz__showcase__open')
  });
 $(document).on('swipedown',function(){

 	$('.js-quizz-showcase').addClass('quizz__showcase__open')

} );
  $(document).on('swipeup',function(){

  	$('.js-quizz-showcase').removeClass('quizz__showcase__open')
} );
});


  	



!function (a){
	function f(a , b){
		if(!(a.originalEvent.touches.length>1)){
			a.preventDefault();
		var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");
		d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)
		}
	}
		if(a.support.touch = "ontouchend" in document, a.support.touch){
		var e,b=a.ui.mouse.prototype, c = b._mouseInit, d = b._mouseDestroy;
			b._touchStart = function(a){
			var b = this;
			!e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, "mouseover"), f(a, "mousemove"), f(a, "mousedown"))
		}, b._touchMove=function(a){
			e && (this._touchMoved = !0, f(a, "mousemove"))},
				b._touchEnd = function(a){ 
					e&&(f(a, "mouseup"), f(a, "mouseout"), this._touchMoved || f(a, "click"), e = !1)},
				b._mouseInit = function(){
					var b = this; 
					b.element.bind({
						touchstart:a.proxy(b, "_touchStart"), touchmove:a.proxy(b, "_touchMove"), touchend:a.proxy(b, "_touchEnd")}), c.call(b)},
					b._mouseDestroy=function()
{
	var b=this;
	b.element.unbind({touchstart:a.proxy(b, "_touchStart"), touchmove:a.proxy(b, "_touchMove"), touchend:a.proxy(b, "_touchEnd")}),
	d.call(b)}}}(jQuery);






