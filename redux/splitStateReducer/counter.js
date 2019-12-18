/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-18 07:58:53
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2019-12-18 08:03:27
 */
let initState = {
    count:0
};
function counterReducer(state,action) {
    /* state 没有初始值则直接赋值 */
    if(!state) {
        state = initState;
    }

    switch(action.type) {
        case "INCREMENT":
            return {
                ...state,
                count:state.count+1
            };
        case "DESCREMENT":
            return {
                ...state,
                count:state.count-1
            };
        default : return state;
    }
}