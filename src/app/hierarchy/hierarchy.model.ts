export interface Employee {
  id: string;
  name: string;
  managerId: string | null;
  imageUrl: string;
  email: string;
  subordinates: string[] | null;
  designation: string;
}
