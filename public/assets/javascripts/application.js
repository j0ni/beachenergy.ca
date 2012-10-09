$(function () {
  var $modal = $('#modal');
  var $original = $modal.html();

  function flash(level, message) {
    $.scrollTo($('.flash-message').html('<div class="alert alert-' + level + '">' + message + '</div>'));
  }

  function loadForm(url, header, action) {
    $.ajax({
      url: url,
      dataType: 'html'
    }).done(function (html) {
      $modal.find('.modal-header h3').html(header);
      $modal.find('.modal-body').html(html);

      var $form = $modal.find('form');
      if (header.match(/^Edit/)) {
        var slug = $form.find('input[name="slug"]');
        var email = $form.find('input[name="email"]');

        if (slug.length)
          action = action + '/' + slug.attr('value');
        else if (email.length)
          action = action + '/' + email.attr('value');
      }

      if (action)
        $form.attr('action', action);

      $('.btn-primary').live('click', function (event) {
        event.preventDefault();
        $form.trigger('submit');
      });

      var $actions = $form.find('.form-actions');
      if ($actions) {
        $modal.find('.modal-footer').html($actions.html());
        $actions.remove();
      }

      $modal.find('input').live('keydown', function (event) {
        if (event.which === 13) {
          $(this).blur();
          $modal.find('.btn-primary').focus().click();
        }
      });

      $modal.modal('show');
    });
  }

  $('.select-role').live('change', function (event) {
    var email = $(event.target).attr('name');
    var roles = event.target.options;
    var selection = event.target.options.selectedIndex;
    var role = $(roles[selection]).attr('value');

    $.ajax({
      type: 'POST',
      url: '/admin/users/'+email,
      data: 'role='+role
    }).success(function (data) {
      flash('success', data);
    }).error(function (data) {
      flash('error', (data && data.responseText ? data.responseText : data));
    });
  });

  $('.delete-image, .delete-user, .delete-article').live('click', function (event) {
    event.preventDefault();

    $.ajax({
      type: 'POST',
      url: $(event.target).attr('href')
    }).success(function (data) {
      flash('success', data);
      $(event.target).parents('tr').remove();
    }).error(function (data) {
      flash('error', (data && data.responseText ? data.responseText : data));
    });
  });

  function setVisible(event, objectType) {
    var slug = $(event.target).attr('name');
    var visible = $(event.target).attr('checked');

    $.ajax({
      type: 'POST',
      url: '/admin/'+objectType+'/'+slug,
      data: 'visible='+(visible?'true':'false')
    }).success(function (data) {
      flash('success', data);
    }).error(function (data) {
      flash('error', (data && data.responseText ? data.responseText : data));
   });
  }

  $('.set-article-visible').live('change', function (event) {
    setVisible(event, 'articles')
  });

  $('.set-image-visible').live('change', function (event) {
    setVisible(event, 'images')
  });

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

  $('.edit-user').live('click', function (event) {
    event.preventDefault();
    loadForm(event.target.href, 'Edit account details', '/users');
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
    }, 1000);
  });
});
