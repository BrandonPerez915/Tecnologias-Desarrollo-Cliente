import { Component, signal } from '@angular/core';
import { UsersTable } from '../users-table/users-table';
import { UserInfo } from '../user-info/user-info';
import { User } from '../../interfaces/user';

@Component({
  imports: [UsersTable, UserInfo],
  selector: 'app-table-display',
  templateUrl: './table-display.html',
})
export class TableDisplay {
  readonly selectedUser = signal<User | null>(null);
}
