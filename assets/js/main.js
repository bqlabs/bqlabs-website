/* main.js */

var projectList = $('.projects-list');


function getGithubProjects() {

    var loader = $('.loader');

    // $.ajaxSetup({ cache: false });

    $.ajax({
        type: "GET",
        url: 'https://api.github.com/orgs/bqlabs/repos?callback=?',
        data: { type: "all", per_page: 500},
        dataType: 'json'
    }).done(function(resp) {

        if (resp.data.length > 0) {

            loader.remove();

            $.each(resp.data, function (i) {

                var repo = 'https://raw.githubusercontent.com/bqlabs/' + resp.data[i].name + '/' + resp.data[i].default_branch + '/';

                $.getJSON(repo + 'doc/data.json')
                      .done(function( data ) {
                          if (data) {
                              if (data.image) {
                                resp.data[i]['image'] = repo + data.image;
                              }
                              if (data.tags instanceof Array) {
                                resp.data[i]['category'] = data.tags[0];
                              }
                              setMarkupRepo(resp.data[i]);
                          }
                      })
                      .always(function() {
                          if (i == resp.data.length - 1) {
                              handleMixItUp();
                          }
                      });
            });


        } else {

            loader.remove();
            projectList.html('<p class="align-center">Could not show any repository</p>');

        }
    }).fail(function() {

        loader.remove();
        projectList.html('<p class="align-center">Repositories have failed loaded.</p>');

    });
}

function setMarkupRepo(data) {

    projectList.append(
        '<div class="project" data-star="' + data['stargazers_count']+ '" category="' + (data['category'] ? data['category'] : 'other') + '">'
        +  (data['image'] ? '<a href="' + data['html_url'] + '"> <img class="project__image" src="' + data['image'] + '"></a></br>' : '')
        +  '<a class="project__title" href="' + data['html_url'] + '">'
        +     '<em>' + data['name'] + '</em>'
        +  '</a>'
        +  '<p class="project__description">'
        +     (data['description'] ? data['description'] : '(No description)')
        +  '</p>'
        +   (data['homepage'] ? '<p class="project__homepage"><span class="octicon octicon-link-external"></span> <a href="' + data['homepage'] + '">' + data['homepage'] + '</a></p>' : '')
        +  '<p class="project__stats">'
        +    (data['language'] ? data['language'] : '')
        +    ' <span class="octicon octicon-star"></span> ' + data['stargazers_count']
        +    ' <span class="octicon octicon-git-branch"></span> ' + data['forks_count']
        +  '</p>'
        + '</div>'
    );
}


function handleMixItUp() {

    var inputText;
    var $matching = $();
    var $searcher = $(".searcher__input");
    var categoryList = ['software', 'electronics', 'mechanics'];

    projectList.mixItUp({
        selectors: {
            target: '.project'
        },
        load: {
            sort: 'star:desc'
        },
        callbacks: {
            onMixFail: function(state){
                if(state.activeFilter == 'none') {
                    $('.project').each(function() {
                        if( $.inArray($(this).attr('category'), categoryList) == -1 ){
                            $matching = $matching.add(this);
                        }
                    });
                    projectList.mixItUp('filter', $matching);
                    $('.custom').addClass('active');
                } else {

                    if ($('.no-match').length < 1) {
                        projectList.prepend('<p class="no-match">There are no results that match your search</p>');
                    }
                    $('.no-match').addClass('hidden-match');
                }
            },
            onMixStart: function(){
                $('.no-match').removeClass('hidden-match');
            }
        }
    });

    $('.filter').on('click', function(e) {
        e.preventDefault();
        $searcher.val('');
    });

    $('.searcher').on('submit', function(e) {
        e.preventDefault();
    });

    // Delay function
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $searcher.keyup(function(){

        // Delay function invoked to make sure user stopped typing
        delay(function(){

            inputText = $searcher.val().toLowerCase();

            // Check to see if input field is empty
            if ((inputText.length) > 0) {
                $('.project').each(function() {

                    // add item to be filtered out if input text matches items inside the title
                    if($(this).children('.project__title').children('em').text().toLowerCase().match(inputText)) {
                        $matching = $matching.add(this);
                    }
                    else {
                        // removes any previously matched item
                        $matching = $matching.not(this);
                    }
                });

                // set matching filters
                projectList.mixItUp('filter', $matching);
            }

            else {
                // resets the filter to show all item if input is empty
                projectList.mixItUp('filter', 'all');
            }
        }, 200 );
    });
}

// On document load ...
$(window).on('load', function() {
    getGithubProjects()
});
