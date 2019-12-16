/*
 * @description: 
 * @author: JXY
 * @Date: 2019-09-17 21:09:03
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-09-19 14:50:57
 */

/* 发布订阅模式实现数据更新后触发 */

let state = {
    count:1
};

let listeners = [];

/* 订阅 */
function subscribe(listener) {
    listeners.push(listener);
}

function changeCount(count) {
    state.count = count;
    for(let i=0;i<listeners.length;i+=1) {
        const listener = listeners[i];
        listener();
    }
}

/* 使用 订阅服务*/
subscribe(function() {
    console.log(state.count);
})

/* 发布 修改状态 */
changeCount(2);
changeCount(3);
changeCount(4);




