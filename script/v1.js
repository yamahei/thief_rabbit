$(function(){

    /**
     * Set Events
     */
    const $main = $("#main");
    const $container = $("#container");
    const region = $main.width() / 16;
    //初期位置に移動
    const page_states = [];
    const get_page_states = function(){
        $container.children().each(function(){
            const $self = $(this);
            const left = $self.position().left;
            const state = {
                index: $self.index(),
                left: left,
            };
            page_states.push(state);
        });
        page_states.sort(function(a, b){ return a.index - b.index; });
    };
    const get_nearlest_page = function(){
        const position = $main.scrollLeft();
        page_states.sort(function(a, b){
            return Math.abs(position - a.left) - Math.abs(position - b.left);
        });
        return page_states[0];
    };
    const get_index_page = function(index){
        return page_states.find(function(a){
            return a.index == index;
        });
    };
    const get_next_index = function(index, direction){
        const next_index = index + direction;
        if(next_index < 0){ return 0; }
        if(next_index >= page_states.length){ return page_states.length - 1; }
        return next_index;
    };

    const scrollwatch = function(onscroll){
        const interval_msec = 1;
        let last_scrollleft = null;
        let calling = false;
        const watcher = function(){
            const now_scrollleft = $main.scrollLeft();
            if(last_scrollleft === null){
                last_scrollleft = now_scrollleft;
                return;
            }else{
                const direction = Math.sign(now_scrollleft - last_scrollleft);
                last_scrollleft = now_scrollleft;
                if(direction !== 0 && !calling){
                    calling = true;
                    onscroll(direction);
                    calling = false;
                }
            }
        };
        setInterval(watcher, interval_msec);
    };

    get_page_states();
    let current_index = page_states.length - 1;//一番右
    $main.scrollLeft(get_index_page(current_index).left);
    $container.find("img").show();

    let now_animating = false;
    let now_touching = false;
    let accum = 0;
    const onscroll = function(direction){
        console.log("onscroll");
        accum += direction;
    };
    const dopaging = function(){
        console.log("dopaging");
        //const current_page = get_index_page(current_index);
        const current_page = get_nearlest_page();
        current_index = current_page.index;
        const direction = Math.sign(accum);
        const next_index = get_next_index(current_index, direction);
        const next_page = get_index_page(next_index);
        const diff = current_page.left - next_page.left;
        const dist = Math.abs(diff);
        if(dist > region){
            const param = { scrollLeft: next_page.left };
            const duration = 500;
            const easing = "swing";
            const onanimated = function(){
                accum = 0;
                current_index = next_index;
                now_animating = false;
            };
            now_animating = true;
            $main.animate(param, duration, easing, onanimated);
        }
    };
    $main.on("mousedown mouosemove touchstart touchmove", function(){
        console.log("now_touching = true");
        now_touching = true;
        accum = 0;
    });
    $main.on("mouseup mouoseout touchend", function(){
        console.log("now_touching = false");
        now_touching = false;
        dopaging();
    });
    scrollwatch(onscroll);

    let show = true;
    counter = 0;
    const $guide = $("#guide");
    const id = setInterval(function(){
        show = !show;
        if(show){
            $guide.show();
        }else{
            $guide.hide();
        }
        if(counter++ > 4 && !show){
            clearInterval(id);
        }
    }, 500);
});