/*
 * @description: 防抖实现 debounce
 * @author: JXY
 * @Date: 2019-12-11 18:10:44
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-11 18:23:46
 */

 function debounce(fn,delay) {
    let timer = null;
    return function() {
        const args = arguments,
              context = this;
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            fn.apply(context,Array.prototype.slice.call(args));
        },delay);  
    }
 }