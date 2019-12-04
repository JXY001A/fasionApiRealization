/*
 * @description:  new 关键字实现
 * @author: JXY
 * @Date: 2019-12-04 21:20:55
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-04 21:38:52
 */

function myNew() {
    var obj = new Object();
    var args = Array.prototype.slice.call(arguments);
    var Constructor = args.shift();
    obj.__proto__ === Constructor.prototype;
    var ret = Constructor.apply(obj,args);
    
    return  ret && typeof ret === 'object' ? ret : obj;
}


// 测试
function a() {
	this.c='jxy';
}

myNew(a) // {c:xyy}


// 核心点
// 创建一个对象，然后在将它作为被 new 函数的执行上下文调用至，最后依据返回结果，返回生成对象

// 关键点
// 1. 原型链的指向问题
// 2. 如果被调用函数返回结果，这个结果是一个非空对象，那么返回之，否则返回创建的  obj