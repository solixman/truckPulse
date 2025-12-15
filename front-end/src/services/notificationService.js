let subscriber = null;
export function subscribeNotification(cb) {
  subscriber = cb;
  return () => {
    if (subscriber === cb) subscriber = null;
  };
}
export function notify(message, type = "error") {
  if (subscriber) subscriber({ id: Date.now(), message, type });
  else console.warn("Notification:", message);
}
