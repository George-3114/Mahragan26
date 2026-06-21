const User = require("../models/User");
const IndividualScore = require("../models/IndividualScore");
const scoring = require("../constants/scoring");

const createScore = async ({
  participantId,
  category,
  points,
  description,
  adminId,
}) => {
  const user = await User.findById(participantId);

  if (!user) {
    throw new Error("Participant not found");
  }

  let awardedPoints = points;

  if (
    awardedPoints === undefined ||
    awardedPoints === null
  ) {
    awardedPoints =
      scoring.individual[category] || 0;
  }

  const score =
    await IndividualScore.create({
      participant: participantId,
      category,
      points: awardedPoints,
      description,
      awardedBy: adminId,
    });

  user.totalPoints += awardedPoints;

  await user.save();

  return score;
};

module.exports = {
  createScore,
};