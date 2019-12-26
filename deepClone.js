/*
 * @description: 
 * @author: JXY
 * @Date: 2019-12-26 15:33:12
 * @Email: JXY001a@aliyun.com
 * @LastEditTime : 2019-12-26 17:11:16
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