const sessionMap = new Map();

module.exports = {
  getSessionId: async (username) => sessionMap.get(username),
  setSessionId: async (username, sessionId) => sessionMap.set(username, sessionId),
  clearSession: async (username) => sessionMap.delete(username),
  invalidateSession: (sessionId) => {
    // 簡易作法：不實際移除 session，只是記錄中刪除
    for (const [user, sid] of sessionMap.entries()) {
      if (sid === sessionId) sessionMap.delete(user);
    }
  }
};