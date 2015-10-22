$(document).ready(function(){

    var cartSum = 0,                            // Total price of products added into cart
        Cart = {},                              // To store only the amount of each added product {'product name': amount}
        mainCaption = $("header h1").text();    // Caption for categories page

    // Load categories page when index page opened
    loadPage("templates/categories.html", mainCaption);


    // SET HANDLERS -----------------------------------------------------------
    // To handle the links clicks on elements which will be loaded later

    $("main")
        // Handler for links clicks on Categories Page
        .delegate("a", "click", function(event){
            // Prevent default handler
            event.preventDefault();
            // Put current page into history stack
            history.pushState(null,null,window.location);
            // Get chosen category name and url
            var name = $.trim($(this).text()),
                route = name.replace(/\W+/g,"-").toLowerCase();
            route = "templates/" + route + ".html";
            // Load chosen category's page in main container
            loadPage(route, name);
            // Show custom back-button which is hidden by default
            $("#backbutton").show();
        })
        // Handler for "+" and "-" product amount buttons
        .delegate(".amount button", "click", function(){
            // Get Input element (it stores amount) and get its value
            var $inputElement = $(this).parent().find("input"),
                currentAmount = Number($inputElement.val()),
                // get price of chosen product
                price = $(this).closest(".products").find(".price").text();
            //Remove '$' symbol from price
            price = Number(price.replace(/\D+/g,""));

            // Check which button was pressed "+" or "-"
            if ($(this).text() === "+") {
                // Button '+' pressed
                $inputElement.val(++currentAmount);
                cartSum += price;

            } else if (($(this).text() === "-") && (currentAmount > 0)) {
                // Button '-' pressed
                $inputElement.val(--currentAmount);
                cartSum -= price;
            }
            // Display new total sum of shopping cart
            $("#shoppingCart").text("$"+cartSum);
            // Get chosen product name and save new amount in Cart object
            var name = $(this).closest(".products").find("span.name").text();
            Cart[name] = currentAmount;
        })

        /* Handler for mouse-wheel scrolling
        *  Scrolls content horizontally on mouse-wheel scrolling detected
        *  Dependency: Plugin 'jquery.mousewheel.min.js'
        *  (https://github.com/jquery/jquery-mousewheel)
        */
        .mousewheel(function (event) {
            this.scrollLeft -= (event.deltaY*5);
            event.preventDefault();
        });
    // end of Main element handlers

    // Custom back-button click handler
    $("header").delegate("#backbutton", 'click', function(e){
        e.preventDefault();
        // go to previous state in history stack
        // this will call 'popstate' event
        history.go(-1);
    });

    //Browser's back-button click handler
    $(window).on('popstate', function(e){
        e.preventDefault();
        loadPage('templates/categories.html', mainCaption);
        $("#backbutton").hide();
    });
    // end of Handlers

    /* loadPage function ------------------------------------------------------
    *  Uses ajax, works on server only
    *  Load html-content from 'page' parameter into 'main' element
    *  Set 'caption' parameter into 'header h1' element and page title
    */
    function loadPage(page, caption){
        $.ajax({
            url: page,
            cache: false,
            type: "GET",
            success: function(data){
                // Load template page in 'main' element and scroll left to 0
                $("main").html(data).animate({scrollLeft: 0}, 100);
                document.title = caption;
                $("h1").text(caption);

                // Set amount for every product on chosen category page
                if (page !== 'templates/main.html') populateAmount();
            },
            error: function(){
                //Error occurs while loading the page -
                // might be a lot of reasons -
                // we don't check here, just assume it's local launch
                $("body").html("<center>You probably tried to run the page from local disc!<br>Please run it from local or remote server!<br>" +
                "Or check it available online <a href='http://testqap.ucoz.ua/index.html'>http://testqap.ucoz.ua/index.html</a></center>");
                //window.alert('You are trying to run the page from local disc!\rPlease run it from local or remote server!');
            }
        });
    };

    /* populateAmount ---------------------------------------------------------
    *  Restore saved in Cart amount
    *  Set amount chosen by user earlier
    *  for each product on category page
    */
    function populateAmount(){
        $("span.name").each(function(){
            var prodName = $(this).text();
            if (Cart.hasOwnProperty(prodName)) {
                $(this).closest(".products").find("input").val(Cart[prodName]);
            }
        });
    };
});