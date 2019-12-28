const PENDING = 'pending';
const FULFILLED = 'onFulFilled';
const REJECT = 'rejected';

function Promise(excutor) {
    const that = this;
    that.value = undefined;
    that.reason = undefined;
    that.onFulFilledCallback = [];
    that.onRejectCallback = [];
    that.status = PENDING;

    function resolve(value) {
        if(value instanceof Promise) {
            value.then(resolve,reject);
        }

        setTimeout(()=>{
            if(that.status === PENDING) {
                that.value = value;
                that.status = FULFILLED;
                that.onFulFilledCallback.forEach(cb => cb(that.value));
            }
        },0);
    }

    function reject(reason) {
        setTimeout(()=>{
            if(that.status === PENDING) {
                that.status = REJECT;
                that.reason = reason;
                that.onRejectCallback.forEach((cb)=>cb(that.reason));
            }
        },0);
    }

    try {
        excutor(resolve,reject);
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = (onFullFilled,onRejected)=>{
    const that = this;
    let newPromise;
    if(that.status === FULFILLED) {
        // 问：既然已经是 FULFILLED 的状态了，为何还要异步执行？
        // 答：调用 promise.then(()=>{},{}); 都会返回一个新的 promise，这个新的 promise 
        // 也可能继续调用 then 方法，并注册新的 onFullFilled 和 onRejected，如果直接同步执行
        // 那么 then 方法注册函数的过成就在执行之后，这样就会导致回调队列断裂,后续注册的方法永远不会被调用。
        // 使得 promise 失去应有的威力。
        return newPromise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                try {
                    let  x = onFullFilled(that.value);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            },0);
        });
    }

    if(that.status === REJECT) {
        return newPromise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                try {
                    const x = onRejected(that.reason);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            },0);
        });
    }

    if(that.status === PENDING) {
        return newPromise = new Promise((resolve,reject)=>{
            that.onFulFilledCallback.push((value)=>{
                try {
                    let x = onFullFilled(value);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            });
            that.onRejectCallback.push((reason)=>{
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

Promise.prototype.catch = (reject)=>{
    this.then(null,reject);
}

Promise.resolve = (value)=>{
    return new Promise((resolve,reject)=>{
        resolve(value);
    });
}



Promise.reject = (reason)=>{
    return new Promise((resolve,reject)=>{
        reject(reason);
    });
}


function resolvePromise(promise,x,resolve,reject) {
    if(promise === x) {
        return reject(new TypeError('循环引用错误！'));
    }
    // 使用 called 原因是 thenable 对象没有状态管理机制，故作补充  
    let called = false;
    if(x instanceof Promise) {
        if(x.status === PENDING) {
            x.then((value)=>{
                resolvePromise(promise,value,resolve,reject);
            },(reason)=>{
                reject(reason);
            });
        }else{
            // 这种情况就是 then 方法中  FULFILLED ，REJECT 对应的状态
            x.then(resolve,reject);
        }
    }else if(x!== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            const then = x.then;
            if(typeof then === 'function') {
                then.call(x,(value)=>{
                    if(called) return;
                    called = true;
                    resolvePromise(promise,value,resolve,reject);
                },(reason)=>{
                    if(called) return;
                    called = true;
                    reject(reason);
                });
            }else{
                resolve(x);
            }
        } catch (error) {
            if(called) return;
            called=true;
            reject(error);
        }
    }else{
        resolve(x);
    }
}

Promise.all = (promises)=>{
    if(Array.isArray(promises)) {
        new Promise((resolve,reject)=>{
            const done = gen(promises.length,resolve);
            promises.forEach((promise,index)=>{
                promise.then((value)=>{
                    done(index,value);
                },reject);
            });
        });
    }
}

function gen(len,resolve) {
    let result = [];
    return function(index,value) {
        result[index] = value;
        if(result.length === len) {
            resolve(result);
        }
    }
}

Promise.race = (promises)=>{
    if(Array.isArray(promises)) {
        return new Promise((resolve,reject)=>{
            promises.forEach((promise)=>{
                promise.then((value)=>{
                    // 无需担心 resolve 被多次调用 ，因为新生成的 promise 自有其状态不可改变性质
                    // 一旦 resolve 被调用一次，后续都会被拦击掉
                    resolve(value);
                },reject);
            });
        });
    }
}


Promise.done = ()=>{}