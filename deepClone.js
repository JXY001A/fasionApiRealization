/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-26 15:33:12
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2019-12-26 22:59:07
 */
const Utils = {
    isObject:(obj)=> Object.prototype.toString.call(obj) === "[object Object]",
    isArray:(obj)=> Object.prototype.toString.call(obj) === "[object Array]",
    isFunction:(obj)=> Object.prototype.toString.call(obj) === "[object Function]",
    isNull:(obj)=> Object.prototype.toString.call(obj) === "[object Null]",
    isUndefined:(obj)=> Object.prototype.toString.call(obj) === "[object Undefined]",
    isSymbol:(obj)=> Object.prototype.toString.call(obj) === "[object Symbol]",
    createData:(deep,breadth)=>{
        var data = {};
        let temp = data;
        for(let i=0;i<deep;i+=1) {
            temp = temp['data'] = {};
            for(let j=0;j<breadth;j+=1) {
                temp[j] = j;
            }
        }
        return data;
    },
    isPrimitive: val => Object(val) !== val,
    getInitData:function(data){
        if(this.isArray(data)) {
            return [];
        }else {
            return {};
        }
    }
};

const shallowClone = (source)=>{
    if(Utils.isNull(source) || Utils.isUndefined(source) || Utils.isSymbol(source) || Utils.isFunction(source)) return source;
    let target = null;

    if(Utils.isObject(source)) {
        target = {};
        for(let key in source) {
            if(source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;    
    }

    if(Utils.isArray(source)) {
        target = source.map(item=>item);
        return target;
    }

    return target;   
}

/* 弊端： 可能爆栈，没有解决循环引用的问题 */
const simpleDeepClone = (source)=>{
    if(typeof source !== 'object' || source === null ) return source;
    let target = null;
    if(Utils.isArray(source)) {
        target = source.map((item)=>{
            return simpleDeepClone(item);
        });
        return target;
    }

    if(Utils.isObject(source)) {
        target = {};
        for(let key in source) {
            target[key] = simpleDeepClone(source[key]);
        }
        return target;
    }
}


/* 总结：
    JSON 形式的拷贝，在深层的数据情况下依然有爆栈的可能性。它最终还是使用执行栈来处理。
    同时它还做了循环引用检测
*/
const cloneJson = (source)=> {
    return JSON.parse(JSON.stringify(source));
}
// 弊端： Symbol 类型 , undefined ,函数都是不支持拷贝的 
let a = {
	c:null,
	d:undefined,
	e:Symbol('clone'),
	f:()=>{},
	g:'data'
}
const cloneA  = cloneJson(a); 
// cloneA : {c: null, g: "data"}

/* 循环引用测试 cloneJson */
let b = {};
let c = {};
b.c = c;
c.b = b;
// 循环引用就会报出错误
cloneJson(b); //  Uncaught TypeError: Converting circular structure to JSON 


/* 破解爆栈大杀器，loop */
var d = {
    a1: 1,
    a2: {
        b1: 1,
        b2: {
            c1: 1
        },
        b3:{
            c2:1,
        }

    },
    a3:{
        b4:{},
        b5:{}
    }
}

const cloneLoop = (source)=>{
    // 基础数据类型直接返回
    if(Utils.isPrimitive(source)) return source;

    let root = Utils.getInitData(source);

    const stack = [{key:undefined,data:source,parent:root}];

    while(stack.length) {
        let node = stack.pop();
        let key = node.key,
            data = node.data,
            parent = node.parent;
        
            let res;
        if(key === undefined) {
            res = parent;
        }else{
            /* 整个代码中最为关键的一行代码，起到呈上起下的作用，数据连接的作用 */
            res = parent[key] = {};
        }

        for(let k in data) {
            if(typeof data[k] !== 'object') {
                res[k] = data[k];
            } else{
                stack.push({
                    key:k,
                    data:data[k],
                    parent:res
                });
            }
        } 
    }

    return root;
}

