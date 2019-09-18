import Crypto from 'crypto-js';

export const COLORS = <const>[
  'RED',
  'GREEN',
  'YELLOW',
  'BLUE',
  'MAGENTA',
  'CYAN',
  'MONO',
];
export type COLOR = typeof COLORS[number];

export const leftArm = ['╔', '╚', '╰', '═'];
export const rightArm = ['╗', '╝', '╯', '═'];
export const body = ['█', '░', '▒', '▓', '☺', '☻'];
export const accessory = [
  '◈',
  '◎',
  '◐',
  '◑',
  '◒',
  '◓',
  '☀',
  '☁',
  '☂',
  '☃',
  '☄',
  '★',
  '☆',
  '☎',
  '☏',
  '⎈',
  '⌂',
  '☘',
  '☢',
  '☣',
  '☕',
  '⌚',
  '⌛',
  '⏰',
  '⚡',
  '⛄',
  '⛅',
  '☔',
  '♔',
  '♕',
  '♖',
  '♗',
  '♘',
  '♙',
  '♚',
  '♛',
  '♜',
  '♝',
  '♞',
  '♟',
  '♨',
  '♩',
  '♪',
  '♫',
  '⚐',
  '⚑',
  '⚔',
  '⚖',
  '⚙',
  '⚠',
  '⌘',
  '⏎',
  '✄',
  '✆',
  '✈',
  '✉',
  '✌',
];

function generate(fullName: string, password: string): [COLOR, string] {
  // byte[] masterPasswordBytes = charset.encode( CharBuffer.wrap( masterPassword ) ).array();
  // ByteBuffer identiconSeedBytes = ByteBuffer.wrap(
  //         MessageAuthenticationDigests.HmacSHA256.of( masterPasswordBytes, fullName.getBytes( charset ) ) );
  // Arrays.fill( masterPasswordBytes, (byte) 0 );

  // IntBuffer identiconSeedBuffer = IntBuffer.allocate( identiconSeedBytes.capacity() );
  // while (identiconSeedBytes.hasRemaining())
  //     identiconSeedBuffer.put( UnsignedBytes.toInt( identiconSeedBytes.get() ) );
  // int[] identiconSeed = identiconSeedBuffer.array();

  // color = colors[identiconSeed[4] % colors.length];
  // text = strf( "%c%c%c%c", leftArm[identiconSeed[0] % leftArm.length], body[identiconSeed[1] % body.length],
  //               rightArm[identiconSeed[2] % rightArm.length], accessory[identiconSeed[3] % accessory.length] );

  // ----------------

  // byte[] masterPasswordBytes = charset.encode(CharBuffer.wrap(masterPassword)).array();
  // ByteBuffer identiconSeedBytes = ByteBuffer.wrap(
  //         MessageAuthenticationDigests.HmacSHA256.of(masterPasswordBytes, fullName.getBytes(charset)));
  // Arrays.fill(masterPasswordBytes, (byte) 0);

  // IntBuffer identiconSeedBuffer = IntBuffer.allocate(identiconSeedBytes.capacity());
  // while (identiconSeedBytes.hasRemaining())
  //     identiconSeedBuffer.put(identiconSeedBytes.get() & 0xFF);
  // int[] identiconSeed = identiconSeedBuffer.array();

  // ----------------

  const masterPasswordBytes: number[] = password
    .split('')
    .map(c => c.charCodeAt(0));
  const identiconSeedBytes = Crypto.HmacSHA256(password, fullName);
  // const identiconSeedBuffer = identiconSeedBytes.map(identiconSeedByte => identiconSeedByte & 0xff);

  const identiconSeed = identiconSeedBytes;

  console.log({ identiconSeed, arr: identiconSeed.toString(Crypto.enc.Utf8) });

  const color = COLORS[identiconSeed[4] % COLORS.length];
  const text = [
    leftArm[identiconSeed[0] % leftArm.length],
    body[identiconSeed[1] % body.length],
    rightArm[identiconSeed[2] % rightArm.length],
    accessory[identiconSeed[3] % accessory.length],
  ].join('');

  return [color, text];
}

export default generate;
