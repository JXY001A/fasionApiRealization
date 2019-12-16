let PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected';

function Promise(excutor) {
    const that = this;
    that.status= PENDING,
    that.value = null,
    that.reason= null;
    
    that.FulFilledCallBack = [];
    that.RejectedCallBack = [];

    function resolve(value) {
        if(value instanceof Promise ) {
            return value.then(resolve,reject);
        }

        setTimeout(()=>{
            if(that.status === PENDING) {
                that.status = FULFILLED;
                that.value = value;
                that.FulFilledCallBack.forEach(callback => callback(that.value));
            }
        },0);
    }

    function reject(reason) {
        setTimeout(()=>{
            if(that.status === PENDING) {
                that.status = REJECTED;
                that.reason = reason;
                that.RejectedCallBack.forEach(callback => callback(that.reason));
            }
        },0);
    }

    try {
        excutor(resolve,reject);
    } catch (error) {
        reject(error)
    }
}

function resolvePromise(promise2,x,resolve,reject) {
    if(promis2 === x) {
        reject(new TypeError('循环引用'));
    }

    let called = false;
    if(x instanceof Promise) {
        if(x.status === PENDING) {
            x.then((y)=>{
                resolvePromise(promise2,y,resolve,reject);
            },(reason)=>{
                reject(reason);
            });
        }else{
            x.then(resolve,reject);
        }
    }else if(x!==null && (typeof x === 'object' || typeof x === 'function')){
        const then = x.then;
        if(typeof then === 'function') {
            try {
                then.call(x,(y)=>{
                    if(called) return;
                    called=true;
                    resolvePromise(promise2,y,resolve,reject);
                },(reason)=>{
                    if(called) return;
                    called=true;
                    reject(reason);
                });
            } catch (error) {
                if(called) return;
                called=true;
                reject(error);
            }
        }
    }else{
        resolve(x);
    }
}

Promise.prototype.then = function(onFulFilled,onRejected) {
    
    onFulFilled = typeof onFulFilled === 'function'? onFulFilled : ()=>{};
    onRejected = typeof onRejected === 'function'? onRejected : ()=>{};
    let newPromise,
        that = this;
    if(that.status === FULFILLED) {
        return  newPromise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                try {
                    let x = onFulFilled(that.value);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            },0);
        });
    }

    if(that.status === REJECTED) {
        return  newPromise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            },0);
        });
    }

    if(that.status === PENDING) {
        return newPromise = new Promise((resolve,reject) => {
            that.FulFilledCallBack.push((value)=>{
                try {
                    let x = onFulFilled(value);
                    resolvePromise(newPromise,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            });

            that.RejectedCallBack.push((reason)=>{
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
