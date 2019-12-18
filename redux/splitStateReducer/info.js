/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-18 07:58:53
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2019-12-18 08:03:27
 */
let initState = {
    name:"仅限于"
};
function infoReducer(state,action) {
    /* state 没有初始值则直接赋值 */
    if(!state) {
        state = initState;
    }

    switch(action.type) {
        case "SET_NAME":
            return {
                ...state,
                name:state.name,
            };
        default : return state;
    }
}