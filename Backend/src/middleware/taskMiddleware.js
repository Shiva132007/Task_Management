import jwt from 'jsonwebtoken';

const protect=async(req,res,next)=>{
    const authHeader=req.get('Authorization');
    if(authHeader && authHeader.startsWith('Bearer')){
        try{
            const token=authHeader.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded.user || decoded;
            next();
        }
        catch(error){
            console.log(error);
            res.status(401).json({
                message:"Not authorized, token failed"
            })
        }
    }
    else {
        return res.status(401).json({ message: 'No token provided' });
    }
}

export default protect;
