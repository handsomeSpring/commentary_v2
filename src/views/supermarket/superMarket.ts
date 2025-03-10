interface GoodsInterface{
    name:string,
    price:number,
    num:number,
    type:string,
    id:number,
    description:string,
    information:string
}
interface insGoodsInterface extends GoodsInterface {
    increaseNum: () => number
    decreaseNum: () => number
    getTotalMoney: () => number
    clearNum: () => void
}
// 商品
class Goods {
    name:string;
    price:number;
    num:number;
    type:string;
    id:number;
    description:string;
    information:string
  constructor(  Object:GoodsInterface ){
    const { name,price,type, num,description,information,id } = Object
     this.name = name;
     this.price = price;
     this.type = type;
     this.num = num || 0;
     this.id = id;
     this.description = description;
     this.information = information;
  }
  getTotalMoney(){
    return this.num * this.price;
  }
  increaseNum(){
    this.num ++;
  }
  decreaseNum(){
    if(this.num > 0){
        this.num --;
    }
  }
  clearNum(){
    this.num = 0;
  }
}

// 购物车
class Car {
    insCollect:insGoodsInterface[]; //商品示例集合
    lowerPrice:number; //最低消费
    totalNum:number; 
    totalPrice:Ref<number>;
    constructor(insCollect:insGoodsInterface[],lowerPrice:number){
       this.insCollect = insCollect;
       this.lowerPrice = lowerPrice;
       this.totalNum = 0;
       this.totalPrice = ref(0);
    }
    getTotalNum(){
        this.totalNum =  this.insCollect.reduce((a:number, b:GoodsInterface) => a + b.num,0);
    }
    getTotalPrice(){
        this.totalPrice.value = this.insCollect.reduce((a:number, b:insGoodsInterface) => a + b.getTotalMoney(),0);
    }
    // 是否超过lowerPrice
    isExceedLowerPrice():boolean{
      return this.totalPrice.value >= this.lowerPrice;
    }
    fillInstance(ins:insGoodsInterface[]){
      this.insCollect = ins;
    }
    // 清空购物车
    clearCart():void{
      this.insCollect.forEach((item:insGoodsInterface) => {
        item.clearNum();
      })
    }
    // 拼凑ids
    getGoodsIds(){
      const filterArray = this.insCollect.filter((ins:GoodsInterface) => ins.num > 0);
      const result:number[] = [];
      filterArray.forEach((instance:GoodsInterface) => {
        for(let i = 0 ; i < instance.num; i++){
          result.push(instance.id);
        }
      });
      return result;
    }
}
export { Goods, Car }
export default insGoodsInterface;