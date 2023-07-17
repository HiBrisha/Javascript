//Titile: Learning code Javascript
//Author: Hieu Nguyen Minh
//Version: 1.0.0
//Description: Dùng để thực hành viết code javascript

//=====================***=============================//
//import thư viện
const mssql = require("mssql");
const fs = require("fs");
const MySqlServer = require("./sql_class.js");
const dataProcess = require("./json_data_process.js");

//Khai bao thong tin ket noi
const connection = new MySqlServer(
  "192.168.54.201",
  "xhquser",
  "xhquser",
  "AV_QLKT_INFO",
  mssql
);

//ket noi database
connection.connect((err) => {
  if (err) {
    return;
  }

  //query database
  connection.excuteQuery(
    "SELECT [ASSETID],[ASSETID_PARENT],[ASSETID_ORG],[ASSETDESC]FROM [AV_QLKT_INFO].[dbo].[A_ASSET]",
    (err, result) => {
      if (err) {
        return;
      }
      //Xử lý dữ liệu
      const rootData = new dataProcess(result);
      const filePath = "output.txt";

      exportToTxt(rootData.selectParents(), filePath);

      //Ngắt kết nối database
      connection.disconnect((err) => {
        if (err) {
          return;
        }
      });
    }
  );
});

function buildHierarchy(data) {
  const hierarchy = {};

  // Tạo một mảng các đối tượng cha (parent) chưa được xác định
  const parents = data.filter((item) => item.ASSETID_PARENT === null);

  // Điều chỉnh các đối tượng con (children) cho mỗi đối tượng cha
  parents.forEach((parent) => {
    parent.children = findChildren(parent.ASSETID, data);
  });

  // Xây dựng đối tượng hierarchy với đối tượng cha chưa được xác định
  hierarchy.parents = parents;

  return hierarchy;
}

function findChildren(parentId, data) {
  const children = data.filter((item) => item.ASSETID_PARENT === parentId);

  // Điều chỉnh các đối tượng con (children) cho mỗi đối tượng con
  children.forEach((child) => {
    child.children = findChildren(child.ASSETID, data);
  });

  return children;
}

function exportToTxt(data, filePath) {
  const content = JSON.stringify(data, null, 2);

  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      console.error("Lỗi khi ghi file:", err);
      return;
    }
    console.log("Xuất dữ liệu thành công vào file:", filePath);
  });
}
