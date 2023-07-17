//Titile: Learning code Javascript
//Author: Hieu Nguyen Minh
//Version: 1.0.0
//Description: Tạo class xử lý dữ liệu

//==========================******==============================//
//==================tạo class=========================//
class dataProcess {
  //==================khai báo cấu trúc=========================//
  constructor(data) {
    this.data = data;
  }

  //==================tạo mảng=========================//
  selectParents() {
    //console.log(this.data);
    //==================Lọc lấy thiết bị cha=========================//
    this.dataFilter1 = this.data.filter((item) => item.ASSETID_PARENT === null);

    //==================Lọc các thiết bị đã xóa=========================//
    this.dataParents = this.dataFilter1.filter(
      (item) => !item.ASSETDESC.includes("(Da xoa)")
    );

    //==================Thêm children vào item (dùng vòng lặp forEach)=========================//
    this.dataParents.forEach((item) => {
      item.children = addChildren(this.data, item.ASSETID);
    });

    return this.dataParents;
  }
}

function addChildren(data, parentID) {
  const children = data.filter(
    (item) =>
      item.ASSETID_PARENT === parentID && !item.ASSETDESC.includes("(Da xoa)")
  );

  if (children.length > 0) {
    children.forEach((child) => {
      child.children = addChildren(data, child.ASSETID);
    });
  }

  return children;
}
module.exports = dataProcess;
