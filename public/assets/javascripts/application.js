$(function () {
  var $modal = $('#modal');
  var $original = $modal.html();

  function loadForm(url, header, action) {
    $.ajax({
      url: url,
      dataType: 'html'
    }).done(function (html) {
      $modal.find('.modal-header h3').html(header);
      $modal.find('.modal-body').html(html);

      var $form = $modal.find('form');
      if (header.match(/^Edit/))
        action = action + '/' + $form.find('input[name="slug"]').attr('value');

      $form.attr('action', action);

      $('.btn-primary').live('click', function (event) {
        event.preventDefault();
        $form.trigger('submit');
      });

      $form.find('input[name="title"]').live('focusout', function (event) {
        $form.find('input[name="slug"]').attr('value', event.target.value.toLowerCase().replace(/ +/g, '-'));
      });

      var $actions = $form.find('.form-actions');
      if ($actions) {
        $modal.find('.modal-footer').html($actions.html());
        $actions.remove();
      }

      $modal.modal('show');
    });
  }

  $('.login').live('click', function (event) {
    event.preventDefault();
    loadForm('/users/login', 'Enter email address and password', '/users/login');
  });

  $('.sign-up').live('click', function (event) {
    event.preventDefault();
    loadForm('/users/new', 'Create an account', '/users');
  });

  $('.edit-article').live('click', function (event) {
    event.preventDefault();
    loadForm(event.target.href, 'Edit Article', '/articles');
  });

  $('.new-article').live('click', function (event) {
    event.preventDefault();
    loadForm('/articles/new', 'New Article', '/articles');
  });

  $('.new-image').live('click', function (event) {
    event.preventDefault();
    loadForm('/images/new', 'New Image', '/images');
  });

  $('.edit-image').live('click', function (event) {
    event.preventDefault();
    loadForm(event.target.href, 'Edit Image', '/images');
  });

  $('.thumbnail').live('click', function (event) {
    event.preventDefault();
    $img = $(event.target);
    $.ajax({
      url: $img.parent().attr('href'),
      dataType: 'html'
    }).done(function (html) {
      $modal.find('.modal-header h3').html($img.attr('alt'));
      $modal.find('.modal-body').html(html);
      $modal.find('.modal-footer .btn-primary').remove();
      $modal.modal('show');
    });
  });

  $('.modal .btn').live('click', function (event) {
    setTimeout(function () {
      $modal.html($original);
    }, 700);
  });
});
