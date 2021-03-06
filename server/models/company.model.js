import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';


const CompanySchema = new mongoose.Schema({

    name : {
        type: String , 
        required:true, 
        lowercase: true, 
    },
    code : {
        type: String, 
        required: true, 
        lowercase: true,
        unique: true
    },
    checklist: {
        type: [String]
    }

});

CompanySchema.statics = {
  /**
   * Get company
   * @param {ObjectId} id - The objectId of company.
   * @returns {Promise<Account, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((company) => {
        if (company) {
          return company;
        }
        const err = new APIError('No such company exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List companys in descending order of 'createdAt' timestamp.
   * @param {object} query - all query to be searched for.
   * @param {number} skip - Number of companies to be skipped.
   * @param {number} limit - Limit number of companies to be returned.
   * @returns {Promise<Account[]>}
   */
  list(query = {}, { skip = 0, limit = 50 } = {}) {
    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

export default mongoose.model('Company', CompanySchema);
