const xid = require("xid");

exports.generateRef = async (id) => {
  //generate new key
  let UAK = "SWP-" + xid.generateId() + id;
  return UAK;
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
