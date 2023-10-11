export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Address {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
  geo?: {
    lat?: string;
    lng?: string;
  };
}

export interface UsersState {
  entities: User[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface UserState {
  entity: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialUserState: UserState = {
  entity: null,
  status: "idle",
  error: null,
};

export const initialUsersState: UsersState = {
  entities: null,
  status: "idle",
  error: null,
};

export interface RootState {
  user: UserState;
  users: UsersState;
}
