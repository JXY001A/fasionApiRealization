/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-16 21:05:24
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-16 21:34:51
 */
function createStore (plan,initState) {
    let state = initState;
    let listens = [];

    const  getState = ()=>state;
    const  dispatch = (action) => {
        state = plan(state,action);
        listens.forEach((listen)=>listen());
    }
    const subscribe = (listen)=>{
        listens.push(listen);
    }

    return {
        getState,
        dispatch,
        subscribe,
    }
}


function counterReducer(state,action) {
    switch(action.type) {
        case 'INCREMENT' : 
              return {
                  count:state.count+1
              };
        case 'DESREMENT':
              return {
                  count:state.count-1
              };
        default :
              return state;
    }
}

function infoReducer(state,action) {
    switch(action.type) {
        case 'SET_NAME':
                return {
                    ...state,
                    name:action.name,
                };
        case "SET_DESCRIPTION":
                return {
                    ...state,
                    description: action.description
                };
        default :
                return state;
    }
}

function combinReducer(reducers) {
    const reducerKeys = Object.keys(reducers);
    return function combination(state={},action) {
        const nextState = {};
        for(let i=0;i<reducerKeys.length;i+=1) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            
            const prevStateForKey = state[key];
            const nextStateForKey = reducer(prevStateForKey,action);
            nextState[key] = nextStateForKey;
        }

        return  nextState;
    }
}


/* 测试 */
const initState = {
    counter: {
        count: 0
    },
    info: {
        name: 'jxy',
        description: '前端工程师'
    }
};
const reducer = combinReducer({
    counter:counterReducer,
    info:infoReducer,
});

const store = createStore(reducer,initState);
store.subscribe(()=>{
    const state = store.getState();
    console.log(state.counter.count, state.info.name, state.info.description);
});

/* 自增 */
store.dispatch({type:'INCREMENT'});
store.dispatch({type:'SET_NAME',name:'jxy001a'});

