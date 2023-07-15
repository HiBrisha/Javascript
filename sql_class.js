//Titile: Learning code Javascript
//Author: Hieu Nguyen Minh
//Version: 1.0.0
//Description: Tạo class

//==========================******==============================//
//==================tạo class cho thao tác với mssql=========================//
class MySqlServer {
  constructor(myServer, myUser, myPassword, myDatabase, mssql) {
    this.mssql = mssql;
    this.config = {
      server: myServer,
      user: myUser,
      password: myPassword,
      database: myDatabase,
      options: {
        encrypt: true, // Sử dụng kết nối mã hóa SSL
        trustServerCertificate: true, // Tắt xác nhận chứng chỉ (self-signed certificate)
      },
    };
  }

  //================== kết nối =======================//
  connect(callback) {
    this.mssql.connect(this.config, (err) => {
      err
        ? (console.error("Không thể kết nối:", err), callback(err))
        : (console.log("Kết nối thành công"), callback(null));
    });
  }

  //================== ngắt kết nối ====================//
  disconnect() {
    this.mssql.close();
  }

  excuteQuery(query, callback) {
    new this.mssql.Request().query(query, (err, result) => {
      err
        ? (console.error("Lỗi truy vấn:", err), callback(err, null))
        : callback(null, result.recordset);
    });
  }
}

module.exports = MySqlServer;
