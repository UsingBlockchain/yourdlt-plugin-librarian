/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
/**
 * @description This model describes individual booklets that
 * can hold tagged entities and semantics for tags and groups.
 */
export class BookletModel {
  constructor(
    public readonly profileName: string,
    public readonly name: string,
    public readonly tags: string[],
    public readonly createdAt: number,
    public readonly updatedAt: number
  ) {}
}
