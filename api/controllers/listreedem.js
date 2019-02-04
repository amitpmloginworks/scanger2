const reedem=require('../../routes/user');
const reedemcards=require('../../api/models/reedemcard')
exports.reedemcode=(req,res,next)=>{
reedemcards.find().populate('listplaces')
    .select('location listplaces').then(listplaces=>{
        return res.status(200).json({
            listplaces:listplaces
        })
    })
    
}