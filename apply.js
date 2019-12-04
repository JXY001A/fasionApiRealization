/*
 * @description: apply 实现
 * @author: JXY
 * @Date: 2019-12-04 09:26:42
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-04 09:32:53
 */

 Function.prototype.myApply = function(thisArg) {
    if(typeof this !== 'function') {
        throw TypeError('Apply must be called on a function!');
    }

    const fn = Symbol('fn');
    thisArg = thisArg || window;
    const args = arguments[1];
    thisArg[fn] = this;
    const result = thisArg[fn](...args);
    delete thisArg[fn];
    return result; 
 }

 /* 总结 */
//  原理与 call 的实现相同，不同点在于接受的参数去不都放置在一个数组中，所以直接取出来传进去即可：var args = arguments[i];thisArg[fn](...args);