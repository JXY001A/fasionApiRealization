/*
 * @description: 
 * @author: JXY
 * @Date: 2019-09-19 14:51:17
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-09-23 16:00:13
 */


const createStore = function (plan,initState) {
    let state = initState;
    let listeners = [];

    /* 订阅 */
    function subscribe(listener) {
        listeners.push(listener);
    }
    /* 通知 */
    function changeState(action) {
        state = plan(state, action);
        for (let i = 0; i < listeners.length; i += 1) {
            const listener = listeners[i];
            listener();
        }
    }

    /* 获取state */
    function getState() {
        return state;
    }

    return {
        subscribe,
        changeState,
        getState,
    }
}



let initState = {
    count: 0
}

/*注意：action = {type:'',other:''}, action 必须有一个 type 属性*/
const plan = function(state,action) {
    switch(action.type) {
        case 'INCREMENT':{
            return {
                ...state,
                count:state.count + 1,
            }
        }
        case 'INCREMENT':{
           return {
                ...state,
                count:state.count - 1,
           }
        }
        default :
            return state;
    }
}

/*plan函数*/
let store = createStore(plan, initState);

store.subscribe(() => {
    let state = store.getState();
    console.log(state.count);
});
/*自增*/
store.changeState({
    type: 'INCREMENT'
});
/*自减*/
store.changeState({
    type: 'DECREMENT'
});
/*我想随便改 计划外的修改是无效的！*/
store.changeState({
    count: 'abc'
});