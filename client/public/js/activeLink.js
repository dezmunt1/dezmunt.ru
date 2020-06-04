

function navigationAddClass() {
  const list = document.querySelectorAll('.navigation-list--item');
  
  if ( list.length ===  0 ) return;
  list.forEach( item => {
    item.addEventListener("click", function(event) {
      this.classList.add('active');
    });
  });
}
navigationAddClass();

