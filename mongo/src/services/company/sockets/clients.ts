import io from "@libs/socketio";

export const reloadCompany = (userId: number, params: {}) => {
  return io.emit(`company:${userId}`, params);
};

export const reloadCompanies = () => {
  return io.emit(`company`);
};
