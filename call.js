/*
 * @description: call 方法实现
 * @author: JXY
 * @Date: 2019-12-04 09:00:00
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-04 09:22:50
 */
Function.prototype.myCall = function(thisArg) {
    // 对用对象必须是函数，否则报错
    if(typeof this !== 'function') {
        throw TypeError('Call must be called on a function!'); 
    }
    // 生成一个内部键值 
    const fn = Symbol('fn');
    // 拿到参数
    const args = Array.prototype.slice.call(arguments,1);
    // 兼容 call(null) 的情况
    thisArg = thisArg || window; 
    // 将调用 call 的函数添加至 thisArg 中
    thisArg[fn] = this;
    // 调用
    const result = thisArg[fn](...args);
    // 删除添加属性
    delete  thisArg[fn];
    return result;
}

/* 总结 */

// 核心点
// 将调用 call 的函数作为一个属性添加至 call 函数的第一个参数中，然后调用，依托 this的默认绑定机制。

// 注意点
// 1. 作为属性添加的时候，可以使用 symbol 也可以不用，但是需要在使用过后删除之
// 2. 需要注意 call(null) 时，函数内的 this 实际上是指向 window 的，而非 null
// 3. 注意返回调用的结果

