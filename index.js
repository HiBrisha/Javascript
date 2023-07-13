function Car(make, module, year, owner) {
  this.make = make;
  this.module = module;
  this.year = year;
  Object.assign(this, owner);
}

function Owner(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}

const Ken = new Owner("Ken Honer", "23", "M");
const myCar = new Car("Ferrari", "Talon Tsi", "2023", Ken);
console.log(myCar);
