/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-19 21:23:20
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2019-12-19 23:46:04
 */
function createStore(reducer,initState,rewriteCreateStoreFunc) {
    
    if(typeof rewriteCreateStoreFunc === 'function') {
        const newCreateStore = rewriteCreateStoreFunc(createStore);
        return newCreateStore(reducer,initState);
    }

    let state =  {};
    let listens = [];

    const subscribe = (listen)=>{
        listens.push(listen);
        return function () {
            listens.splice(listens.indexOf(listen),1);
        }
    }
    const dispatch = (action)=>{
        state = reducer(state,action);
        listens.forEach(cb=>cb());
    }
    const getState = ()=>{
        return state;
    }
    /* 初始化操作 */
    dispatch({
        type:Symbol(),
        payload:{}
    });
    return {
        subscribe,
        dispatch,
        getState,
    };
}

function combineReducer(reducers) {
    const reducerKeys = Object.keys(reducers);
    return function(state,action) {
        let newState = {};
        reducerKeys.forEach((reducerKey)=>{
            const currState = state[reducerKey];
            const reducer = reducers[reducerKey];
            newState[reducerKey] = reducer(currState,action);
        });
        return newState;
    }
}

/* conuter Reducer  Begin*/
let conuter = {
    count:0,
};

function conuterReducer(state,action) {
    if(state === void 0) {
        return conuter;
    }

    switch(action.type) {
        case 'INCREMENT': 
            return {
                ...state,
                count:state.count+1
            };
        case "DECREMENT":
            return {
                ...state,
                count:state.count-1
            };
        default: 
            return state;
    }
}
/* conuter Reducer  End*/

/* info Reducer  Begin*/
let info = {
    name:'jinxianyu',
    title:'frontEnd',
};

function infoReducer(state,action) {
    if(state === void 0) {
        return info;
    }

    switch(action.type) {
        case 'CHANGE_NAME': 
            return {
                ...state,
                name:action.payload.name,
            };
        case 'CHANGE_TITLE': 
            return {
                ...state,
                title:action.payload.title,
            };
        default : state;
    }
}
/* info Reducer  End*/



/* 中间件  Begin*/
// TODO: 传递 store 的作用就是可以让 中间件独立出去，降低耦合性
function logMiddleware (store){
    return function (next) {
        return function(action) {
            console.log('prev state',store.getState());
            console.log('action :', action);
            next(action);
            console.log('curr state:', store.getState());
        }
    }
} 

function exceptionMiddleware(store){
    return function(next) {
        return function(action) {
            try {
                next(action);
            } catch (error) {
                console.log('error :', error);
            }
        }
    }
}

function timerMiddleware(store) {
    return function(next) {
        return function(action) {
            console.log('timeSamp :', + new Date);
            next(action);
        }
    } 
}

// 优化中间件自动合成
function applyMiddleware(...middlewares) {
    return function(createStore) {
        return function newCreateStore(reducer,initState) {
            const store = createStore(reducer,initState);
            let dispatch = store.dispatch;
            // debugger;
            const chain = middlewares.map((cb)=>cb(store)); 
            
            chain.reverse().forEach((middleware)=>{
                dispatch = middleware(dispatch);
            });
            store.dispatch = dispatch;
            
            return store; 
        }
    } 
}

// const timer = timerMiddleware(store);
// const logger = logMiddleware(store);
// const exception = exceptionMiddleware(store);
// store.dispatch = exception(timer(logger(next)));



/* 中间件 End */


const reducer = combineReducer({
    info:infoReducer,
    conuter:conuterReducer,
}); 

// const store = createStore(reducer);
// const newCreateStore = applyMiddleware(exceptionMiddleware,logMiddleware,timerMiddleware)(createStore);
// const store = newCreateStore(reducer);

// const  unsubscribe=  store.subscribe(()=>{
//     console.log(store.getState().info.name, 'my name')
// });



//取消订阅 
// unsubscribe();
//  取消订阅后，发布于事件无效
// store.dispatch({
//     type:'CHANGE_NAME',
//     payload:{
//         name:"123"
//     }
// });


/* 终极用法 */

const rewriteCreateStoreFunc  = applyMiddleware(exceptionMiddleware,timerMiddleware,logMiddleware);
const store = createStore(reducer, void 0,rewriteCreateStoreFunc);

store.dispatch({
    type:'CHANGE_NAME',
    payload:{
        name:"jinxnaiyu_hahaha"
    }
});