$(document).ready(function() {
  var commentTemplate = '<li class="media" style="display: none;">\
    <div class="media">\
      <div class="media-left">\
        <img src="_avatar_" class="avatar user-2763-avatar avatar-50 photo" width="50" height="50">\
      </div>\
      <div class="media-body">\
        <p>_commenttext_</p><br>\
        <small><cite>Comment by _username_ - Just now</cite></small><br>\
      </div>\
    </div>\
  </li>';
  $('#submit').click(function() {
    var start = new Date().getTime();

    //Create new comment element
    if($('#comment').val() != '') {
      var avatarImg = $('#user-avatar>img').attr('src');
      var action = $('input[name="action"]').val();
      var commentText = $('#comment').val();
      console.log(action);

      if( $('ul.commentlist').size() == 0 ) {
        $('#p-nocomment').replaceWith("<ul class='media-list commentlist'></ul>");
      }

      $('ul.commentlist').prepend(
        commentTemplate.replace('_avatar_', avatarImg)
          .replace('_username_', $('input[name="username"]').val())
          .replace('_commenttext_', $('#comment').val()));
      $('ul.commentlist').find(".media:first").slideDown("slow");

      var jqxhr = $.post(action, $( "#commentform" ).serialize());
      jqxhr.done(function() {
          $('#comment').val('');
          console.log('DONE');
        });
      jqxhr.fail(function() {
        $('#comment').val(commentText);
          console.log('FAIL');
        });
      jqxhr.always(function() {
          console.log('ALWAYS');
        });
      $('#comment').val('');
    }

    console.log('comment submited');
  });
});
