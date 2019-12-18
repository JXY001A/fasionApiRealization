/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-18 07:59:10
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2019-12-18 08:17:46
 */
import counterReducer from './counter';
import infoReducer from './info';

function combinReducer(reducers) {
    const keys = Object.keys(reducers);
    return function(state,action) {
        let newState = {};
        for(let i=0;i<keys.length;i+=1) {
            const key = keys[i];
            const reducerForKey = reducers[key];
            const prevState = state[key];
            newState[key] = reducerForKey(prevState,key);
        }
        return newState;
    }
}

function createStore(reducer,initState) {
    let state = initState;
    let listens = [];

    function subscribe(listen) {
        listens.push(listen);
    }

    function dispatch(action) {
        state = reducer(state,action);
        listens.forEach(cb=>cb());
    }
    function getState() {
        return state;
    }
    // /* 注意！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值 */ 
    // TODO: 发起初始化
    dispatch({
        type:Symbol(),
    });

    return {
        subscribe,
        dispatch,
        getState,
    };
}


const reducer = combinReducer({
    counter:counterReducer,
    info:infoReducer
});

// 初始化成功
const store = createStore(reducer);
console.log(store);

