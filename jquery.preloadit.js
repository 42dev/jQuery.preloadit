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
 *      Parameters:
 *          imagesLoaded - the number of images loaded so far
 *          totalImages - the number of images contained in the element
 */
(function($) {
    var methods = {
        init : function(options) {
             
            var defaults = {
                onComplete: false,  
                onUpdate: false
            }, t = this;
             
            $.extend(this, defaults, options);         
             
            this.$images = this.find("img");
            if(this.is("img")){
                this.$images.push(this);    
            }
                         
            this.cache = [];
            this.loadedImages = [];
             
            for(var i=0; i<this.$images.length; i++){
                var $img = $(this.$images[i]),
                    src = $img.attr('src');
                     
                $.ajax({
                    url: src,
                    complete: function(){
                        onImgLoad.apply(t, [$img]);
                    }
                });
            }
        }
    };
     
    /*
     * Group: private methods
     * 
     * Method: onLoad
     *      Listener for onImgLoad event. Fires whether the image
     *      was successfully found or if it could not be found. 
     *      Triggers <onComplete> and <onUpdate> where appropriate. 
     * 
     * Parameters: 
     *      $img - jQuery object of image that was preloaded 
     */
    function onImgLoad($img){
        this.loadedImages.push($img);
         
        //run the update function
        if(this.onUpdate){
            this.onUpdate(this.loadedImages.length, this.$images.length);    
        }
 
        //run the oncomplete images function well all images loaded
        if (this.loadedImages.length === this.$images.length) {
            if(this.onComplete){                        
                this.onComplete();
            }
        }
    }
     
    $.fn.preloadit = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.');
        }
    };
}(jQuery));
