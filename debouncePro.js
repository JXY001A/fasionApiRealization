/*
 * @description: debouncePro
 * @author: JXY
 * @Date: 2019-12-11 18:26:34
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-11 18:26:43
 */
function debouncePro(fn,delay) {
    let timer  = null,
        last = 0;
    return function() {
        const args = arguments,
              context = this,
              now = + new Date;

        if(now-last<delay) {
            clearTimeout(timer);
            timer = setTimeout(()=>{
                fn.apply(context,Array.prototype.slice.call(args));
                last = now;
                timer = null;
            },delay);
        }else{
            fn.apply(context,Array.prototype.slice.call(args));
            clearTimeout(timer);
            last = now;
            timer = null;
        }
    }
}