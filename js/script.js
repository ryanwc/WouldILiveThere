
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

    return false;
};


$('#form-container').submit(loadData);


