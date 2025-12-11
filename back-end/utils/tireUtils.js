


function removeDuplicates(tires) {
  let noneDuplicatesIds = [];
  let noneDuplicates = [];
  tires.forEach((t) => {
    if (!noneDuplicates.includes(t._id.toString())) {
      noneDuplicatesIds.push(t._id.toString());
      noneDuplicates.push(t);
    }
  });
  return noneDuplicates;
}

module.exports = { removeDuplicates };