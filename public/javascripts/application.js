$(function () {
  $('.sign-in').live('click', function (event) {
    event.preventDefault();

    $('.hero-unit h1').html('Wibble');
    $('#modal').modal('show');
  });
});

