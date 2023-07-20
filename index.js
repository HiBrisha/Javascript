//Titile: Learning code Javascript
//Author: Hieu Nguyen Minh
//Version: 1.0.0
//Description: Dùng để thực hành viết code javascript

//=====================***=============================//
//import thư viện
const mssql = require("mssql");
const XLSX = require("xlsx");
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
      const data = rootData.selectParents();
      exportToExcel(data, "output.xlsx");

      exportToTxt(data, filePath);

      //Ngắt kết nối database
      connection.disconnect((err) => {
        if (err) {
          return;
        }
      });
    }
  );
});

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

function exportToExcel(data, filename) {
  const workbook = XLSX.utils.book_new();

  data.forEach((item) => {
    const sheetData = [];
    sheetData.push(item);

    sheetData.push(excelData(item));

    const sheetName = item.ASSETID; // Tên sheet con là ASSETID của phần tử cha
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  XLSX.writeFile(workbook, filename);
}

const excelData = (data, result = {}) => {
  result = {
    ...result,
    [`children_${data.level}.ASSETID`]: data.ASSETID,
    [`children_${data.level}.ASSETID_PARENT`]: data.ASSETID_PARENT,
    [`children_${data.level}.ASSETID_ORG`]: data.ASSETID_ORG,
    [`children_${data.level}.ASSETDESC`]: data.ASSETDESC,
  };
  if (data.children && data.children.length > 0) {
    data.children.forEach((child) => {
      // Đệ quy gọi lại hàm excelData cho mỗi phần tử con
      result = {
        ...result,
        [`children_${data.level}.ASSETID`]: data.ASSETID,
        [`children_${data.level}.ASSETID_PARENT`]: data.ASSETID_PARENT,
        [`children_${data.level}.ASSETID_ORG`]: data.ASSETID_ORG,
        [`children_${data.level}.ASSETDESC`]: data.ASSETDESC,
      };
      result = excelData(child, result);
    });
  }

  return result;
};
