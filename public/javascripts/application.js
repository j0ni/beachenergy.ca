$(function () {
  $('.sign-in').live('click', function (event) {
    event.preventDefault();

    $('#modal').modal('show');
  });

  $('.new-article').live('click', function (event) {
    event.preventDefault();
    $modal = $('#modal');
    $.ajax({
      url: '/new',
      dataType: 'html'
    }).done(function (html) {
      $('.btn-primary').live('click', function (event) {
        event.preventDefault();
        $form = $modal.find('form');
        $form.trigger('submit');

        // $.post({
        //   url: '/',
        //   data: $form.serialize()
        // }).done(function (html) {
        //   $modal.modal('hide');
        // });
      });

      $('.btn :not(.btn-primary)').live('click', function (event) {
        event.preventDefault();
        alert('hello');
        $modal.modal('hide');
      });

      $modal.find('.modal-header h3').html('New Article');
      $modal.find('.modal-body').html(html);

      $modal.modal('show');
    });
  });
});

