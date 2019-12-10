/*
 * @description: 数据双向绑定实现 
 * @author: JXY
 * @Date: 2019-12-10 21:39:09
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-10 22:33:18
 */
const input = document.getElementById('inputId');
const span = document.getElementById('spanId');
const data = {text:"default"};
Object.defineProperty(data,'text',{
    set(val) {
        // 详单与数据劫持，拦击 set 过程
        input.value  = val;
        span.innerHTML = val;
        return val;
    }
});

input.addEventListener('keyup',(e)=>{
    ImageData.text = e.target.value;
});

/* 数据劫持双向数据绑定: 实际就是拦截 set 的过程 */



/**
 * @description: 双向绑定 proxy 版本 
 * @author: JXY 
 * @Date: 2019-12-10 22:21:40
 */

const input = document.getElementById('input');
const span = document.getElementById('span');
const data1 = {text:"default"};

const handle = {
    set:(target,key,value)=>{
        target[key] = value;
        input.value  = value;
        span.innerHTML = value;
        return value;
    }
};

const proxy = new Proxy(data1, handle);

input.addEventListener('keyup',(e)=>{
    proxy.text = e.target.value;
});

/* 使用 proxy 代理实现双向数据绑定 */
// 使用代理：proxy.text = e.target.value;使用 proxy 将 handle 处理与 data1 连接起来
// 注意点：handle.set 转那个参数的问题：target,key ,value 。 个人感觉更优雅