
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');


    // clear out old data before new request
    $wikiElem.text('');
    $nytElem.text('');

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text ('So, you want to live at '+ address + '?');
    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address ;
    $body.append('<img class="bgimg" src="'+ streetViewUrl +'">');

    // NYT Times AJAX request
    var nytUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=f5aed38791e54966b2fd3ba074c76111';

    $.getJSON( nytUrl, function( data ) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
            '<a href="'+ article.web_url + '">'+ article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
          };
    }).error(function() {
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //Wikipedia Article using JSON-P jQuery.ajax() method
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text('failed to get wikipedia resources');
    },8000);

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      success: function(response) {
        var wikiArticles = response[1];

        for (var i=0; i < wikiArticles.length; i++) {
          articleStr = wikiArticles[i];
          var articleUrl = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + articleUrl + '">' + articleStr + '</a></li>');
        };
        clearTimeout(wikiRequestTimeout);
      }
    });

    return false;
};

$('#form-container').submit(loadData);
