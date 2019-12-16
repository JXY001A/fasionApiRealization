/* Promise 的认识 */
// 1. Promise 相当于一个状态机，有三种状态 1) pending 2)fulfilled 3)rejected

// 三种状态
const PENDING = 'pending';
const FULFILLED = 'fulFilled';
const REJECTED = 'rejected';

function Promise(excutor) {
    // 保存当前 Promise 对象
    let that = this;
    // 初始化状态
    that.status = PENDING;
    // fulfulled 时返回的值
    that.value = undefined;
    // rejected 时返回的值
    that.reason = undefined;
    that.onFulfilledCallbacks = [];
    that.onRejectedCallbacks = [];

    function resolve(value) {
        if(value instanceof Promise) {
            return value.then(resolve,reject);
        }

        setTimeout(()=>{
            if(that.status === PENDING) {
                // 状态只能由 pending 到 fulfilled
                that.status = FULFILLED;
                that.value = value;
                that.onFulfilledCallbacks.forEach(cb =>cb(that.value));
            }
        });
    }

    function reject(reason) {
        setTimeout(()=>{
            if(that.status === PENDING) {
                // 状态只能由 pending 到 reject
                that.status = REJECTED;
                that.reason = reason;
                that.onRejectedCallbacks.forEach(cb=>cb(that.reason));
            }
        });
    }

    try {
        excutor(resolve,reject);
    } catch (e) {
        reject(e);
    }
} 

/* resolve 中值得几种情况 
    1) 普通值
    2) promise 对象
    3）thenable 对象或函数
*/

function resolvePromise (promise2,x,resolve,reject) {
    if(promise2 === x) {
        return reject(new TypeError('循环引用'));
    }

    let called = false;

    // 判断 x 是一个 Promise 
    if(x instanceof Promise) {
        if(x.status === PENDING) {
            x.then(y=>{
                resolvePromise(promise2,y,resolve,reject);
            },reason=>{
                reject(reason);
            });
        }else{
            // 值已经被解析，即：x 已经处于 resolve/reject 状态
            x.then(resolve,reject); 
        }
    }else if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if(typeof then === 'function') {
                then.call(x,y=>{
                    if(called) return;
                    called=true;
                    resolvePromise(promise2,y,resolve,reject);
                },reason=>{
                    if(called) return;
                    called = true;
                    reject(reason);
                });
            }else{
                resolve(x);
            }
        } catch (e) {
            if(called) return;
            called = true;
            reject(e);
        }
    }else{
        resolve(x);
    }
}

Promise.prototype.then = function(onFulfilled,onRejected) {
    const that = this;
    let newPromise;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value=>value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason=>{throw reason};

    if(that.status === FULFILLED) {
        return newPromise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                try {
                    let x = onFulfilled(that.value);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    if(that.status === REJECTED) {
        return newPromise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    if(that.status === PENDING) {
        return newPromise = new Promise((resolve,reject)=>{
            that.onFulfilledCallbacks.push((value)=>{
                try {
                    let x = onFulfilled(value);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (e) {
                    reject(e);
                }
            });

            that.onRejectedCallbacks.push((reason)=>{
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}


Promise.all =  function(promises) {
    return new Promise((resolve,reject)=>{
        let done = gen(promises.length,resolve);
        promises.forEach((promise,index)=>{
            promise.then((value)=>{
                done(index,value);
            },reject);
        });
    });
}

function gen(length,resolve) {
    let count = 0;
    let values = [];
    return function(i,value) {
        values[i] = values;
        if(++count === length) {
            console.log(values);
            resolve(values);
        }
    }
}

Promise.race = function(promises) {
    return new Promise((resolve,reject)=>{
        promises.forEach((promise,index)=>{
            promise.then(resolve,reject);
        });
    });
}

Promise.prototype.catch = function(onRejected) {
    return this.then(null,onRejected);
}

Promise.resolve = function(value) {
    return new Promise((resolve,reject)=>{
        resolve(value);
    });
}

Promise.reject = function(reason) {
    return new Promise((resolve,reject)=>{
        reject(reason);
    });
}


Promise.deferred = function() {
    let defer = {};
    defer.promise = new Promise((resolve,reject)=>{
        defer.resolve = resolve;
        defer.reject = reject;
    });

    return defer;
}

try {
    module.exports = Promise;
} catch (e) {
    
}