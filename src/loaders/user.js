export const batchUsers = async (keys, db) => {
    const users = await db.User.findAll({
      where: {
        id: keys
      },
    });
    return keys.map(key => users.find(user => user.id === key));
  };