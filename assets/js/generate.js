/* Generate projects.json file */

var projects = {};


$.ajax({
  url: 'https://api.github.com/orgs/bqlabs/repos?type=all&per_page=500',
  headers: {
      'Authorization': 'token 35637034c3d4cb3d4b84ac09eee5c4b0aac2c661' // public access token
  },
  timeout: 3000,
  complete: function(xhr) {

      var data = xhr.responseJSON;

      if (data.length > 0) {

          loader.remove();

          $.each(data, function (i) {

              var name = resp.data[i].name;

              projects[name] = {};

              var repo = 'https://raw.githubusercontent.com/bqlabs/' + data[i].name + '/' + data[i].default_branch + '/';

              $.getJSON(repo + 'doc/data.json')
                .done(function( info ) {
                    if (info) {
                        if (info.image) {
                            projects[name]['image'] = repo + info.image;
                        }
                        if (info.tags instanceof Array) {
                            projects[name]['tags'] = info.tags;
                        }
                        setMarkupRepo(data[i]);
                    }
                })
                .always(function() {
                    if (i == data.length - 1) {
                        handleMixItUp();
                    }
                });
          });
      }
      }}).fail(function() {

      });
