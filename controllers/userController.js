const userModel = require("../models/userModel")

const jwt = require("jsonwebtoken")

const checkEmail = require("email-validator");
// const bookModel = require("../models/bookModel");



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "number") return false;
    return true;
  };
const isValidTitle = function (value) {
    return ["Mr", "Mrs", "Miss"].indexOf(value) != -1
};

//❌❌❌❌❌❌❌❌❌❌========= User Creation ========❌❌❌❌❌❌❌❌❌❌//

const createUser = async (req,res) =>{

    try {
        let getUsersData = req.body
        if(!Object.keys(getUsersData).length > 0) return res.status(404).send({
            status:false,
            message:"Please Enter Data To Create User"
        })
        getUsersData = JSON.parse(JSON.stringify(getUsersData).replace(/"\s+|\s+"/g,'"'))
        let {title,name,phone,email,password,address} =getUsersData
        if(!title ) return res.status(400).send({status: false, message: "Title is missing Please enter title"});    
        if(!isValidTitle(title)) { 
        return res.status(400).send({status: false, message: "Please Enter Valid title bitween One of them  'Mr','Mrs','Miss'"});  
        } 
        const regexValidator = function(val){
            let regx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
            return regx.test(val);
        }
        if(!(isValid(name))) return res.status(400).send({
            status:false,
            message:"Name is Missing"
        });
        if(!(regexValidator(name))) return res.status(400).send({
            status:false,
            message:"Plaese Enter Valid Name with Only alphabet"
        });

        const phoneRegex = /^[6-9]\d{9}$/gi;
        let usedPhone = await userModel.findOne({phone:phone})
        if(usedPhone){
            return res.status(400).send({
                status:false , message: " Phone is allready Used Please Use Another Phone"
        })
        }

        if(!(isValid(phone))) return res.status(400).send({
            status:false,
            message:"Phone number is missing "
        });
        if(!(phoneRegex.test(phone))) return res.status(400).send({
            status:false,
            message:"Please Enter Valid phone Number"
        });


        let usedEmail = await userModel.findOne({email:email})
        if(usedEmail){
            return res.status(400).send({status:false, message:"email already in use"})
        }

        if(!(isValid(email))) return res.status(400).send({
            status:false,
            message:"Email is Missing "
        });
        if(!(checkEmail.validate(email))) return res.status(400).send({
            status:false,
            message:" Please Enter Valid Email"
        });

        const checkPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/;

        if(!(isValid(password))) return res.status(400).send({
            status:false,
            message:"Password is missing or Please Enter Valid Password Minumum 8 Character and Maximum 15 "
        });
        if(!(checkPassword.test(password))) return res.status(400).send({
            status:false,
            message:"Password is missing or Please Enter Valid Password Minumum 8 Character and Maximum 15 "
        });

        if(address){
            let key= Object.keys (address)
    
    for(let i=0; i<key.length; i++){
       if(address[key[i]].length==0)
      return res.status(400).send({status: false, message: "Enter valid inforamtion in address "})
    }

        if (!/^([a-zA-Z0-9 ]{2,50})*$/
        .test(address.street)) {
            return res.status(400).send({
              status: false,
              message: "Street should be Valid and Its alphabetic and Number",
            });
          }
        let cityRegex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
        if (!cityRegex.test(address.city)) {
            return res.status(400).send({status:false, message:"city name should be valid. contain only alphabets"})
        }
        if (!/^\d{6}$/.test(address.pincode)) {
            return res.status(400).send({
              status: false,
              message: "Pincode should have only 6 digits. No alphabets",
            });
          }

        if(!(address && typeof address === 'object'&& Object.keys(address).length==3)) return res.status(400).send({
            status:false,
            message:"Sub field is missing in address"
        });
    }

        let savedData = await userModel.create(getUsersData);
        res.status(201).send({
            status:true,  message:"User Created Successfully", data: savedData
        })

    } 
    catch (error) {
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
        
    }
};


//❌❌❌❌❌❌❌❌❌❌=========== User Login ==========❌❌❌❌❌❌❌❌❌❌//

const loginUser = async (req,res)=> {
    try {
          let {email,password} = req.body
         if(!email)  return res.status(400).send({
            status:false,
            message:"  Email is Required "
         });
         if(!password) return res.status(400).send({
            status:false,
            message: " Password is Required "
         })

        let  user = await userModel.findOne({email:email,password:password});
        if(!user) return res.status(400).send({
            status:false,
            message:" Valid Email and Password is Required "
        });

        let token = jwt.sign({
            userId : user._id.toString(),
            iat: Math.floor(Date.now() / 1000),
                exp : Math.floor(Date.now() / 1000 + 10*60*60),

        }, `functionUp-project-3`
        ) ;

        res.setHeader('x-api-key' , token)
        console.log(token)
        return res.status(200).send({
            status:true, data: token,
            message:"User Loggedin Successfully"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
    }
};

module.exports = {createUser,loginUser}