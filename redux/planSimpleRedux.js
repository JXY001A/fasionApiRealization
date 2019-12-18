/*
 * @description: 
 * @author: JXY
 * @Date: 2019-09-19 16:50:00
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-16 18:24:27
 */
function createStore (plan,initState) {
    let state = initState;
    let listens = [];

    const  getState = ()=>state;
    const  changeState = (action)=>{
        state = plan(state,action);
        listens.forEach((listen)=>listen());
    }
    const subscribe = (listen)=>{
        listens.push(listen);
    }

    return {
        getState,
        changeState,
        subscribe,
    }
}

function plan(state,action) {
    switch(action.type) {
        case "INCREMENT" :
            return {
                ...state,
                count:state.count + 1,
            };
        case "DECREMENT":
            return {
                ...state,
                count:state.count - 1,
            };
        default: 
            return state;
    }
}

let initState = {count:0};

const store = createStore(plan,initState);
store.subscribe(()=>{
    let state = store.getState();
    console.log(state.count,"state.count change");
});

store.changeState({type:"INCREMENT"});
store.changeState({type:"DECREMENT"});

store.changeState({count:'abcd'});

