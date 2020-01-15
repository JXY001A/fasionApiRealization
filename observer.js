/*
 * @description: 发布订阅模式
 * @author: JXY
 * @Date: 2020-01-15 10:54:40
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2020-01-15 11:33:00
 */

//  发布者
class Publisher {

    constructor() {
        this.observers = [];
    }

    add(observer) {
        this.observers.push(observer);
    }

    remove(observer) {
        const observerIndex = this.observers.indexOf(observer);
        if(observerIndex !== -1) {
            this.observers.split(observerIndex,1);
        }
    }

    notify() {
        this.observers.forEach((observer)=>{
            if(typeof observer.update === 'function') {
                observer.update(this);
            }
        });       
    }
}

// 订阅者
class Observer {
    constructor() {}
    update() {}
}



class PrdPublisher extends Publisher {
    constructor() {
        // 初始化需求文档
        this.prdState = null
        this.observers = [];
    }

    getState() {
        return this.prdState;
    }
    setState(state) {
        this.prdState = state;
        this.notify();
    }
}

class ObserverDeveloper extends Observer {
    constructor() {
        this.prdState = {};
    }

    update(publisher) {
        this.prdState = publisher.getState();
        this.work();
    }

    work() {
        const prd = this.prdState;
        console.log('996 beigns……');
    }
}

const publisher = new PrdPublisher();
const observerA = new ObserverDeveloper();
const observerB = new ObserverDeveloper();
const observerC = new ObserverDeveloper();

const prd = {
    // 具体的需求内容
    //...
}

publisher.add(observerA);
publisher.add(observerB);
publisher.add(observerC);

// 更新需求，并通知所有监听者
publisher.setState(prd);

