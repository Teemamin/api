const mongoose = require('mongoose')
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please Provide title'],
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please Provide Post content'],
        minLength: 10,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft',  'published'],
        default: 'draft',
      },
    comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
      }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
      },
      imagePath: {type: String},
    },
    { timestamps: true }

)


module.exports = mongoose.model('Post', PostSchema)