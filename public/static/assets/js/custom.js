var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && iOS) {
	document.querySelector('body').classList.add('safari');
	document.querySelector('body').classList.add('ios');
} else if (isSafari) {
	document.querySelector('body').classList.add('safari');
}

$(document).ready(function () {
	$('body').on('click', function () {
		$('.off-canvas').removeClass('show');
	});
	$('.open-chat-nav').on('click', function (e) {
		e.stopPropagation();
		var target = $(this).attr('href');
		$(target).addClass('show');
	});
	$('.close-sidenav').on('click', function (e) {
		e.preventDefault();
		$(this).closest('.off-canvas').removeClass('show');
	});
	$('body').on('click', '.off-canvas', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		return false;
	});

	//Drag tabble
	var elementScroll = document.querySelectorAll('.table-responsive');

	if (elementScroll != undefined || elementScroll != null) {
		elementScroll.forEach(function (element) {
			var mx = 0;
			element.addEventListener('mousedown', function (e) {
				this.sx = this.scrollLeft;
				mx = e.pageX - this.offsetLeft;

				this.addEventListener('mousemove', mouseMoveFunction);
			});
			element.addEventListener('mouseup', function (e) {
				this.removeEventListener('mousemove', mouseMoveFunction);
				mx = 0;
			});

			function mouseMoveFunction(e) {
				var mx2 = e.pageX - this.offsetLeft;
				if (mx) this.scrollLeft = this.sx + mx - mx2;
			}
		});
	}

	//detail info
	$('body').on('click', '.edit-mode', function (e) {
		e.preventDefault();
		$($(this).attr('data-target')).addClass('show');
		$('.detail-fixed').animate({ scrollTop: 0 }, 'fast');
	});
	$('body').on('click', '.close-editmode,.bg-overlay', function (e) {
		$(this).parents('.detail-fixed').removeClass('show');
	});

	// Fix table head
	function tableFixHead(e) {
		const el = e.target,
			sT = el.scrollTop - 1;
		el.querySelectorAll('thead th').forEach(
			(th) => (th.style.transform = `translateY(${sT}px)`),
		);
	}
	document
		.querySelectorAll('.tableFixHead')
		.forEach((el) => el.addEventListener('scroll', tableFixHead));
	//Select2 in modal

	$('.select2').each(function () {
		let $this = $(this);
		let $parent = $(this).closest('.modal');
		if ($parent.length > 0) {
			$this.select2({
				dropdownParent: $parent.find('.modal-body'),
			});
		} else {
			$this.select2();
		}
	});

	$('#scroll-to-top').on('click', function () {
		$('html,body').animate(
			{
				scrollTop: 0,
			},
			1000,
		);
	});

	$('.datetimepicker').flatpickr({
		dateFormat: 'd/m/Y',
		onOpen: function (selectedDates, dateStr, instance) {
			let element = instance.element;
			if (!this.element.classList.contains('to-date')) return;
			let minDate = $(element)
				.closest('.from-to-group')
				.find('.from-date')
				.val();

			!!minDate &&
				minDate != '' &&
				instance.set(
					'minDate',
					new Date(minDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')),
				);
		},
		onValueUpdate: function (selectedDates, dateStr, instance) {
			this.element.setAttribute('value', dateStr);
		},
	});

	$('body')
		.on('show.bs.dropdown', '.table-responsive', function () {
			$(this).css('overflow', 'visible');
		})
		.on('hide.bs.dropdown', '.table-responsive', function () {
			$(this).css('overflow', 'auto');
		});

	//sticky tinymce
	const replaceInputType = (type, value) => {
		switch (type) {
			case 'currency': {
				let regx = /\D+/g;
				let number = value.replace(regx, '');
				return number.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
				break;
			}
			case 'number': {
				return value.replace(/[^0-9]/, '');
				break;
			}
		}
	};
	$('body').on(
		'input',
		'[data-type="number"],[data-type="currency"]',
		function () {
			console.log('haha');
			let value = replaceInputType($(this).attr('data-type'), $(this).val());
			$(this).val(value);
		},
	);
	const btnToggleMenu = document.getElementById('js-burger-menu');
	const bodyToggleMenu = document.getElementsByTagName('body')[0];
	const toggleMobileMenu = (e) => {
		e.preventDefault();
		btnToggleMenu.classList.toggle('active');
		bodyToggleMenu.classList.toggle('menu-open');
	};
	const menuOverlay = document.querySelector('.menu-overlay');
	if (menuOverlay) {
		menuOverlay.addEventListener('click', toggleMobileMenu);
		btnToggleMenu.addEventListener('click', toggleMobileMenu);
	}

	$('.toggle-sidebar').on('click', function () {
		$('#js-component-profilesidebar').addClass('active');
		$('.sidebar-overlay').css(
			'left',
			$('#js-component-profilesidebar').innerWidth() + 'px',
		);
	});
	$(document).on('click', '.sidebar-overlay', function () {
		$('#js-component-profilesidebar').removeClass('active');
		$(this).css('left', '-100%');
	});

	/* $(window).scroll(function() {
        if (window.innerWidth >= 992) {
            if ($(window).scrollTop() > 0)
                $("#js-component-profilesidebar").addClass('fixed')
            else
                $("#js-component-profilesidebar").removeClass('fixed')
        }
        if ($(window).scrollTop() > $("header.navbar-header").innerHeight()) {
            $("header.navbar-header").addClass("navbar-header-fixed")
        }
    })

    $(window).resize(function () {
        if (window.innerWidth < 992) {
            $("#js-component-profilesidebar").removeClass('fixed')
        }
    }); */
});
