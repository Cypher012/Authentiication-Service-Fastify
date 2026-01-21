export type SessionRequestType = {
  userId: string;
  refreshTokenHash: string;
  deviceBrowser: string;
  deviceType: string;
  deviceOS: string;
  ipAddress: string;
  expiresAt: Date;
};

export type SessionResponseType = {
  id: string;
  userId: string;
  deviceBrowser: string;
  deviceType: string;
  deviceOS: string;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};
