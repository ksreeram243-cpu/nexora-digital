(function () {
  var pop = document.getElementById('pop');
  if (pop) {
    var seen = false;
    try { seen = !!sessionStorage.getItem('nxPop'); } catch (e) {}
    var open = function () {
      if (seen) return;
      seen = true;
      pop.classList.add('show');
      try { sessionStorage.setItem('nxPop', '1'); } catch (e) {}
      window.removeEventListener('scroll', onScroll);
    };
    var close = function () { pop.classList.remove('show'); };
    var onScroll = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.35) open();
    };
    window.addEventListener('scroll', onScroll);
    document.getElementById('popx').onclick = close;
    document.getElementById('poplater').onclick = close;
    pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = 'Name: ' + d.get('name') + '\nPhone: ' + d.get('phone') + '\n\n' + d.get('message');
      window.location.href = 'mailto:hello@example.com?subject=' +
        encodeURIComponent('Enquiry from ' + d.get('name')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
