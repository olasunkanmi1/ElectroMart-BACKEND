import crypto from 'crypto';

// create an MD5 hash of the string and output it in hexadecimal format.
const hashString = (value: string) => crypto.createHash('md5').update(value).digest('hex')

export default hashString