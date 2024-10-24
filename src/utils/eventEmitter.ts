// 发布订阅模式

const eventNames = ['API:UN_AUTH','API:VALIDATE_ERROR'] as const;
type EventNames = (typeof eventNames)[number];

class EventEmitter {
   private listeners:Record<EventNames,Set<Function>> = {
    'API:UN_AUTH':new Set(),
    'API:VALIDATE_ERROR':new Set()
   }

   on(eventNames:EventNames,listeners:Function) {
    this.listeners[eventNames].add(listeners);
   }

   emit(eventNames:EventNames, ...args:any[]){
     this.listeners[eventNames].forEach((listener) => listener(...args))
   } 
}

export default new EventEmitter();