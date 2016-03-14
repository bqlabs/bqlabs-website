/* team.js */

var memberList = $('.projects-list');


function getGithubMembers() {

    var loader = $('.loader');

    // $.ajaxSetup({ cache: false });

    $.ajax({
      url: 'https://api.github.com/orgs/bqlabs/members',
      headers: {
          'Authorization': 'token 35637034c3d4cb3d4b84ac09eee5c4b0aac2c661' // public access token
      },
      timeout: 3000,
      complete: function(xhr) {
          var data = xhr.responseJSON;

          if (data.length > 0) {

              loader.remove();

              $.each(data, function (i) {

                    console.log(data[i]);

                    setMarkupMember(data[i]);

                    if (i == data.length - 1) {
                        handleMixItUp();
                    }
              });

          } else {
              loader.remove();
          }
      }}).fail(function() {
          loader.remove();
      });
}

function setMarkupMember(data) {

    memberList.append(
        '<div class="project">'
        +  (data['avatar_url'] ? '<div class="project__image"><a href="' + data['html_url'] + '"> <img style="vertical-align:middle;" src="' + data['avatar_url'] + '"></a></div>' : '')
        +  '<a class="project__title" href="' + data['html_url'] + '">'
        +     '<em>' + data['login'] + '</em>'
        +  '</a>'
        + '</div>'
    );
}

function handleMixItUp() {

    memberList.mixItUp({
        selectors: {
            target: '.project'
        }
    });
}

// On document load ...
$(window).on('load', function() {
    getGithubMembers()
});
