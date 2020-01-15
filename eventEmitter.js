/*
 * @description:  EventBus/EventEmitter 实现
 * @author: JXY
 * @Date: 2020-01-15 10:13:01
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2020-01-15 10:37:37
 */
class EventEmitter{
    
    constructor() {
        this.handler = {};
    }

    on(eventName,cb){
        if(this.handler[eventName] === undefined) {
            this.handler[eventName] = [];
        }
        this.handler[eventName].push(cb);
    }

    emit(eventName,...args) {
        if(this.handler[eventName] !== undefined) {
            this.handler[eventName].forEach(cb => {
                cb(...args);
            });
        }
    }

    off(eventName,cb) {
        if(this.handler[eventName] !== undefined) {
            const cbIndex = this.handler[eventName].indexOf(cb);
            if(cbIndex !== -1) {
                this.handler[eventName].split(cbIndex,1);
            }
        }
    }

    once(eventName,cb) {
        this.on(eventName, function wrap(...args) {
            cb(...args);
            this.off(eventName,wrap);
        });
    }
}