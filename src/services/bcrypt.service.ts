import bcrypt from "bcrypt";

const saltRounds = 10;

export class BcryptService {
  async hashPassword(rawPassword: string): Promise<string> {
    const hash = await bcrypt.hash(rawPassword, saltRounds);
    return hash;
  }
  async comparePassword(
    rawPassword: string,
    hashPassword: string,
  ): Promise<Boolean> {
    const result = await bcrypt.compare(rawPassword, hashPassword);
    return result;
  }
}
