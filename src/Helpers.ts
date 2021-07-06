/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { UInt64 } from 'symbol-sdk';

export const AddressShortener = (address: string): string => {
  return [
    address.substr(0, 4),
    '...',
    address.substr(-3)
  ].join('-');
}

export const HashShortener = (hash: string): string => {
  return [
    hash.substr(0, 6),
    '...',
    hash.substr(-4)
  ].join('');
}

export const UInt64Parser = (input: any): UInt64 => {
  if ('lower' in input && 'higher' in input) {
    return new UInt64([input.lower, input.higher]);
  }
  else if ('length' in input && input.length) {
    return new UInt64(input);
  }

  const num = parseInt(input);
  return UInt64.fromUint(num);
}