const mongoose = require('mongoose')
const {Schema} = mongoose

const CommentSchema = new Schema({
    body: {
        type: String,
        required: [true, 'Please Provide comment'],
        minLength: 3,
        trim: true
    },
    user: {
        type: String,
        trim: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Please provide related post'],
      },

},
{ timestamps: true }
)

module.exports = mongoose.model('Comment',CommentSchema)