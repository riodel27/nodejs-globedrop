const { model, Schema } = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = Schema(
   {
      username: { type: String },
      name: { type: String },
      email: { type: String, required: true },
      password: { type: String, required: true },
      language: { type: String },
      country: { type: String },
      userType: {
         type: String,
         enum: ['user', 'ngo_admin', 'super_admin'],
         default: 'user',
      },
      organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
      facebook: {
         type: Schema.Types.Mixed,
      },
      google: {
         type: Schema.Types.Mixed,
      },
   },
   {
      timestamps: true,
      versionKey: false,
   },
)

UserSchema.pre('save', async function (next) {
   const user = this
   user.password = user.password && (await bcrypt.hash(user.password.trim(), 12))
   next()
})

module.exports = model('User', UserSchema)
