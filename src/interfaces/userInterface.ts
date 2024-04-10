export const gender = ['male', 'female', 'other'] as const;
export type genderT = typeof gender[number];

export const role = ['admin', 'village_chief', 'resident'] as const;
export type roleT = typeof role[number];

export const maritalStatus = ['married', 'divorced', 'single', 'widowed'] as const;
export type maritalStatusT = typeof role[number];
