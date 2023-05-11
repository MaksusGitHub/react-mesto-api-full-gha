class AccessRightsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessRightsError';
    this.statusCode = 403;
  }
}

module.exports = AccessRightsError;
