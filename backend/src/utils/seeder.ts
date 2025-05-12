import bcrypt from "bcryptjs";
import User from "../models/User.model";

export const seedUsers = async () => {
  try {
    const usersCount = await User.count();
    if (usersCount === 0) {
      console.log(`Seeding initial users....`);
    }

    //   create leader
    const hashedPasswordLeader = await bcrypt.hash("leader123", 10);
    await User.create({
      name: "Admin Leader",
      username: "Leader_2",
      password: hashedPasswordLeader,
      role: "leader",
    });

    //   create team_fu
    const hashedPasswordTeamFU = await bcrypt.hash("teamfu123", 10);
    await User.create({
      name: "Team FU User",
      username: "teamfu",
      password: hashedPasswordTeamFU,
      role: "team-fu",
    });
  } catch (error) {
    console.log(error);
  }
};
