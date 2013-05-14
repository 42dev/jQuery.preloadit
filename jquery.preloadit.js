/*
 * File: jquery.preloadit-1.0.js
 * 
 * Class: preloadit
 *  This plugin preloads all the images all the images contained in the extended images.
 *
 *  Use:
 *      > $(element).preloadit() //preloads all the images inside of element
 *
 *  Group: Callbacks
 *
 *  Function: onComplete
 *      This callback fires when the entire set of images has been preloaded.
 *
 *  Function: onUpdate
 *      This plugin fire when an image is loaded
 *
 *  Function: onImgLoad
 *      Method called when an image is loaded
 *      
 *      Parameters:
 *          imagesLoaded - the number of images loaded so far
 *          totalImages - the number of images contained in the element
 */
(function($) {
    var methods = {
        init : function(options) {
             
            var defaults = {
                onComplete: false,  
                onUpdate: false,
                onImgLoad: false
            }, t = this;
             
            $.extend(this, defaults, options);         
             
            this.$images = this.find("img");
            if(this.is("img")){
                this.$images.push(this);    
            }
                         
            this.cache = [];
            this.completedRequests = [];
            this.loadedImages = [];
             
            //request each image through ajax
            this.$images.each(function(i, o){
                var $img = $(o),
                    src = $img.attr('src');
                     
                // after request completion check if it was a sucess or otherwise.
                $.ajax({
                    url: src,
                    complete: function(xhr, status){
                        switch(xhr.status){
                            case 200: 
                                onSuccess.call(t, $img);
                                break;
                            default:
                                addXHR.call(t, xhr)
                        }
                    }
                });
            });
        }
    };
     
    /*
     * Group: private methods
     * 
     */

    /*
     * onSuccess()
     *  loads the image into the dom then fires an event
     */
    function onSuccess($img){
        var t = this;

        $img.load(function(){
            //remove hidden image from dom
            $img.remove();
            //unhide img
            $img.show()

            t.loadedImages.push($img);            

            if(t.onImgLoad){
                t.onImgLoad($img);
            }

            addXHR.call(t);
        });
        $("body").append($img.hide());       
        
    }

    /*
     * addXHR()
     */
     function addXHR(xhr){
        this.completedRequests.push(xhr);
        checkComplete.call(this)
     }

    /*
     * checkComplete()
     *  see if the requests are done
     *  send updates
     */
    function checkComplete(){
        //update the number of completed requests
        if(this.onUpdate){
            this.onUpdate(this.completedRequests.length, this.$images.length);    
        }

        //run the oncomplete images function well all images loaded
        if (this.completedRequests.length === this.$images.length) {
            if(this.onComplete){                        
                this.onComplete();
            }
        }
    }
     
    /*
     * Preload arr assums the jquery object is a div
     */
    $.fn.preloadit = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.');
        }
    };

    /*
     * Preload arr assums the jquery object is an array of urls
     */
    $.fn.preloadArr = function(options){

        images = this;
        //preload conainer
        var $preloadContainer = $("<div>");

        //load images
        for( i = 0; i < images.length; i++ ){
          var $img = $("<img/>");
          $img.attr("src", images[i]);
          $preloadContainer.append($img);
        }

        //after preload insert into dom
        $preloadContainer.preloadit(options);
    };
}(jQuery));
