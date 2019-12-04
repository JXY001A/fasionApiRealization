/*
 * @description: reduce 方法实现
 * @author: JXY
 * @Date: 2019-12-04 11:34:24
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-04 16:00:20
 */


Array.prototype.myReduce = function(callbackfn) {
    if(Object.prototype.toString.call(this) !== '[object Array]') {
        throw TypeError('Reduce must be called on a array!');
    }
    if(typeof callbackfn !== 'function') {
        throw TypeError( callbackfn + 'is not a function!');
    }

    const O = this,
          len = this.length;
    let k=0,
        // 累加器
        accumulator = undefined,
        // k 索引对应的是否存在
        kPresent = undefined,
        // 初始值
        initinalValue = arguments[1] ? arguments[1] : void 0;
    
    // 如果数组为空，且初始值不存在，那么直接报错
    if(len === 0 && arguments.length<2) {
        throw TypeError('Reduce of empty array with no initial value');
    }
    
    if(arguments.length>1) {
        // 有传初始值的情况
        accumulator = initinalValue;
    }else{
        // 反之
        accumulator = O[k];
        k+=1;
    }
    
    while(k<len) {
        kPresent = O.hasOwnProperty(k);
        if(kPresent) {
            accumulator = callbackfn.apply(undefined,[accumulator,O[k],k,O]);
        }
        k+=1;
    }
    return accumulator;
}

// 测试
['1', null, undefined, '', 3, 4].myReduce((a, b) => a + b, 3) // '31nullundefined34'

/* 总结 */

// 核心思想
// 通过遍历 this 指向的数组，使用用户提供的回调函数作为具体处理过程，完成迭代累计并返回结果

// 关键点：
// 1. this 的指向必须是数组
// 2. 传入的回调函数 只能是函数类型
// 3. 注意处理有无初始值的情况
// 4. 数组为空，没有初始值的情况下该方法报错
