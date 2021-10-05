const router = require('express').Router()

// const { query } = require('../connection/db');
const dbConnection = require("../connection/db");
const uploadFile = require("../middlewares/uploadFile");
const pathFile = "http://localhost:4000/uploads/";

router.get("/music", function (req, res) {
    res.render("music/music", {title: "Music", isLogin: true})
})

router.get("/addMusic", function (req, res) {
    res.render("music/addMusic", {title: "Add Music", isLogin: req.session.isLogin})
})

// insert data music
router.post("/addMusic", uploadFile("image"), function (req, res) {
    const { title, coverImage, music } = req.body;
    const userId = req.session.user.id;
    let image = req.file.filename;
    
    const query = "INSERT INTO tb_music(title, cover_music, music) VALUES (?,?,?)"

    if (title == "" || music == ""){
    req.session.message = {
        type: "danger",
        message: "Please fill this input",
    };
    res.redirect("/addMusic");
    return;
}

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [title, coverImage, music, userId], (err, result) => {
            if (err) throw err;
        
            req.session.message = {
                type: "success",
                message: "input music successfull",
            };
            res.redirect("/addMusic")
        });
        conn.release();
    });

});

// render show music page
router.get("/music", function (req, res) {
    const query = "SELECT * FROM tb_music";
  
    dbConnection.getConnection((err, conn) => {
      if (err) throw err;
  
      conn.query(query, (err, results) => {
        if (err) throw err;
  
        let musics = [];
  
        for (let result of results) {
          musics.push({
            ...result,
            image: "http://localhost:5000/uploads/" + result.image,
          });
        }
  
        res.render("index", { title: "Music", isLogin: req.session.isLogin, musics });
      });
  
      conn.release();
    });
  });


module.exports = router