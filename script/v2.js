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

    //ユーザ操作の検出用
    let now_touching = false;
    $main.on("mousedown mouosemove touchstart touchmove", function(){
        now_touching = true;
    });
    $main.on("mouseup mouoseout touchend", function(){
        now_touching = false;
    });

    //画面表示（初期状態）
    get_page_states();
    let current_index = page_states.length - 1;//一番右
    $main.scrollLeft(get_index_page(current_index).left);
    $container.find("img").show();

    //スクロール監視
    const scrollwatch = function(onscrolling, onscrollstart, onscrollstop){
        const interval_msec = 1;
        let last_scrollleft = $main.scrollLeft();
        const watcher = function(){
            //スクロールイベント判定
            const now_scrollleft = $main.scrollLeft();
            const speed = now_scrollleft - last_scrollleft;
            if(now_scrollleft == 0 && last_scrollleft == 0){
                //not scroll
            }else if(now_scrollleft != 0 && last_scrollleft == 0){
                onscrollstart && onscrollstart(now_scrollleft, speed);
            }else if(now_scrollleft == 0 && last_scrollleft != 0){
                onscrollstop && onscrollstop(now_scrollleft, speed);
            }else{
                onscrolling && onscrolling(now_scrollleft, speed);
            }
            last_scrollleft = now_scrollleft;
        };
        setInterval(watcher, interval_msec);
    };
    //スクロールイベント処理
    const snapwidth = $main.width() / 8;//スナップする最大幅
    const snapspeed = 20;//スナップしないスピード下限
    const snapforce = 8;//スナップの最大強さ
    const pagesnap = function(left, speed){
        if(now_touching){ return; }//操作中はスナップしない
        if(snapspeed < speed){ return; }//速すぎたらスナップしない
        const current_page = get_nearlest_page();
        const current_left = current_page.left;
        const diff = left - current_left;
        const width = Math.abs(diff);
        const direction = Math.sign(diff);
        if(snapwidth < width){ return; }//遠すぎたらスナップしない
        const per = (snapwidth - width) / snapwidth;//適用割合
        const force = snapforce * per * direction * -1;
        if(current_left < left && left < current_left + force){
            $main.scrollLeft(left);//右方向に突き抜ける場合
        }else if(left < current_left && current_left + force < left){
            $main.scrollLeft(left);//左方向に突き抜ける場合
        }else{
            if(Math.abs(force) < 1){
                $main.scrollLeft(left);
            }else{
                $main.scrollLeft(left + force);
            }
        }
    };
    scrollwatch(pagesnap, null, pagesnap);

    //ガイドの処理
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