const Post = require('../model/post')
const Comment = require('../model/comment')
const BadRequestError = require('../errors/badRequest')
const {StatusCodes} = require('http-status-codes')
const checkPermissions = require('../util/checkPermissions')


exports.getAllPosts = async (req,res,next)=>{
    let postsQuery =  Post.find().lean()
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4
    const skip = (page - 1) * limit
    postsQuery= postsQuery.skip(skip).limit(limit)
    const posts = await postsQuery
    const transformedPosts = []
    for(const post of posts) {

        if(post.comments.length > 0){
        //    let commentDocs = await  Comment.find({_id: {$in: post.comments}})
        const numberOfComments = await Comment.aggregate([
            { "$match" : { "_id": { "$in": post.comments } } },
            {
                $count: "no_of_comments"
              }
          ])
           let commentsQuery=   Comment.find({_id: {$in: post.comments}}) // this can potentially be added to the aggregation for optimization
           commentsQuery= commentsQuery.limit(4)
           let commentDocs = await commentsQuery
            transformedPosts.push({...post,comments:commentDocs, noOfComments: numberOfComments[0].no_of_comments})
        }else {
            transformedPosts.push(post)
        }
    }
    const totalPosts = await Post.countDocuments({});
    const numOfPages = Math.ceil(totalPosts / limit); // can use this to display page btn in the frontend
    
    res.status(StatusCodes.OK).json(transformedPosts)
}

exports.getPost = async (req,res,next)=>{
    const postId = req.params.postId
    if(!postId){
        throw new BadRequestError('Post Id Must not be empty')
    }
    const post = await Post.findById({_id:postId})
    if(!post){
        throw new BadRequestError('Post not Found')
    }
    const numberOfComments = await Comment.aggregate([
        { "$match" : { "_id": { "$in": post.comments } } },
        {
            $count: "no_of_comments"
          }
      ])
    const commentQuery = Comment.find({_id: {$in: post.comments}})
    const commentDocs = await commentQuery.limit(4)
    post.comments = commentDocs
    res.status(StatusCodes.OK).json({post, numberOfComments})

}

exports.addPost = async (req,res,next)=>{
    const {title,content,status} = req.body

    if(!title || !content || !status){
        throw new BadRequestError('Please provide all values')
    }
    const userId = req.user.userId
    console.log(req.file)
    const post = await Post.create({title,content,status,createdBy:userId,imagePath: req.file.path  })

    res.status(StatusCodes.CREATED).json(post)
}

exports.editPost = async (req,res,next)=>{
    const postId = req.params.id
    const {title,content,status} = req.body

    if(!title || !content || !status){
        throw new BadRequestError('Please provide all values')
    }
    const post = await Post.findById({_id: postId})
    if(!post){
        throw new BadRequestError(`No post with ${postId} found`)
    }
    checkPermissions(req.user,post.createdBy)
    const updatedPost = await Post.findOneAndUpdate({_id: postId},req.body,{new:true,runValidators: true})

    res.status(StatusCodes.OK).json(updatedPost) //asked tega, do you need to generate JWT for responses to ensure longer validity
}
exports.commentPost = async (req,res,next)=>{
    const postId = req.params.commentId
    const {body} = req.body
    if(!body){
        throw new BadRequestError('Please provide comment content')
    }
    const post = await Post.findById({_id:postId})
    if(!post){
        throw new BadRequestError(`No post with ${postId} found, sorry comment cannot be added`)
    }

    const comment = await Comment.create({body,post:postId,user: req.user.userId})
    post.comments.push(comment)
    await post.save()
    res.status(StatusCodes.CREATED).json({post,comment}) //will fix this later to redirect to the post page
}

exports.deletePost = async (req,res,next)=>{
    const postId = req.params.id
    const post = await Post.findOne({_id: postId})
    if(!post){
        throw new BadRequestError(`No post with ${postId} found`)
    }
    checkPermissions(req.user,post.createdBy)
    await Comment.deleteMany({post:postId})
    await post.deleteOne()
   
    res.status(StatusCodes.OK).json({msg: 'Successfully Deleted Post'})
    
}

exports.getComments = async (req,res,next)=>{
    const postId = req.params.postId
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4
    const skip = page * limit
    let commentsQuery = Comment.find({post:postId})
    commentsQuery = commentsQuery.skip(skip).limit(limit)
    const comments = await commentsQuery
    res.status(StatusCodes.OK).json(comments)
}

exports.editComment = async (req,res,next)=>{
    const commentId = req.params.commentId
    const {body} = req.body
    if(!body){
        throw new BadRequestError('Please provide the comment body')
    }

   const comment = await Comment.findById({_id: commentId})
   if(!comment){
        throw new BadRequestError(`No comment with the id ${commentId} found`)
    }
  
   checkPermissions(req.user,comment.user)
   comment.body = body
   await comment.save()
    res.status(StatusCodes.OK).json(comment)
}

exports.deleteComment = async (req,res,next)=>{
    const commentId = req.params.commentId

   const comment = await Comment.findById({_id: commentId})
   if(!comment){
        throw new BadRequestError(`No comment with the id ${commentId} found`)
    }
  
   checkPermissions(req.user,comment.user)
  
   await comment.deleteOne()
    res.status(StatusCodes.OK).json({msg: 'Comment successfully deleted!'})
}