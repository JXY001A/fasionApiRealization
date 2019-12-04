/*
 * @description: bind 函数实现 
 * @author: JXY
 * @Date: 2019-12-03 22:59:25
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-03 23:48:27
 */
Function.prototype.myBind = function(thisArg) {
    if(typeof this !== 'function') {
        throw TypeError('Bind must Be  called  on a function！');
    }

    var args = Array.prototype.slice.call(arguments,1),
    self = this,
    nop = function() {},
    
    // this instanceof nop 成立两个条件：1. this 是一个普通对象，2. this 的原型链上存在 nop 的原型链   ，出翔这两种情况只能是 new 操作，new 操作改变 this 指向，优先级最高
    bound = function() {
        // 如果是 new 那么 this.__proto__.prototype ===  nop.prototype
        return self.apply( this instanceof nop ? this : thisArg, args.contact(Array.prototype.slice.call(arguments,0)));
    };

    // 箭头函没有 prototype 
    if(this.prototype) {
        nop.prototype = this.prototype;
    }

    bound.prototype = new nop();
    
    return bound;
}


/* 总结  */

// 重要步骤
// 1. 判断 this 的类型必须是 functon 否则抛出错误
// 2. 使用本地变量保存 this 在闭包中
// 3. 将绑定函数的原型接到 wrap 函数上
// 4. new 操作处理，上下文指向新创建的对象

/* 注意点 */
// 1. 箭头函数没有原型
// 2. 不要忘记绑定，和 调用的时候都可能会有参数传入，需要将参数 contact 起来
// 3. 连接原型的方法 nop.prototype = this.prototype; bound.prototype = new nop();  bound.prototype.__proto__ === this.prototype; true

/* 核心 */
// 使用闭包保存了被绑定函数的引用，以及要绑定的上下文对象，调用的时候直接从闭包中获取，起到硬绑定作用