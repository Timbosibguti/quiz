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
	let showcase = '.js-quizz-showcase';
	let showcaseContainer = '.js-quizz-showcase-container';
	let showcasePattern = '.js-quizz-showcase-pattern';
	let showcaseImg2 = '.js-quizz-showcase-img2';
	let steps = $('#calcStepperInner > div').length;
	let StepperNavItemClassName = 'js-calc-stepper';

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

	function inputChecker() {
		$inputCurrentStepper = $(stepTab).eq(stepIndex).find('input[type="radio"]:visible').not('input[name="tabs-0"]');
		$checkedInputCurrentStepper = $inputCurrentStepper.filter(':checked');
		console.log($checkedInputCurrentStepper.length)
		controls();
	}

	function controls() {
		if ($inputCurrentStepper.length > 0 && $checkedInputCurrentStepper.length < 2) {
			$(btnNext).attr('disabled', 'disabled');
		} else {
			$(btnNext).removeAttr('disabled');
		}
	}

	function switchToTab(nextStepIndex) {
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
			stepIndex = $(this).closest(stepTab).index();
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

		inputChecker();
	});
	$('.js-quizz-form').on('submit', function(e) {
		e.preventDefault();
		let $self = $(this);
		let formTitle = $self.data('form-title');
		let $submitBtn = $self.find('[type="submit"]');
		let data = $self.serialize() + '&title=' + encodeURIComponent(formTitle);
		let stateBtnText = [$submitBtn.html(), 'Отправляем', 'Отправлено'];

		$self.find(`input`).removeClass('input-error');

		$.ajax({
			
			beforeSend: function() {
				$submitBtn.attr('disabled', 'disabled').html(stateBtnText[1]);
			},
			complete: function() {
			}
		}).done(function(response) {
			if (response['error']) {
				for (let i in response['error']) {
					$self.find(`input[name="${i}"]`).effect('shake', shakeUiConfig);
				}
			} else {
				$self.hide();
				$('#calcStepEnd').fadeIn();
			}

			setTimeout(() => {
				if (response['error'] || response['status'] !== 'send') {
					$submitBtn.removeAttr('disabled').html(stateBtnText[0]);
				} else {
					$submitBtn.removeClass('flashed').addClass('btn--success').html(stateBtnText[2]);
				}
			}, 300);
		}).always(function() {

		});
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

	function controls() {
		if($inputCurrentStepper.length > 0 && $checkedInputCurrentStepper.length < 1) {
			$(btnNext).attr('disabled', 'disabled');
		} else {
			$(btnNext).removeAttr('disabled');
		}
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