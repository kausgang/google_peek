var API_KEY = "AIzaSyDybDSdox21PniXEprVFVClWMZIcsY_j-M";
var SEARCH_ENGINE_ID = "010470030133584414703:2lmancsivrw";
var WATSON_USERNAME = "242222de-f588-44d3-a937-0ec6a3c0bd43";
var WATSON_PASSWORD = "s5IlxCyzjnTT";
var WATSON_VERSION_DATE = "2017-02-27";




// var myLayout;

$(document).ready(function () {

    // this layout could be created with NO OPTIONS - but showing some here just as a sample...
    // myLayout = $('body').layout(); -- syntax with No Options

    $('body').layout({



        closable: true	// pane can open & close

        // , resizable: true	// when open, pane can be resized
        // , slidable: true	// when closed, pane can 'slide' open over other panes - closes on mouse-out
        // , livePaneResizing: true

        //	some resizing/toggling settings
        // , north__slidable: false	// OVERRIDE the pane-default of 'slidable=true'
        //
        // , north__togglerLength_closed: '100%'	// toggle-button is full-width of resizer-bar
        // , north__spacing_closed: 20		// big resizer-bar when open (zero height)
        // , south__resizable: true	// OVERRIDE the pane-default of 'resizable=true'
        // , south__spacing_open: 0		// no resizer-bar when open (zero height)
        // , south__spacing_closed: 20		// big resizer-bar when open (zero height)

        //	some pane-size settings
        // , west__minSize: 100
        // , east__size: 350
        // , east__minSize: 200
        // , center__minWidth: 100



        , east__maxSize: .5 // 50% of layout width
        , center__minHeight:				200







        //	enable showOverflow on west-pane so CSS popups will overlap north pane
        // , west__showOverflowOnHover: true

        //	enable state management
        , stateManagement__enabled: true // automatic cookie load & save enabled by default

        , showDebugMessages: true // log and/or display messages from debugging & testing code




    });




    $('.ui-layout-east').layout({


        /////ADDED THIS TO HOLD INITIAL SIZE....
        south__size: 250



    });








    //OPERATION ON SEARCH BAR...ENTER WILL SEARCH WIKIPEDIA
    // capturing the search results after the end user presses (and releases) the ENTER button (keycode 13),
    $('#search_input').on('keyup', function(e){


        if(e.keyCode === 13) {

            //simulate search_button press
            search_wiki();

        };
    });



//hide this after test
// show_page_and_url();




});



function search_wiki() {

    //obtain search string
    var SEARCH_STRING = $('#search_input').val();

    //reset search field
    $('#search_input').val('');


    var url =
        "https://www.googleapis.com/customsearch/v1?" +
        "key=" + API_KEY +
        "&cx=" + SEARCH_ENGINE_ID +
        "&q=" + SEARCH_STRING;


    // var url =
    //     "https://www.googleapis.com/customsearch/v1?" +
    //     "key=" + API_KEY +
    //     "&cx=" + SEARCH_ENGINE_ID +
    //     "&q=" + SEARCH_STRING +
    //     "&start="+10;



    //clearout previous search result
    $('#search_result').html('');


    //ajax call to show the search result
    //also enables function to respond to url click on search result
    $.ajax({

        type:"GET",
        url:url,
        // async:false,
        dataType:"json",

        //if search was successful
        success: function(data){

            console.log(url);
            console.log(data);

            // if no search result is returned
            if(data.searchInformation.totalResults == "0"){

                $("#search_result").html("no data found");
            }
            else{


                //make provision for multiple search result pages
                //find number of search result
                var number_of_result = data.searchInformation.totalResults;
                //per page i can show 10 results
                //if number of google page is more than 10, then show only 10 google pages
                var page_links ='';
                if(number_of_result/10 > 10){

                    for(var j=1;j<=10;j++){ //limiting this to 10 page numbers as more page number disrupts the view and

                        // $('#page_number').html('<a href=\"1\" id=\"' + i + '\">' +i+ '</a>')

                         page_links = page_links + '<a href=\"1\" class=\"google_page\" id=\"' + j + '\">' +j+ ',</a>';

                         //show the page number in the pane
                        $('#page_number').html(page_links);
                    }

                }
                else{

                }

                //google search with specific page number
                navigate_google_page(SEARCH_STRING);


                //for each search result, append url to list
                for(var i=0;i<data.items.length;i++){

                    var result_url = data.items[i].link;
                    var title = data.items[i].title;
                    var snippet = data.items[i].snippet;

                    if(result_url.charAt(result_url.length - 1) == '/'){
                        result_url = result_url.substr(0,result_url.length-1);
                    }

                    show_search_result(result_url,title,snippet);

                }


                //if url is clicked on west pane , show page in center pane & url on south pane
                show_page_and_url();




            }



        },
        //if there was an error in search
        error: function(error) {

            alert(error.responseText);

            console.log("error "+error);
        }
    });



}



