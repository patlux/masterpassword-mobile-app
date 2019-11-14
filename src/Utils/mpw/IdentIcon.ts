import {
  COLOR,
  COLORS,
  leftArm,
  body,
  rightArm,
  accessory
} from "./IdentIconConstants";

function generate(fullName: string, password: string): [COLOR, string] {
  var crypto = require("crypto");

  const hex = crypto
    .createHmac("SHA256", password)
    .update(fullName)
    .digest("hex");

  const seed = Uint8Array.from(Buffer.from(hex, "hex"));

  const color = COLORS[seed[4] % COLORS.length];
  const text = [
    leftArm[seed[0] % leftArm.length],
    body[seed[1] % body.length],
    rightArm[seed[2] % rightArm.length],
    accessory[seed[3] % accessory.length]
  ].join("");

  return [color, text];
}

export default generate;
