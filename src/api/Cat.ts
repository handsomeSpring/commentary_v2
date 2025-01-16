abstract class Cat{
    constructor(public name: string, public age:number, public feature:string){}
    abstract startMeeting(): void; 
    abstract accompany(host:string , duration:number): string; 
    abstract endMeeting():void;
}

class BlueWhiteCat extends Cat{
    super(name:string, age:number, feature:string){
        this.name = name;
        this.age = age;
        this.feature = feature;
    }
    startMeeting(): void {
        console.log("欢迎来到这个世界：" + this.name);
    }
    accompany(host:string , duration:number):string{
        return `Stayed with ${host} for ${duration} year`;
    }
    endMeeting(): void {
        console.log("再见了，" + this.name);
    }
} 

const myCat = new BlueWhiteCat('汤圆', 2, 'cute')

export default myCat;