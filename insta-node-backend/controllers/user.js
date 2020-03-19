const model = require("../models");
const jwtHandler = require("../jwtHandler");
const schema = require("../schemas")

class user{
    constructor(){
        // console.log(this, "inside constructor")
        // const $this = this;
    }


    // async checkInstaHandle(instaHandle){
    //     const user = await model.user.get({"instaHandle":instaHandle})
    //     if(user[0]!=null){
    //         return true
    //     }
    //     else{
    //         return false
    //     }
    // }

    async update(req, res){
        
        var exists = false
        if(jwtHandler.tokenVerifier(req.headers.token)){
            let instaHandle = req.body.instaHandle
            if (instaHandle != null){
                console.log(this, "inside update")
                let user = await model.user.get({"instaHandle":instaHandle});
                if(user[0]!=null){
                    exists = true
                }
                else{
                    exists = false
                }
                
                // console.log(instaHandle, "instahandle")
                // exists = user.checkInstaHandle({instaHandle})
            }
            try{
                
                if(exists==false){
                    
                    let updateObject  = {}; 
                    updateObject = {...updateObject,...req.body};
                    const userObj = await model.user.update({ _id: req.params.id}, updateObject);
                    res.status(200).send(userObj);
                }
                else{
                    res.status(406).send({"message":"InstaHandle already exists..so it cannot be updated!!"});
                }
            }
            catch(error)
            {
                res.status(401).send({"message":"Unauthorized"});
            }
        }

        else{
            res.status(401).send({"message":"Unauthorized"});
        }
    }

    async deleteAccount(req, res){
        const token=jwtHandler.tokenVerifier(req.headers.token);
        if(token)
        {
            console.log(token, "my token----->>")
            console.log("recieved token")
            const deleteObj=await model.user.delete({ _id: req.params.id});
            res.send(deleteObj); 
        }
        else{
            res.status(401).send("Unauthorized");
        }

    }

    async show(req, res){
        console.log(req.body);
        if(jwtHandler.tokenVerifier(req.headers.token)){
            var obj = req.query
            console.log(obj)
            if (obj.id !=  "null"){
                
                var userObj = await model.user.get({"_id": obj.id}, 
                    {
                        "instaHandle": 1,
                        "name": 1,
                        "profileImage": 1,
                        "about": 1,
                        "postsCount": 1,
                        "followers": 1,
                        "following": 1,
                        "_id":1
                    });
            }
            else{
                userObj = await model.user.get({"instaHandle": obj.instaHandle}, 
                    {
                        "instaHandle": 1,
                        "name": 1,
                        "profileImage": 1,
                        "about": 1,
                        "postsCount": 1,
                        "followers": 1,
                        "following": 1,
                        "_id":1
                    });
            }
            
            if (userObj[0] != null){                           
                res.status(200).send(userObj);
            }
            else{
                res.status(404).send({
                    "message":"not a user"
                })
            }
        }
        else{
            res.status(401).send({"message" :"Unauthorized"});
        }
    }    

    async showAll(req, res){
        const token=jwtHandler.tokenVerifier(req.headers.token);
        if(token)
        {
            const userObj = await model.user.get();
            res.send(userObj);
        }
        else{
            res.status(401).send("Unauthorized");
        }
    }
    // async show(req, res){
    //     const token=jwtHandler.tokenVerifier(req.headers.token);
    //     if(token)
    //     {
    //         const userObj = await model.user.get({_id: req.params.id});
    //         res.send(userObj);
    //     }
    //     else{
    //         res.status(401).send("Unauthorized");
    //     }
    // }
}
module.exports = new user();