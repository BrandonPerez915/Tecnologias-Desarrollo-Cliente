import { Component, input, output } from '@angular/core';
import { User } from '../../interfaces/user';

@Component({
  imports: [],
  selector: 'app-user-info',
  templateUrl: './user-info.html',
})
export class UserInfo {
  readonly user = input<User | null>(null);
  readonly clearUser = output<void>();
}
