import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
    // 1.Check if authorization header is empty
    const authHeader = req.headers["authorization"];
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).send("No authorization details found");
    }

    // 2. To extract the credentials. [Basic qwertyyusdfghj345678(format)]
    const base64Credentials = authHeader.replace('Basic ', '');
    console.log(base64Credentials);

    // 3.Decode the credentials
    const  decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    console.log(decodedCredentials) //[username:password]
    const credentials = decodedCredentials.split(':'); 
    console.log(credentials);
    const user = UserModel.getAll().find(u => u.email == credentials[0] && u.password == credentials[1]);
    console.log(user)
    if(user){
        next();
    }else{
        return res.status(401).send("Invalid Credentials");
    }

}

export default basicAuthorizer;