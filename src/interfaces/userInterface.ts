import { ResidentUser } from '../db/models';

export const gender = ['male', 'female', 'other'] as const;
export type genderT = typeof gender[number];

export const role = ['admin', 'village_chief', 'resident'] as const;
export type roleT = typeof role[number];

export const maritalStatus = ['married', 'divorced', 'single', 'widowed', 'other'] as const;
export type maritalStatusT = typeof maritalStatus[number];

export interface ResidentResult {
    count: number;
    rows: ResidentUser[];
}
