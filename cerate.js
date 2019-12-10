/*
 * @description: Object.create 实现  
 * @author: JXY
 * @Date: 2019-12-10 22:37:43
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-10 22:59:46
 */

Object.myCreate = function(prototype,properties) {
    if(typeof prototype !== 'object') {
        throw TypeError('object prototype may only be an Object or null');
    }
    
    if (typeof prototype !== "object") { throw TypeError(); }
    function Ctor() {}
    Ctor.prototype = prototype;
    var o = new Ctor();
    if (prototype) { o.constructor = Ctor; }
    if (properties !== undefined) {
        if (properties !== Object(properties)) { throw TypeError(); }
        Object.defineProperties(o, properties);
    }
    return o;
}

/* 核心点： 将匿名函数的的原型指向用户指定要关联的对象，然后使用 new 操作符返回一个新对象，该对象的原型为用户指定的对象 */
// 注意点：
// 1. prototype 不能是 undefined
// 2. 需要将构生成新对象的构造函数重新赋值，前提是原型存在的条件下
// 3. 注意第二个参数 properties