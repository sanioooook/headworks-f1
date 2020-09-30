document.addEventListener("DOMContentLoaded", function () {
  // this function runs when the DOM is ready, i.e. when the document has been parsed
  document.getElementsByClassName('menu-toggle')[0].children[0].addEventListener('change', openBar);
  // all js code should go below this line
});

function openBar() {
  let content = document.getElementsByClassName('content')[0];
  if (document.getElementsByClassName('menu-toggle')[0].children[0].checked) {
    document.getElementsByClassName('nav-links')[0].style.transform = 'none';
    content.style.opacity = .38;
    content.style.background = '#333333';
  }
  else {
    document.getElementsByClassName('nav-links')[0].style.transform = 'translate(0,-200%)';
    content.style.opacity = 1;
    content.style.background = 'none';
  }
}
