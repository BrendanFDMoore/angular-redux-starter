var fs = require("fs");
var util = require('util');

module.exports = (username, password, done)=>{
  var contents = fs.readFileSync("./server/users.json");
  console.log("Output Content : \n"+ contents);
  var jsonContent = JSON.parse(contents);

  console.log(util.inspect(jsonContent, {showHidden: false, depth: null}));

  console.log("Parsed json: \n"+ jsonContent);
  console.log("\n *EXIT* \n");

  jsonContent.map(u => console.log(u.Username));

  if (username && password){
    const filtered = jsonContent.filter(
      function(user){
        return (user.Username=== username) 
        && (user.Password=== password);
      });
    console.log("filtered:\n"+filtered);
    if (filtered.length>0)
      done(null, {
        id: "user_id_12345",
        data:{msg:"LOGIN SUCCESSFUL"},
        meta:{token:"abcd1234",
          expires:"2020-01-01"}
        }
      );
    else
      return done(null, false, { message: 'Incorrect username or password.' });
  }
  else
    return done(null, false, { message: 'Incorrect username or password.' });
};
