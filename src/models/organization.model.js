const { model, Schema } = require('mongoose')

const OrganizationSchema = Schema({
   org_name: { type: String, required: true },
   org_description: { type: String },
   org_country: { type: String },
   org_city: { type: String },
   org_picture: { type: String },
   admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
})

OrganizationSchema.pre('findOneAndUpdate', async function () {
   this.update({}, { $set: { updatedAt: new Date() } })
})

module.exports = model('Organization', OrganizationSchema)
