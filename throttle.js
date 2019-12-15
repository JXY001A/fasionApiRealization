/*
 * @description: 节流实现
 * @author: JXY
 * @Date: 2019-12-11 17:54:22
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-15 22:43:43
 */

function throttle(fn,interval) {
    let last = 0;
    return function() {
        const now = + new Date;
        const context = this,
              args = arguments;  
        if(now-last>=interval) {
            fn.apply(context,[].slice.call(args));
            last = now;
        }  
    }
}
