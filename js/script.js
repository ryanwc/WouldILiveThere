
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var street = $("#street").val();
    var city = $("#city").val();

    // load streetview

    var googleStreetViewURL = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + street + ", " + city;

    var imageHTML = "<img class='bgimg' src='"+googleStreetViewURL+"' alt='[Google Streetview picture]'>";

    $("#background-image-container").append(imageHTML);

    // load NY Times articles

    var nyTimesArticleAjaxURL =  "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
    var nyTimesArticleAjaxQuery = "q="+street+", "+city;
    var nyTimesAPIKey = "api-key=0da9b2e56d7f4eeeb52ac8398568cef1";

    nyTimesArticleAjaxURL = nyTimesArticleAjaxURL+nyTimesArticleAjaxQuery+"&"+nyTimesAPIKey;

    $.getJSON(nyTimesArticleAjaxURL, function(data) {  

        articles = data.response.docs;

        for (i = 0; i < articles.length; i++) {

            var link = "";
            var headline = "";

            var article = articles[i];

            link = article.web_url;
            headline = article.headline.main;
            //snippet = articlesJSON["response"]["docs"][i]["snippet"];

            headlineAsLink = "<a href='" + link + "'>" + headline + "</a>";

            $nytElem.append("<li>"+headlineAsLink+"</li>");
        }
    }).error(function (error) {

        $nytElem.append("<li>Error retrieving NY Times articles</li>");
    });


    // load wikipedia links

    var wikiAjaxURL = "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="+city+"&prop=revisions|links&rvprop=content&callback=?";

    var titles = [];

    // get the titles
    $.ajax({
        url: wikiAjaxURL,
        dataType: "json",
        type: "GET",
        success: function(data) {

            if ("query" in data) {

                $(data.query.search).each(function(key, value) {

                    var thisTitle = $(this)[0].title;

                    // instead of another ajax call to get pageid, could probably
                    // link to directly like <a href="wikipedia.org/[title]"></a>
                    var thisArticleAjax = "http://en.wikipedia.org/w/api.php?action=query&format=json&titles="+thisTitle+"&prop=revisions&rvprop=content&callback=?";
                    
                    $.ajax({
                        url: thisArticleAjax,
                        dataType: "json",
                        type: "GET",
                        success: function(data) {

                            var thisID = "";

                            for (var name in data.query.pages) {

                                thisID = name.toString();
                            }


                            $wikiElem.append("<li><a href='http://en.wikipedia.org/?curid="+thisID+"'>"+data.query.pages[thisID].title+"</a></li>");
                        }
                    }).error(function(error) {

                        $wikiElem.append("<li>Error retrieving Wikipedia link to '"+title[i]+"'</li>");
                    });
                });
            }
            else {

                $wikiElem.append("<li>No Wikipedia pages matching '"+city+"'</li>");   
            }    
        }
    }).error(function(error) {

        $wikiElem.append("<li>Error retrieving Wikipedia links</li>");
    });

    return false;
};


$('#form-container').submit(loadData);


