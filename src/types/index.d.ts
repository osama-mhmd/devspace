export type OptionalParts<T> = {
  [P in keyof T as null extends T[P] ? P : never]?: T[P];
};

export type RequiredParts<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

export type MakeNullableFieldsOptional<T> = OptionalParts<T> & RequiredParts<T>;
