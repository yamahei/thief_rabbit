$(function(){

    /**
     * Set Events
     */
    const $main = $("#main");
    const $container = $("#container");
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

    //画面表示（初期状態）
    get_page_states();
    let current_index = page_states.length - 1;//一番右
    $container.scrollLeft(get_index_page(current_index).left);
    $container.find("img").show();


    //ガイドの処理
    const $guide = $("#guide");
    const param = { left: "60%" };
    const duration = 1000;
    const easing = "swing";
    const onanimated = function(){ $guide.hide(); }
    $guide.show();
    setTimeout(function(){
        $guide.animate(param, duration, easing, onanimated);
    }, 500);
});