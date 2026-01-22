export type SessionRequestType = {
  userId: string;
  refreshTokenHash: string;
  ipAddress: string;
  expiresAt: Date;
};

export type SessionResponseType = {
  id: string;
  userId: string;
  deviceBrowser: string | null;
  deviceType: string | null;
  deviceOS: string | null;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};
