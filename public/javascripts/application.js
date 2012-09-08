$(function () {
  $('.sign-in').live('click', function (event) {
    event.preventDefault();

    $('#modal').modal('show');
  });
});

