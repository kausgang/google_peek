

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
//show_page_url();




});










function search_wiki() {

    //obtain search string
    var SEARCH_STRING = $('#search_input').val();

    //reset search field
    $('#search_input').val('');


    var API_KEY = "AIzaSyCT0_EoBb73V0EElpAJFON23Vzk0C495GE";
    var SEARCH_ENGINE_ID = "010470030133584414703:2lmancsivrw";

    var url =
        "https://www.googleapis.com/customsearch/v1?" +
        "key=" + API_KEY +
        "&cx=" + SEARCH_ENGINE_ID +
        "&q=" + SEARCH_STRING;


console.log(url);

    //clearout previous search result
    $('#search_result').html('');



    $.ajax({

        type:"GET",
        url:url,
        // async:false,
        dataType:"json",


        success: function(data){



            console.log(data);



            // if no search result is returned
            if(data.items.length == 0){

                $("#search_result").html("no data found");
            }

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
            show_page_url();


        },
        error: function(error) {

            alert(error.responseText);

            console.log(error);
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





function show_page_url(){

    $(".url").click(function (e) {

        //PREVENT URL FROM LOADING
        e.preventDefault();


        ///LOAD PAGE IN CENTER PANE
        var link = $(this).attr("href");
        $("#level_0_center").html('<object id="page" width="100%"  height="100%" data=' +link+ '>');


        //alert users about non-supported pages
        if(
            link.includes('youtube.com') ||
            link.includes('vemio.com') ||
            link.includes('play.google.com')

        )
        {

            alert(link + " will not be displayed as webpage ");
        }


        //clearout previous url
        $("#level_1_south").html('');
        // ALSO SHOW THE WEBPAGE IN LEVEL1_CENTER FOR TESTING
        $("#level_1_south").html(link);

    });

}


