export interface PendingEmailUpdate {
  newEmail: string;
  token: string;
  expires: Date;
}

export default class User {
  public id: string | null;
  public name: string | null;
  public email: string;
  public password?: string;
  public pendingEmailUpdate: PendingEmailUpdate | null;

  constructor(
    id: string | null = null,
    name: string | null = null,
    email: string,
    password?: string
  ) {
    if (!email || !password) {
      throw new Error('User must have an email and password');
    }
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.pendingEmailUpdate = null;
  }

  // Domain methods related to User

  updateName(newName: string): void {
    if (!newName) {
      throw new Error('User name cannot be empty');
    }
    this.name = newName;
  }

  setPendingEmailUpdate(newEmail: string, token: string): void {
    this.pendingEmailUpdate = {
      newEmail,
      token,
      expires: new Date(Date.now() + 3600000), // 1 hour expiration
    };
  }

  clearPendingEmailUpdate(): void {
    this.pendingEmailUpdate = null;
  }

  updateEmail(newEmail: string): void {
    if (!newEmail) {
      throw new Error('Email cannot be empty');
    }
    this.email = newEmail;
  }

  /**
   * Initiates an email update request by setting pending email update details.
   * @param {string} newEmail - The new email address.
   * @param {string} token - The confirmation token for the email update.
   */
  requestEmailUpdate(newEmail: string, token: string): void {
    if (!newEmail) {
      throw new Error('New email is required for update request');
    }
    if (!token) {
      throw new Error('Token is required for email update request');
    }
    this.setPendingEmailUpdate(newEmail, token);
  }

  /**
   * Updates the user's password.
   * @param {string} newPassword - The new password for the user.
   * @throws {Error} If the new password is empty.
   */
  updatePassword(newPassword: string): void {
    if (!newPassword) {
      throw new Error('Password cannot be empty');
    }
    this.password = newPassword;
  }
}
