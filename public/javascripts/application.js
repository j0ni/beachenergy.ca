$(function () {
  var $modal = $('#modal');

  $('.sign-in').live('click', function (event) {
    event.preventDefault();
    alert('sign in not implemented yet');
  });

  function loadArticleForm(url, header) {
    $.ajax({
      url: url,
      dataType: 'html'
    }).done(function (html) {
      $modal.find('.modal-header h3').html(header);
      $modal.find('.modal-body').html(html);

      var $form = $modal.find('form');
      var action = '/' + $form.find('input[name="slug"]').attr('value');

      $form.attr('action', action);

      $('.btn-primary').live('click', function (event) {
        event.preventDefault();
        $form.trigger('submit');
      });

      $form.find('input[name="title"]').live('focusout', function (event) {
        $form.find('input[name="slug"]').attr('value', event.target.value.toLowerCase().replace(/ +/g, '-'));
      });

      $modal.modal('show');
    })
  }

  $('.edit-article').live('click', function (event) {
    event.preventDefault();
    loadArticleForm(event.target.href, 'Edit');
  });

  $('.new-article').live('click', function (event) {
    event.preventDefault();
    loadArticleForm('/new', 'New');
  });
});

