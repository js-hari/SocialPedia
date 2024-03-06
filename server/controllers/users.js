import User from "../models/User.js";


/* READ*/  
export const getUser = async (req,res) =>{
    try{

        const {id} = req.params;
        const user = await User.findById(id);
        req.status(200).json(user);

    }catch(err){
        res.status(404).json({error: err.messsage});
    }
}


export const getUserFriends = async (req,res) =>{
try{
    const {id} = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
    );

    const formattedFriend = friends.map(
        ({ _id, firstname, lastName, occupation, location, picturePath}) => {
            return { _id, firstname, lastName, occupation, location, picturePath};
        }
    );

    res.status(200).json(formattedFriend); 
    
} catch(err){
    res.status(404).json({error: err.message});
}
};


/* UPDATE */ 

export const addRemoveFriend = async (req,res) =>{
        try {
            const {id, friendId} = req.params;
            const user = await User.findById(id);
            const friend = await User.findById(friendId);

            if(user.friends.includes(friendId)){
                user.friends = user.friends.filter((id) => id !== friendId);
                friend.friends = user.friends.filter((id) => id !== id);
            }

            else{
                user.friends.push(friendId);
                friend.friends.push(id);
            }
            await user.save();
            await friend.save();

            const friends = await Promise.all(
                user.friends.map((id) => User.findById(id))
            );
        
            const formattedFriend = friends.map(
                ({ _id, firstname, lastName, occupation, location, picturePath}) => {
                    return { _id, firstname, lastName, occupation, location, picturePath};
                }
            );
            res.status(200).json(formattedFriend);
            
        } catch(err){
            res.status(404).json({error: err.message});
        }
    } 
