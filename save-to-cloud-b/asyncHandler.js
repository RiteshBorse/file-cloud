export const asyncHandler = (fn) => async (req , res , next) =>{
    try {
        await fn(req , res , next)
    } catch (error) {
        console.log(error); 
        return res.status(500).send({
            message : "Internal server error",
            success : false
        })
    }
}