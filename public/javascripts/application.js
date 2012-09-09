$(function () {
  $('.sign-in').live('click', function (event) {
    event.preventDefault();

    $('#modal').modal('show');
  });

  $('.new-article').live('click', function (event) {
    event.preventDefault();
    var $modal = $('#modal');

    $.ajax({
      url: '/new',
      dataType: 'html'
    }).done(function (html) {
      $modal.find('.modal-header h3').html('New Article');
      $modal.find('.modal-body').html(html);

      var $form = $modal.find('form');

      $('.btn-primary').live('click', function (event) {
        event.preventDefault();
        $form.trigger('submit');
      });

      $form.find('input[name="title"]').live('focusout', function (event) {
        $form.find('input[name="slug"]').attr('value', event.target.value.toLowerCase().replace(/ +/g, '-'));
      });

      $modal.modal('show');
    });
  });
});

