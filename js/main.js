$(document).ready(function() {
  setTimeout(function() {
    firstQuestion();
    $('.spinner').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
    $('body').delay(350).css({'overflow':'visible'});
  }, 600);
});

function init() {
  document.getElementById('titleWeb').innerHTML = CONFIG.titleWeb;
  $('#title').text(CONFIG.title);
  $('#desc').text(CONFIG.desc);
  $('#yes').text(CONFIG.btnYes);
  $('#no').text(CONFIG.btnNo);

  var isMobile = $(window).width() < 769;
  
  // Wait for text to render before positioning
  setTimeout(function() {
    if (isMobile) {
      // Mobile: buttons inside content flow, just centered
      $('#yes').add('#no').css({
        position: 'relative', 
        left: 'auto', 
        top: 'auto',
        display: 'inline-block',
        margin: '20px 10px'
      });
    } else {
      // Desktop: position absolutely below content box
      var yesBtn = $('#yes');
      var noBtn = $('#no');
      var gap = 30;
      var yesBtnWidth = yesBtn.outerWidth();
      var noBtnWidth = noBtn.outerWidth();
      var totalWidth = yesBtnWidth + noBtnWidth + gap;
      var contentWidth = $('.content').outerWidth();
      
      // Center relative to content box
      var contentLeft = $('.content').offset().left;
      var centerX = contentLeft + (contentWidth - totalWidth) / 2;
      var contentBottom = $('.content').offset().top + $('.content').outerHeight() + 30;
      
      yesBtn.css({
        position: 'absolute',
        left: centerX + 'px',
        top: contentBottom + 'px'
      });
      noBtn.css({
        position: 'absolute',
        left: (centerX + yesBtnWidth + gap) + 'px',
        top: contentBottom + 'px'
      });
    }
    
    setupButtonHandlers();
  }, 50);
}

function firstQuestion() {
  $('.content').hide();
  Swal.fire({
    title: CONFIG.introTitle,
    text: CONFIG.introDesc,
    imageUrl: 'img/logi.gif',
    imageWidth: 280,
    imageHeight: 280,
    imageAlt: 'Cute intro image',
    confirmButtonText: CONFIG.btnIntro,
    backdrop: 'rgba(0,0,0,.15)',
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'swal2-cute'
    }
  }).then((result) => {
    console.log('Modal dismissed, result:', result);
    if (result.isConfirmed) {
      console.log('Confirmed - hiding modal');
      // Force hide all Swal elements
      document.querySelector('.swal2-container').style.display = 'none';
      document.body.classList.remove('swal2-shown');
      document.body.style.overflow = 'auto';
      
      setTimeout(() => {
        $('.content').fadeIn(500);
        setTimeout(() => {
          console.log('Initializing buttons');
          init();
          var audio = new Audio('sound/mysong.mp3');
          audio.volume = 0.8;
          audio.play().catch(function(){});
        }, 200);
      }, 100);
    }
  }).catch((error) => {
    console.error('Swal error:', error);
  });
}

function setupButtonHandlers() {
  var n = 0;
  var soundPlayed = false;
  var isMobile = $(window).width() < 769;
  
  $('#no').off('mousemove mouseover mouseenter touchstart click').on('mousemove mouseover mouseenter touchstart click', function(e) {
    e.preventDefault();
    if (!soundPlayed) {
      if (isMobile) {
        // Mobile: just play sound, no moving
        var audio = new Audio('sound/tick.mp3');
        audio.play();
      } else {
        // Desktop: move or switch
        if (Math.random() < 0.5 || n == 1) switchButton();
        else moveButton();
      }
      soundPlayed = true;
    }
    n++;
    return false;
  });
  
  $(document).on('mouseleave', '#no', function() {
    soundPlayed = false;
  });

  $('#yes').off('click').on('click', function() {
    var audio = new Audio('sound/tick.mp3');
    audio.play();
    Swal.fire({
      title: CONFIG.question,
      width: 900,
      padding: '2.25em',
      html: "<input type='text' class='form-control' id='txtReason' onmousemove='textGenerate()' placeholder='Whyyy'>",
      background: 'transparent',
      backdrop: 'rgba(0,0,0,.25)',
      confirmButtonText: CONFIG.btnReply,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value || result.isConfirmed) {
        Swal.fire({
          width: 900,
          confirmButtonText: CONFIG.btnAccept,
          title: CONFIG.mess,
          text: CONFIG.messDesc,
          background: 'transparent',
          backdrop: 'rgba(0,0,0,.25)',
          allowOutsideClick: false,
          onClose: () => { window.location = CONFIG.messLink; }
        });
      }
    });
  });
}

// switch button position
function switchButton() {
  var audio = new Audio('sound/duck.mp3');
  audio.volume = 0.3;
  audio.play();
  var leftNo = $('#no').css('left');
  var topNO = $('#no').css('top');
  var leftY = $('#yes').css('left');
  var topY = $('#yes').css('top');
  $('#no').css({left: leftY, top: topY});
  // Don't move yes button - keep it in place
}

// move random button position
function moveButton() {
  var audio = new Audio('sound/swish.mp3');
  audio.play();
  
  var isMobile = $(window).width() < 769;
  
  if (isMobile) {
    // On mobile, don't move - just provide feedback
    return;
  }
  
  // Desktop: move around freely, but stay within viewport
  var $no = $('#no');
  var buttonWidth = $no.outerWidth();
  var buttonHeight = $no.outerHeight();
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  
  var maxX = Math.max(0, windowWidth - buttonWidth - 20);
  var maxY = Math.max(0, windowHeight - buttonHeight - 20);
  
  var x = Math.random() * maxX;
  var y = Math.random() * maxY;
  
  $no.css({left: x + 'px', top: y + 'px'});
}

// auto-type helper
function textGenerate() {
  var n = '';
  var text = ' ' + CONFIG.reply;
  var a = Array.from(text);
  var textVal = $('#txtReason').val() ? $('#txtReason').val() : '';
  var count = textVal.length;
  if (count > 0) {
    for (let i = 1; i <= count; i++) {
      n = n + a[i];
      if (i == text.length + 1) {
        $('#txtReason').val('');
        n = '';
        break;
      }
    }
  }
  $('#txtReason').val(n);
  setTimeout(textGenerate, 1);
}
