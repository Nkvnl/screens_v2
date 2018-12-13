// alert('connected')

$(document).ready(function() {
        // Transition effect for navbar 
        $(window).scroll(function() {
          // checks if window is scrolled more than 500px, adds/removes solid class
          if($(this).scrollTop() > 200) { 
              $('.navbar').addClass('solid');
              $('.hideOnScroll').addClass('hidden');
              $('.nav-links').addClass('dark');
          } else {
              $('.navbar').removeClass('solid');
              $('.navbar a').removeClass('navbar-light');
              $('.hideOnScroll').removeClass('hidden');
              $('.nav-links').removeClass('dark');
          }
        });
});