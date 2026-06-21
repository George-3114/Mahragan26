const Team = require("../models/Team");
const TeamScore = require("../models/TeamScore");
const scoring = require("../constants/scoring");

const createTeamScore = async ({
  teamId,
  category,
  points,
  description,
  adminId,
}) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error("Team not found");
  }

  let awardedPoints = points;

  if (
    awardedPoints === undefined ||
    awardedPoints === null
  ) {
    awardedPoints =
      scoring.team[category] || 0;
  }

  const score = await TeamScore.create({
    team: teamId,
    category,
    points: awardedPoints,
    description,
    awardedBy: adminId,
  });

  team.totalPoints += awardedPoints;

  await team.save();

  return score;
};

module.exports = {
  createTeamScore,
};