function show_search_result(result_url,title,snippet){

    $("#search_result").append(

        "<li><a class = 'url' href= " + result_url + ">" +

        title +

        "</a>" +

        // +"<p></p>"
        // +"</li>"

        "<p>"+
        snippet+
        "</p></li>"

    );
}



function show_page_and_url(){

    $(".url").click(function (e) {

        //PREVENT URL FROM LOADING
        e.preventDefault();




        ///get the URL
        var link = $(this).attr("href");

        //alert users about non-supported pages
        if(

            link.includes('play.google.com') ||
            link.includes('twitter.com') ||
            link.includes('facebook.com') ||
            link.includes('github.com')

        ){
            alert(link + " cannot be opened here");
        }

        if(
            link.includes('stackoverflow.com')
        ){

            alert(link + " will be opened in a new tab");
            window.open(link,'_blank');
        }

        else{

            //open the link in center pane
            $("#level_0_center").html('<object id="page" width="100%"  height="100%" data=' +link+ '>');


            //if page is successfully loaded
            //call watson to show analysis
            watson(link);

        }







        //clearout previous url
        $("#level_1_south").html('');
        // ALSO SHOW THE WEBPAGE IN LEVEL1_CENTER FOR TESTING
        $("#level_1_south").html(link);


    });

}






function watson(url) {


    var parameters = {

        url: url,
        WATSON_USERNAME: WATSON_USERNAME,
        WATSON_PASSWORD: WATSON_PASSWORD,
        WATSON_VERSION_DATE: WATSON_VERSION_DATE
    };


    //ONE WAY OF DOING IT - VALID



    $.ajax({

        type: "GET",
        url: '/watson',
        data: {

            url: url,
            WATSON_USERNAME: WATSON_USERNAME,
            'WATSON_PASSWORD': WATSON_PASSWORD,
            'WATSON_VERSION_DATE': WATSON_VERSION_DATE
        },
        success: function (data) {
            $('#level_1_center').html('');

            console.log(data);

            // check if there is any warning from watson
            // alert(data.warnings[0].length !== 1);


            var watson_keyword = "<dl class=\"watson_keyword\">";


            //if warning exists in watson json data then add the warning at the top
            // https://stackoverflow.com/questions/20804163/check-if-a-key-exists-inside-a-json-object
            if ('warnings' in data) {
                watson_keyword = watson_keyword +
                    "<dt id=\"watson_keyword_warning\">" + data.warnings[0] + "</dt>" + "<br>";
            }


            watson_keyword = watson_keyword + "<dt id=\"watson_keyword_relevance_heading\"> Keywords<br>&nbsp&nbsp Relevance </dt> <br>";


            for (var i = 0; i < data.keywords.length; i++) {

                var key = data.keywords[i].text;
                var relevance = data.keywords[i].relevance;


                watson_keyword = watson_keyword +
                    "<dt>" + key + "</dt>" +
                    "<dd>" + relevance + "</dd>"

            }

            $('#level_1_center').html(watson_keyword);
        },
        error: function (error) {

            console.log(error);
        }

    });


}





function navigate_google_page(SEARCH_STRING) {

    $('.google_page').click(function (e) {

        //prevent the default action to navigating to the page
        e.preventDefault();

        //get the page number from id
        var page_number =  $(this).attr('id');

        // alert(page_number);

        // get corresponding google search page number
        if(page_number == 1){
            var url =
                "https://www.googleapis.com/customsearch/v1?" +
                "key=" + API_KEY +
                "&cx=" + SEARCH_ENGINE_ID +
                "&q=" + SEARCH_STRING ;

        }
        else{

            var google_page_number = (page_number-1) * 10;

            //search google
            var url =
                "https://www.googleapis.com/customsearch/v1?" +
                "key=" + API_KEY +
                "&cx=" + SEARCH_ENGINE_ID +
                "&q=" + SEARCH_STRING +
                "&start="+google_page_number;

        }



        $('#search_result').html('');

        $.ajax({

            type:"GET",
            url:url,
            // async:false,
            dataType:"json",

            //if search was successful
            success: function(data){

                console.log(url);
                console.log(data);



                    //for each search result, append url to list
                    for(var i=0;i<data.items.length;i++){

                        var result_url = data.items[i].link;
                        var title = data.items[i].title;
                        var snippet = data.items[i].snippet;

                        if(result_url.charAt(result_url.length - 1) == '/'){
                            result_url = result_url.substr(0,result_url.length-1);
                        }

                        show_search_result(result_url,title,snippet);

                    }


                    //if url is clicked on west pane , show page in center pane & url on south pane
                    show_page_and_url();



            },
            //if there was an error in search
            error: function(error) {

                alert(error.responseText);

                console.log("error "+error);
            }
        });
       //ajax call ends



    });

}