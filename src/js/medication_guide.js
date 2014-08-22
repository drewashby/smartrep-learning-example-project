var mgMenuScroller;
$(document).ready(function(){
        if(exists(".medication_guide_container")){
                setTimeout(function () {
                        medication_guide_scroller = new iScroll($('.medication_guide_container').get(0), {
                                scrollbarClass: 'medication_guide_scrollbar',
                                hideScrollbar:false,
                                bounce:false
                        });
                }, 0);
        }

        // mgMenuScroller = new iScroll($('#menuScroll').get(0), {
        //         scrollbarClass: 'medication_guide_scrollbar',
        //         hideScrollbar:false,
        //         bounce:false
        // });
});
