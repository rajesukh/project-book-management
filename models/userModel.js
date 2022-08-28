const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    
        title: {
            type: String, 
            require :true,
            enum : ['Mr', 'Mrs', 'Miss'],
        },


        name: {

            type : String,
            require: true
        },


        phone: {
            type: String, 
            require: true,
            unique: true
        },
        email: {
            type : String,
             required : true,
             unique : true,
        }, 


        password: {
            type : String,
            required : true,
             
          },



        address: {
          street:{ 
          type: String,
          trim:true
         },
          city: {
          type: String,
          trim:true
          },
          pincode: {
          type: String,
          trim:true
         },
        
        },


      
    
},{timestamps: true} );

module.exports = mongoose.model('User', userSchema)