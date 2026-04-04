const TRIGGERS_KEY = "disruptionTriggers";

const getAllTriggers = () => {
  return JSON.parse(localStorage.getItem(TRIGGERS_KEY) || "[]");
};

const saveAllTriggers = (triggers) => {
  localStorage.setItem(TRIGGERS_KEY, JSON.stringify(triggers));
};

export const createTrigger = ({ userId, triggerType, reason, weatherSnapshot }) => {
  const trigger = {
    id: `trg_${Date.now()}_${Math.floor(Math.random() * 999)}`,
    userId,
    triggerType,
    reason,
    weatherSnapshot,
    createdAt: new Date().toISOString()
  };

  const triggers = getAllTriggers();
  triggers.push(trigger);
  saveAllTriggers(triggers.slice(-200));

  return trigger;
};

export const getUserTriggers = (userId) => {
  return getAllTriggers()
    .filter((trigger) => trigger.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const hasRecentTrigger = ({ userId, triggerType, withinHours = 3 }) => {
  const threshold = Date.now() - withinHours * 60 * 60 * 1000;
  return getUserTriggers(userId).some(
    (trigger) =>
      trigger.triggerType === triggerType && new Date(trigger.createdAt).getTime() >= threshold
  );
};
