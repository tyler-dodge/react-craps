
export function main(event, _, callback) {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  event.response.autoVerifyPhone = true;
  callback(null, event);
}
