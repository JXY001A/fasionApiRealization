/*
 * @description: 
 * @author: JXY
 * @Date: 2019-09-19 14:51:17
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-15 23:02:16
 */
const createStore = (initState)=>{
    let state = initState;
    let listens = [];
    const getState = ()=> state;
    const subscribe = (listen)=>listens.push(listen);
    const changeState = (newState)=>{
        state = newState;
        listens.forEach((listen)=>{
            listen(state);
        });
    }

    return {
        getState,
        subscribe,
        changeState,
    }; 
}

// test
let initState = {
    counter:{
        count:26,
    },
    info:{
        desc:'前端工程师',
    }
};


const store = createStore(initState);

store.subscribe(()=>{
    const state = store.getState();
    console.log('state.counter.count',state.counter.count);
})

store.subscribe(()=>{
    const state = store.getState();
    console.log('state.info.desc',state.info.desc);
})

store.changeState({...store.getState(),counter:{count:27}});

