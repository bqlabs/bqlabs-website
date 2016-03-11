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

          $.each(data, function (i) {

              var name = data[i].name;

              var repo = 'https://raw.githubusercontent.com/bqlabs/' + data[i].name + '/' + data[i].default_branch + '/';

              $.getJSON(repo + 'doc/data.json')
                .done(function( info ) {
                    if (info) {
                        projects[name] = {};
                        if (info.image) {
                            projects[name]['image'] = info.image;
                        }
                        if (info.tags instanceof Array) {
                            projects[name]['tags'] = info.tags;
                        }
                    }
                })
                .always(function() {
                    if (i == data.length - 1) {
                        console.log(JSON.stringify(projects));
                    }
                });
          });
      }
      }}).fail(function() {

      });
