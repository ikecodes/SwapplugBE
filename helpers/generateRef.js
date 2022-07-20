const User = require("../models/userModel");
const xid = require("xid");

exports.generateRef = async (id) => {
  //generate new key
  let TREF = "SWP-" + xid.generateId() + id;
  return TREF;
};
exports.generateReferralCode = async () => {
  //generate new key
  let CODE = "USP-" + xid.generateId();

  //check for clashes & regenerate
  let clashingAccount = await User.findOne({ referralCode: CODE });
  if (clashingAccount) {
    while (true) {
      CODE = "USP-" + xid.generateId();
      clashingAccount = await User.findOne({ referralCode: CODE });
      if (!clashingAccount) break;
    }
  }
  return CODE;
};

// exports.generateRef = async () => {
//   //generate new key
//   let UAK = "SW-" + nanoid() ;
//   //check for clashes & regenerate
//   let clashingAccount = await Profile.findOne({ access_key: UAK });
//   if (clashingAccount) {
//     while (true) {
//       UAK = "BZL-" + nanoid();
//       clashingAccount = await Profile.findOne({ access_key: UAK });
//       if (!clashingAccount) break;
//     }
//   }
//   return UAK;
// };
