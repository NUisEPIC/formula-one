var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var binode = Schema({
  _parent:  { type: String,
              _id:  Schema.Types.ObjectId,
              required: true
            },
  _children: [{ type: String,
               required: true
             }]
})

binode.parent = function() {
  this._parent.type.findById(this._parent._id, function(err, parent) {
    handle(err)
    return parent
  })
}

var Binode = mongoose.model('Binode', binode)

module.exports.schema = binode
module.exports.model  = Binode
