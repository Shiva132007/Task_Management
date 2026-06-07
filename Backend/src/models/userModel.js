import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Schema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true   
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
}
)

Schema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

Schema.methods.matchPassword=async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
};

Schema.methods.generateToken=function(){
    return jwt.sign(
        { user: { id: this._id, name: this.name, email: this.email } },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

const UserSchema=mongoose.model("User",Schema);

export default UserSchema;
