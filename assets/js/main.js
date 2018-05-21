document.addEventListener('DOMContentLoaded', function () {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});
   
var scrollTo = function (to, duration) {
    var element = document.scrollingElement || document.documentElement,
      start = element.scrollTop,
      change = to - start,
      startDate = +new Date(),
      easeInOutQuad = function (t, b, c, d) {
          t /= d/2;
          if (t < 1) return c/2*t*t + b;
          t--;
          return -c/2 * (t*(t-2) - 1) + b;
      },
      animateScroll = function () {
          var currentDate = +new Date();
          var currentTime = currentDate - startDate;
          element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
          if(currentTime < duration) {
              requestAnimationFrame(animateScroll);
          } else {
              element.scrollTop = to;
          }
      };
    animateScroll();
};

var $seeMore = document.getElementById('see-more')
var seeMoreScroll = function () {
  var scrollTop = window.pageYOffset || document.scrollTop || 0;
  console.log(scrollTop, $seeMore.offsetTop)
  scrollTo($seeMore.offsetTop + $seeMore.style.height, 1250);
}
$seeMore.addEventListener('click', seeMoreScroll)
document.addEventListener('scroll', function () {
  var halfViewport = window.innerHeight / 2 * 0.67;
  var scrollTop = window.pageYOffset || document.scrollTop || 0;

  if (halfViewport < scrollTop) {
    $seeMore.removeEventListener('click', seeMoreScroll)
    $seeMore.style.opacity = '0';
  } else {
    $seeMore.removeEventListener('click', seeMoreScroll)
    $seeMore.addEventListener('click', seeMoreScroll)
    $seeMore.style.opacity = '' + ((halfViewport - scrollTop) / halfViewport);
  }
  
})

var modals = new Modals()
document.querySelector('#modal-login')
  .addEventListener('sot#modal-close', function (e) {
    var forms = e.target.querySelectorAll('form')
    forms.forEach(function (form) {
      form.reset()
    })
  })