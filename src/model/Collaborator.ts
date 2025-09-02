import { Book } from './Book.js';
import { Permission } from './Enums.js';
import * as CollaboratorService from '../service/collaborator-service.js';

/**
 * This class defines a Collaborator of a [[Book]].
 * 
 * A Collaborator represents a user that has been granted access to a Book with specific permissions.
 * 
 * @public
 */
export class Collaborator {

  public payload: bkper.Collaborator;

  /** @internal */
  private book: Book;

  constructor(book: Book, payload?: bkper.Collaborator) {
    this.book = book;
    this.payload = payload || {};
  }

  /**
   * Gets an immutable copy of the JSON payload.
   *
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.Collaborator {
    return { ...this.payload };
  }

  /**
   * Gets the Collaborator internal id.
   *
   * @returns The Collaborator internal id
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the Collaborator email address.
   *
   * @returns The Collaborator email address
   */
  public getEmail(): string | undefined {
    return this.payload.email;
  }

  /**
   * Sets the email address of the Collaborator.
   *
   * @param email - The email address to set
   *
   * @returns This Collaborator, for chaining
   */
  public setEmail(email: string): Collaborator {
    this.payload.email = email;
    return this;
  }

  /**
   * Gets the permission level of the Collaborator.
   *
   * @returns The permission level
   */
  public getPermission(): Permission | undefined {
    return this.payload.permission as Permission;
  }

  /**
   * Sets the permission level of the Collaborator.
   *
   * @param permission - The permission level to set
   *
   * @returns This Collaborator, for chaining
   */
  public setPermission(permission: Permission): Collaborator {
    this.payload.permission = permission;
    return this;
  }

  /**
   * Performs create new Collaborator.
   *
   * @returns Promise with the created Collaborator
   */
  public async create(message?: string): Promise<Collaborator> {
    this.payload = await CollaboratorService.addOrUpdateCollaborator(this.book.getId(), this.payload, message);
    this.book.clearCollaboratorCache();
    return this;
  }

  /**
   * Performs update Collaborator.
   *
   * @returns Promise with the updated Collaborator
   */
  public async update(): Promise<Collaborator> {
    this.payload = await CollaboratorService.addOrUpdateCollaborator(this.book.getId(), this.payload);
    this.book.clearCollaboratorCache();
    return this;
  }

  /**
   * Performs remove Collaborator.
   *
   * @returns Promise with the removed Collaborator
   */
  public async remove(): Promise<Collaborator> {
    const email = this.getEmail();
    if (!email) {
      throw new Error('Collaborator email is required');
    }
    this.payload = await CollaboratorService.removeCollaborator(this.book.getId(), email);
    this.book.clearCollaboratorCache();
    return this;
  }

}
